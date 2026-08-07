const crypto = require('crypto');

function cleanText(value, maxLength) {
    return String(value == null ? '' : value)
        .replace(/[\u0000-\u001f\u007f]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength);
}

function finiteNumber(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.min(max, Math.max(min, number));
}

function normalizeOrder(input) {
    if (!input || typeof input !== 'object') {
        const error = new Error('Pedido inválido.');
        error.statusCode = 400;
        throw error;
    }

    const clientName = cleanText(input.clientName || input.customerName, 80);
    if (clientName.length < 2) {
        const error = new Error('Informe um nome válido.');
        error.statusCode = 400;
        throw error;
    }

    if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 50) {
        const error = new Error('A lista de itens do pedido é inválida.');
        error.statusCode = 400;
        throw error;
    }

    const items = input.items.map(item => {
        const name = cleanText(item && (item.name || item.itemName), 160);
        if (!name) {
            const error = new Error('O pedido contém um item inválido.');
            error.statusCode = 400;
            throw error;
        }
        return {
            name,
            categoryName: cleanText(item.categoryName, 80),
            categoryId: cleanText(item.categoryId, 80),
            itemName: cleanText(item.itemName || name, 100),
            itemDetails: cleanText(item.itemDetails, 100),
            price: finiteNumber(item.price, 0, 10000)
        };
    });

    const requestedId = cleanText(input.id, 50);
    const id = /^PS-[A-Z0-9-]{6,40}$/i.test(requestedId)
        ? requestedId.toUpperCase()
        : `PS-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    return {
        id,
        clientName,
        items,
        totalKcal: finiteNumber(input.totalKcal, 0, 100000),
        totalProtein: finiteNumber(input.totalProtein, 0, 10000),
        totalPrice: items.reduce((total, item) => total + item.price, 0),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
}

const ALLOWED_ORDER_STATUSES = new Set(['pending', 'preparing', 'completed', 'cancelled', 'deleted']);

function normalizeStatus(value) {
    const status = String(value || '');
    if (!ALLOWED_ORDER_STATUSES.has(status)) {
        const error = new Error('Status de pedido inválido.');
        error.statusCode = 400;
        throw error;
    }
    return status;
}

module.exports = {
    ALLOWED_ORDER_STATUSES,
    cleanText,
    finiteNumber,
    normalizeOrder,
    normalizeStatus
};
