const MAX_JSON_BYTES = 64 * 1024;

function setSecurityHeaders(res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
}

function getRequestOrigin(req) {
    const forwardedHost = req.headers && req.headers['x-forwarded-host'];
    const host = forwardedHost || (req.headers && req.headers.host);
    const forwardedProto = req.headers && req.headers['x-forwarded-proto'];
    const proto = forwardedProto || (host && /^(localhost|127\.0\.0\.1)(:|$)/.test(host) ? 'http' : 'https');
    return host ? `${proto}://${host}` : '';
}

function requireSameOrigin(req, res) {
    const origin = req.headers && req.headers.origin;
    const configuredOrigin = process.env.APP_ORIGIN;
    const expectedOrigin = configuredOrigin || getRequestOrigin(req);

    if (origin && expectedOrigin && origin !== expectedOrigin) {
        res.status(403).json({ success: false, error: 'Origem não autorizada.' });
        return false;
    }
    return true;
}

function requireMethod(req, res, methods) {
    const allowed = Array.isArray(methods) ? methods : [methods];
    if (!allowed.includes(req.method)) {
        res.setHeader('Allow', allowed.join(', '));
        res.status(405).json({ success: false, error: 'Método não permitido.' });
        return false;
    }
    return true;
}

function assertBodySize(body, maxBytes = MAX_JSON_BYTES) {
    const bytes = Buffer.byteLength(JSON.stringify(body || {}), 'utf8');
    if (bytes > maxBytes) {
        const error = new Error('O conteúdo enviado excede o limite permitido.');
        error.statusCode = 413;
        throw error;
    }
}

async function rateLimit(client, key, limit, windowSeconds) {
    const count = await client.incr(key);
    if (count === 1) {
        await client.expire(key, windowSeconds);
    }
    return count <= limit;
}

function getClientIp(req) {
    const forwarded = req.headers && req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded) {
        return forwarded.split(',')[0].trim().slice(0, 80);
    }
    return String((req.socket && req.socket.remoteAddress) || 'unknown').slice(0, 80);
}

module.exports = {
    MAX_JSON_BYTES,
    assertBodySize,
    getClientIp,
    rateLimit,
    requireMethod,
    requireSameOrigin,
    setSecurityHeaders
};
