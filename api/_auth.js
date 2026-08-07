const crypto = require('crypto');

const COOKIE_NAME = 'powershake_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

function getConfiguredAdminPin() {
    if (process.env.ADMIN_PIN) return String(process.env.ADMIN_PIN);
    if (process.env.NODE_ENV !== 'production') return '1234';
    return '';
}

function parseCookies(req) {
    const header = (req.headers && req.headers.cookie) || '';
    return header.split(';').reduce((cookies, part) => {
        const index = part.indexOf('=');
        if (index === -1) return cookies;
        const key = part.slice(0, index).trim();
        const value = part.slice(index + 1).trim();
        if (key) cookies[key] = decodeURIComponent(value);
        return cookies;
    }, {});
}

function hashPin(pin, salt = crypto.randomBytes(16).toString('hex')) {
    const hash = crypto.scryptSync(String(pin), salt, 32).toString('hex');
    return { salt, hash };
}

function verifyPin(pin, salt, expectedHash) {
    if (!pin || !salt || !expectedHash) return false;
    const actual = crypto.scryptSync(String(pin), salt, 32);
    const expected = Buffer.from(expectedHash, 'hex');
    return expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
}

function normalizeUserForClient(user) {
    return {
        id: String(user.id),
        name: String(user.name || ''),
        username: String(user.username || ''),
        role: user.role === 'admin' ? 'admin' : 'cozinha',
        hasPin: Boolean(user.pinHash)
    };
}

function mergeAuthUsers(existingUsers, incomingUsers) {
    if (!Array.isArray(incomingUsers) || incomingUsers.length > 50) {
        const error = new Error('Lista de usuários inválida.');
        error.statusCode = 400;
        throw error;
    }

    const existingById = new Map((existingUsers || []).map(user => [String(user.id), user]));
    const usernames = new Set();

    return incomingUsers.map(raw => {
        const id = String(raw.id || '').trim().slice(0, 80);
        const name = String(raw.name || '').trim().slice(0, 100);
        const username = String(raw.username || '').trim().toLowerCase().slice(0, 100);
        const role = raw.role === 'admin' ? 'admin' : 'cozinha';
        if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id) || !name || !/^[a-z0-9._@-]{2,100}$/.test(username) || usernames.has(username)) {
            const error = new Error('Usuário inválido ou nome de usuário duplicado.');
            error.statusCode = 400;
            throw error;
        }
        usernames.add(username);

        const previous = existingById.get(id);
        let salt = previous && previous.pinSalt;
        let pinHash = previous && previous.pinHash;
        const newPin = String(raw.pin || '').trim();
        if (newPin) {
            if (newPin.length < 4 || newPin.length > 64) {
                const error = new Error('O PIN deve ter entre 4 e 64 caracteres.');
                error.statusCode = 400;
                throw error;
            }
            const hashed = hashPin(newPin);
            salt = hashed.salt;
            pinHash = hashed.hash;
        }
        if (!salt || !pinHash) {
            const error = new Error(`Defina um PIN para o usuário ${name}.`);
            error.statusCode = 400;
            throw error;
        }
        return { id, name, username, role, pinSalt: salt, pinHash };
    });
}

async function authenticatePin(client, pin) {
    const value = String(pin || '').trim();
    if (!value) return null;

    const adminPin = getConfiguredAdminPin();
    if (adminPin && value === adminPin) {
        return { id: 'environment-admin', name: 'Administrador', username: 'admin', role: 'admin' };
    }

    const raw = await client.get('auth_users');
    const users = raw ? JSON.parse(raw) : [];
    const matched = users.find(user => verifyPin(value, user.pinSalt, user.pinHash));
    return matched ? normalizeUserForClient(matched) : null;
}

async function createSession(client, user) {
    const token = crypto.randomBytes(32).toString('hex');
    await client.set(`auth_session:${token}`, JSON.stringify(user), { EX: SESSION_TTL_SECONDS });
    return token;
}

function setSessionCookie(req, res, token) {
    const secure = process.env.NODE_ENV === 'production' || (req.headers && req.headers['x-forwarded-proto'] === 'https');
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure ? '; Secure' : ''}`);
}

function clearSessionCookie(req, res) {
    const secure = process.env.NODE_ENV === 'production' || (req.headers && req.headers['x-forwarded-proto'] === 'https');
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`);
}

async function getSession(client, req) {
    const token = parseCookies(req)[COOKIE_NAME];
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    const raw = await client.get(`auth_session:${token}`);
    if (!raw) return null;
    await client.expire(`auth_session:${token}`, SESSION_TTL_SECONDS);
    return { token, user: JSON.parse(raw) };
}

async function requireAuth(client, req, res, allowedRoles = ['admin', 'cozinha']) {
    const session = await getSession(client, req);
    if (!session || !allowedRoles.includes(session.user.role)) {
        res.status(401).json({ success: false, error: 'Sessão inválida ou expirada.' });
        return null;
    }
    return session;
}

module.exports = {
    COOKIE_NAME,
    SESSION_TTL_SECONDS,
    authenticatePin,
    clearSessionCookie,
    createSession,
    getConfiguredAdminPin,
    getSession,
    hashPin,
    mergeAuthUsers,
    normalizeUserForClient,
    parseCookies,
    requireAuth,
    setSessionCookie,
    verifyPin
};
