const { createClient } = require('redis');
const { requireAuth } = require('./_auth');
const { getOrders } = require('./_orders');
const { requireMethod, setSecurityHeaders } = require('./_security');

module.exports = async (req, res) => {
    setSecurityHeaders(res);
    if (!requireMethod(req, res, 'GET')) return;

    const { REDIS_URL } = process.env;
    if (!REDIS_URL) {
        res.status(503).json({ success: false, error: 'Serviço de pedidos indisponível.', orders: [] });
        return;
    }

    let client;
    try {
        client = createClient({ url: REDIS_URL });
        client.on('error', error => console.error('Redis error:', error.message));
        await client.connect();
        if (!await requireAuth(client, req, res)) return;

        res.status(200).json({ success: true, orders: await getOrders(client) });
    } catch (error) {
        console.error('get-orders error:', error.message);
        res.status(500).json({ success: false, error: 'Não foi possível carregar os pedidos.', orders: [] });
    } finally {
        if (client) {
            try { await client.disconnect(); } catch {}
        }
    }
};
