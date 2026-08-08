const { createClient } = require('redis');
const { requireAuth } = require('./_auth');
const { saveMenuItem } = require('./_menu-items');
const { assertBodySize, requireMethod, requireSameOrigin, setSecurityHeaders } = require('./_security');

module.exports = async (req, res) => {
    setSecurityHeaders(res);
    if (!requireMethod(req, res, 'POST') || !requireSameOrigin(req, res)) return;
    if (!process.env.REDIS_URL) {
        res.status(503).json({ success: false, error: 'Banco de dados indisponivel.' });
        return;
    }

    let client;
    try {
        assertBodySize(req.body, 2.5 * 1024 * 1024);
        client = createClient({ url: process.env.REDIS_URL });
        client.on('error', error => console.error('Redis error:', error.message));
        await client.connect();
        if (!await requireAuth(client, req, res, ['admin'])) return;

        const change = req.body || {};
        const item = await saveMenuItem(client, change);
        res.status(200).json({ success: true, item });
    } catch (error) {
        console.error('save-menu-item error:', error.message);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.statusCode ? error.message : 'Nao foi possivel salvar o item.'
        });
    } finally {
        if (client) {
            try { await client.disconnect(); } catch {}
        }
    }
};
