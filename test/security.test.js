const test = require('node:test');
const assert = require('node:assert/strict');

const { SESSION_TTL_SECONDS, hashPin, mergeAuthUsers, setSessionCookie, verifyPin } = require('../api/_auth');
const { requireMethod, requireSameOrigin } = require('../api/_security');
const { normalizeOrder, normalizeStatus } = require('../api/_validation');

function responseMock() {
    return {
        headers: {},
        statusCode: 200,
        payload: null,
        setHeader(name, value) { this.headers[name] = value; },
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.payload = payload; return this; }
    };
}

test('sessão administrativa permanece válida por 30 dias', () => {
    const res = responseMock();
    setSessionCookie({ headers: { 'x-forwarded-proto': 'https' } }, res, 'token-seguro');
    assert.equal(SESSION_TTL_SECONDS, 30 * 24 * 60 * 60);
    assert.match(res.headers['Set-Cookie'], /Max-Age=2592000/);
    assert.match(res.headers['Set-Cookie'], /HttpOnly/);
    assert.match(res.headers['Set-Cookie'], /Secure/);
    assert.match(res.headers['Set-Cookie'], /SameSite=Lax/);
});
test('PINs são armazenados com salt e hash', () => {
    const stored = hashPin('739184');
    assert.notEqual(stored.hash, '739184');
    assert.equal(verifyPin('739184', stored.salt, stored.hash), true);
    assert.equal(verifyPin('000000', stored.salt, stored.hash), false);
});

test('edição sem novo PIN preserva o hash existente', () => {
    const stored = hashPin('123456');
    const existing = [{
        id: 'user-1',
        name: 'Cozinha',
        username: 'cozinha',
        role: 'cozinha',
        pinSalt: stored.salt,
        pinHash: stored.hash
    }];
    const merged = mergeAuthUsers(existing, [{
        id: 'user-1',
        name: 'Equipe',
        username: 'equipe',
        role: 'cozinha',
        pin: ''
    }]);
    assert.equal(merged[0].pinHash, stored.hash);
    assert.equal(merged[0].name, 'Equipe');
});

test('pedido é normalizado e campos autoritativos são definidos no servidor', () => {
    const order = normalizeOrder({
        id: 'PS-123456',
        clientName: '  Ana\u0000 Silva  ',
        status: 'completed',
        totalPrice: 999999,
        items: [{ name: 'Fruta: Banana', itemName: 'Banana', price: 4.5 }]
    });
    assert.equal(order.id, 'PS-123456');
    assert.equal(order.clientName, 'Ana Silva');
    assert.equal(order.status, 'pending');
    assert.equal(order.totalPrice, 4.5);
});

test('status arbitrário é rejeitado', () => {
    assert.throws(() => normalizeStatus('hacked'), /Status de pedido inválido/);
    assert.equal(normalizeStatus('preparing'), 'preparing');
});

test('método e origem diferentes são rejeitados', () => {
    const methodRes = responseMock();
    assert.equal(requireMethod({ method: 'DELETE' }, methodRes, 'POST'), false);
    assert.equal(methodRes.statusCode, 405);

    const originRes = responseMock();
    const req = {
        headers: {
            origin: 'https://malicioso.example',
            host: 'powershake.example',
            'x-forwarded-proto': 'https'
        }
    };
    assert.equal(requireSameOrigin(req, originRes), false);
    assert.equal(originRes.statusCode, 403);
});
