const test = require('node:test');
const assert = require('node:assert/strict');

function responseMock() {
    return {
        headers: {},
        statusCode: 200,
        payload: null,
        setHeader(name, value) { this.headers[name] = value; },
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.payload = payload; return this; },
        end() { return this; }
    };
}

test('save-order não confirma pedido quando o banco está ausente', async () => {
    const previous = process.env.REDIS_URL;
    delete process.env.REDIS_URL;
    const handler = require('../api/save-order');
    const res = responseMock();
    await handler({ method: 'POST', headers: {}, body: {} }, res);
    assert.equal(res.statusCode, 503);
    assert.equal(res.payload.success, false);
    if (previous) process.env.REDIS_URL = previous;
});

test('get-menu sem banco não expõe configurações privadas', async () => {
    const previous = process.env.REDIS_URL;
    delete process.env.REDIS_URL;
    const handler = require('../api/get-menu');
    const res = responseMock();
    await handler({ method: 'GET', headers: {} }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.settings, null);
    if (previous) process.env.REDIS_URL = previous;
});
