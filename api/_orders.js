const ORDER_INDEX_KEY = 'orders:index';
const MAX_ORDERS = 200;

function orderKey(id) {
    return `order:${id}`;
}

async function migrateLegacyOrders(client) {
    const count = await client.zCard(ORDER_INDEX_KEY);
    if (count > 0) return;

    const legacyRaw = await client.get('orders');
    if (!legacyRaw) return;
    let legacy;
    try {
        legacy = JSON.parse(legacyRaw);
    } catch {
        return;
    }
    if (!Array.isArray(legacy)) return;

    const multi = client.multi();
    legacy.slice(0, MAX_ORDERS).forEach((order, index) => {
        if (!order || !/^PS-[A-Z0-9-]{6,40}$/i.test(String(order.id || ''))) return;
        const score = Date.parse(order.createdAt || order.timestamp) || (Date.now() - index);
        multi.set(orderKey(order.id), JSON.stringify(order));
        multi.zAdd(ORDER_INDEX_KEY, [{ score, value: String(order.id) }]);
    });
    await multi.exec();
}

async function saveOrder(client, order) {
    const key = orderKey(order.id);
    const inserted = await client.set(key, JSON.stringify(order), { NX: true });
    if (!inserted) {
        const error = new Error('Não foi possível gerar um identificador único para o pedido.');
        error.statusCode = 409;
        throw error;
    }

    await client.zAdd(ORDER_INDEX_KEY, [{ score: Date.parse(order.createdAt), value: order.id }]);
    const total = await client.zCard(ORDER_INDEX_KEY);
    if (total > MAX_ORDERS) {
        const oldIds = await client.zRange(ORDER_INDEX_KEY, 0, total - MAX_ORDERS - 1);
        if (oldIds.length) {
            const multi = client.multi();
            oldIds.forEach(id => multi.del(orderKey(id)));
            multi.zRem(ORDER_INDEX_KEY, oldIds);
            await multi.exec();
        }
    }
}

async function getOrders(client) {
    await migrateLegacyOrders(client);
    const ids = await client.zRange(ORDER_INDEX_KEY, 0, MAX_ORDERS - 1, { REV: true });
    if (!ids.length) return [];
    const values = await client.mGet(ids.map(orderKey));
    return values.flatMap(value => {
        if (!value) return [];
        try {
            return [JSON.parse(value)];
        } catch {
            return [];
        }
    });
}

async function updateOrderStatus(client, id, status) {
    await migrateLegacyOrders(client);
    const key = orderKey(id);
    if (status === 'deleted') {
        const removed = await client.del(key);
        await client.zRem(ORDER_INDEX_KEY, id);
        return removed > 0;
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
        await client.watch(key);
        const raw = await client.get(key);
        if (!raw) {
            await client.unwatch();
            return false;
        }
        const order = JSON.parse(raw);
        order.status = status;
        const result = await client.multi().set(key, JSON.stringify(order)).exec();
        if (result) return true;
    }
    const error = new Error('O pedido foi atualizado simultaneamente. Tente novamente.');
    error.statusCode = 409;
    throw error;
}

module.exports = {
    MAX_ORDERS,
    ORDER_INDEX_KEY,
    getOrders,
    migrateLegacyOrders,
    orderKey,
    saveOrder,
    updateOrderStatus
};
