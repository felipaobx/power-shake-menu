const { createClient } = require('redis');
const { authenticatePin, createSession, getConfiguredAdminPin, setSessionCookie } = require('./_auth');
const { assertBodySize, getClientIp, rateLimit, requireMethod, requireSameOrigin, setSecurityHeaders } = require('./_security');

module.exports = async (req, res) => {
    setSecurityHeaders(res);
    if (!requireMethod(req, res, 'POST') || !requireSameOrigin(req, res)) return;

    if (!process.env.REDIS_URL) {
        res.status(503).json({ success: false, error: 'Autenticação indisponível.' });
        return;
    }
    if (!getConfiguredAdminPin() && process.env.NODE_ENV === 'production') {
        res.status(503).json({ success: false, error: 'Configure ADMIN_PIN antes de acessar o painel.' });
        return;
    }

    let client;
    try {
        assertBodySize(req.body, 2048);
        client = createClient({ url: process.env.REDIS_URL });
        client.on('error', error => console.error('Redis error:', error.message));
        await client.connect();

        const ip = getClientIp(req);
        if (!await rateLimit(client, `rate:auth:${ip}`, 8, 300)) {
            res.status(429).json({ success: false, error: 'Muitas tentativas. Aguarde cinco minutos.' });
            return;
        }

        const pin = String(req.body && req.body.pin || '');
        const user = await authenticatePin(client, pin);
        if (!user) {
            res.status(401).json({ success: false, error: 'PIN incorreto.' });
            return;
        }

        const token = await createSession(client, user);
        setSessionCookie(req, res, token);
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('auth-login error:', error.message);
        res.status(500).json({ success: false, error: 'Não foi possível autenticar.' });
    } finally {
        if (client) {
            try { await client.disconnect(); } catch {}
        }
    }
};
