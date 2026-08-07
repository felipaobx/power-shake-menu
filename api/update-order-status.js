const { createClient } = require('redis');
const { requireAuth } = require('./_auth');
const { updateOrderStatus } = require('./_orders');
const { assertBodySize, requireMethod, requireSameOrigin, setSecurityHeaders } = require('./_security');
const { cleanText, normalizeStatus } = require('./_validation');

module.exports = async (req, res) => {
    setSecurityHeaders(res);
    if (!requireMethod(req, res, 'POST') || !requireSameOrigin(req, res)) return;

    const { REDIS_URL } = process.env;
    if (!REDIS_URL) {
        res.status(503).json({ success: false, error: 'Serviço de pedidos indisponível.' });
        return;
    }

    let client;
    try {
        assertBodySize(req.body, 4096);
        client = createClient({ url: REDIS_URL });
        client.on('error', error => console.error('Redis error:', error.message));
        await client.connect();
        if (!await requireAuth(client, req, res)) return;

        const orderId = cleanText(req.body && req.body.orderId, 100);
        const status = normalizeStatus(req.body && req.body.status);
        if (!orderId) {
            res.status(400).json({ success: false, error: 'Pedido não informado.' });
            return;
        }

        const found = await updateOrderStatus(client, orderId, status);
        if (!found) {
            res.status(404).json({ success: false, error: 'Pedido não encontrado.' });
            return;
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('update-order-status error:', error.message);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.statusCode ? error.message : 'Não foi possível atualizar o pedido.'
        });
    } finally {
        if (client) {
            try { await client.disconnect(); } catch {}
        }
    }
};
