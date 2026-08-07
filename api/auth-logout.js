const { createClient } = require('redis');
const { clearSessionCookie, getSession } = require('./_auth');
const { requireMethod, requireSameOrigin, setSecurityHeaders } = require('./_security');

module.exports = async (req, res) => {
    setSecurityHeaders(res);
    if (!requireMethod(req, res, 'POST') || !requireSameOrigin(req, res)) return;

    let client;
    try {
        if (process.env.REDIS_URL) {
            client = createClient({ url: process.env.REDIS_URL });
        client.on('error', error => console.error('Redis error:', error.message));
            await client.connect();
            const session = await getSession(client, req);
            if (session) await client.del(`auth_session:${session.token}`);
        }
        clearSessionCookie(req, res);
        res.status(200).json({ success: true });
    } catch (error) {
        clearSessionCookie(req, res);
        res.status(200).json({ success: true });
    } finally {
        if (client) {
            try { await client.disconnect(); } catch {}
        }
    }
};
