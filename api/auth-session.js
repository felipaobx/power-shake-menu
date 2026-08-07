const { createClient } = require('redis');
const { getSession, setSessionCookie } = require('./_auth');
const { requireMethod, setSecurityHeaders } = require('./_security');

module.exports = async (req, res) => {
    setSecurityHeaders(res);
    if (!requireMethod(req, res, 'GET')) return;
    if (!process.env.REDIS_URL) {
        res.status(503).json({ success: false, authenticated: false });
        return;
    }

    let client;
    try {
        client = createClient({ url: process.env.REDIS_URL });
        client.on('error', error => console.error('Redis error:', error.message));
        await client.connect();
        const session = await getSession(client, req);
        if (!session) {
            res.status(401).json({ success: false, authenticated: false });
            return;
        }
        // Refresh both the Redis TTL and the persistent browser cookie whenever
        // an authenticated administrator returns to the dashboard.
        setSessionCookie(req, res, session.token);
        res.status(200).json({ success: true, authenticated: true, user: session.user });
    } catch (error) {
        console.error('auth-session error:', error.message);
        res.status(503).json({ success: false, authenticated: false });
    } finally {
        if (client) {
            try { await client.disconnect(); } catch {}
        }
    }
};
