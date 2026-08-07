const { createClient } = require('redis');
const { saveOrder } = require('./_orders');
const { assertBodySize, getClientIp, rateLimit, requireMethod, requireSameOrigin, setSecurityHeaders } = require('./_security');
const { normalizeOrder } = require('./_validation');

module.exports = async (req, res) => {
    setSecurityHeaders(res);
    if (!requireMethod(req, res, 'POST') || !requireSameOrigin(req, res)) return;

    const { REDIS_URL } = process.env;
    if (!REDIS_URL) {
        res.status(503).json({ success: false, error: 'Serviço de pedidos temporariamente indisponível.' });
        return;
    }

    let client;
    try {
        assertBodySize(req.body);
        client = createClient({ url: REDIS_URL });
        client.on('error', error => console.error('Redis error:', error.message));
        await client.connect();

        const ip = getClientIp(req);
        if (!await rateLimit(client, `rate:save-order:${ip}`, 20, 60)) {
            res.status(429).json({ success: false, error: 'Muitos pedidos enviados. Aguarde um minuto.' });
            return;
        }

        const order = normalizeOrder(req.body);
        await saveOrder(client, order);
        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('save-order error:', error.message);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.statusCode ? error.message : 'Não foi possível registrar o pedido.'
        });
    } finally {
        if (client) {
            try { await client.disconnect(); } catch {}
        }
    }
};
