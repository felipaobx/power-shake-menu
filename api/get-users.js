const { createClient } = require('redis');
const { normalizeUserForClient, requireAuth } = require('./_auth');
const { requireMethod, setSecurityHeaders } = require('./_security');

module.exports = async (req, res) => {
    setSecurityHeaders(res);
    if (!requireMethod(req, res, 'GET')) return;
    if (!process.env.REDIS_URL) {
        res.status(503).json({ success: false, users: [] });
        return;
    }

    let client;
    try {
        client = createClient({ url: process.env.REDIS_URL });
        client.on('error', error => console.error('Redis error:', error.message));
        await client.connect();
        if (!await requireAuth(client, req, res, ['admin'])) return;
        const raw = await client.get('auth_users');
        const users = raw ? JSON.parse(raw).map(normalizeUserForClient) : [];
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('get-users error:', error.message);
        res.status(500).json({ success: false, error: 'Não foi possível carregar os usuários.', users: [] });
    } finally {
        if (client) {
            try { await client.disconnect(); } catch {}
        }
    }
};
