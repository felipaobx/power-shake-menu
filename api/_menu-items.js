const crypto = require('crypto');

function cleanText(value, maxLength) {
    return String(value == null ? '' : value).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength);
}

function finiteNumber(value, min = 0, max = 100000) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : 0;
}

function normalizeMenuItem(rawItem, existingItem = null) {
    const raw = rawItem && typeof rawItem === 'object' ? rawItem : {};
    const id = cleanText(raw.id, 80) || `item_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const name = cleanText(raw.name, 160);
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id) || !name) {
        const error = new Error('Item invalido. Informe um nome e tente novamente.');
        error.statusCode = 400;
        throw error;
    }

    const image = String(raw.image || '');
    if (image && (!/^data:image\/(png|jpeg|webp);base64,/i.test(image) || image.length > 2 * 1024 * 1024)) {
        const error = new Error('A imagem do item e invalida ou muito grande.');
        error.statusCode = 413;
        throw error;
    }

    const versions = Array.isArray(raw.versions)
        ? raw.versions.slice(0, 20).map(value => cleanText(value, 80)).filter(Boolean)
        : undefined;

    return {
        ...(existingItem || {}),
        id,
        name,
        icon: cleanText(raw.icon, 24),
        image,
        kcal: finiteNumber(raw.kcal),
        carbs: finiteNumber(raw.carbs),
        protein: finiteNumber(raw.protein),
        price: finiteNumber(raw.price, 0, 10000),
        price2: finiteNumber(raw.price2, 0, 10000),
        description: cleanText(raw.description, 500),
        versions,
        outOfStock: Boolean(raw.outOfStock)
    };
}

function applyMenuItemChange(menuData, sourceCategoryId, targetCategoryId, rawItem) {
    if (!menuData || !Array.isArray(menuData.categories)) {
        const error = new Error('Cardapio indisponivel para edicao.');
        error.statusCode = 409;
        throw error;
    }

    const source = menuData.categories.find(category => category.id === sourceCategoryId);
    const target = menuData.categories.find(category => category.id === targetCategoryId);
    if (!target || !Array.isArray(target.items)) {
        const error = new Error('Categoria de destino invalida.');
        error.statusCode = 400;
        throw error;
    }

    const existing = source && Array.isArray(source.items)
        ? source.items.find(item => item.id === rawItem.id)
        : null;
    const item = normalizeMenuItem(rawItem, existing);

    for (const category of menuData.categories) {
        if (Array.isArray(category.items)) {
            category.items = category.items.filter(candidate => candidate.id !== item.id);
        }
    }
    target.items.push(item);
    return item;
}

async function saveMenuItem(client, change) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
        await client.watch('menu_data');
        const raw = await client.get('menu_data');
        if (!raw) {
            await client.unwatch();
            const error = new Error('Cardapio ainda nao foi inicializado.');
            error.statusCode = 409;
            throw error;
        }

        let menuData;
        try {
            menuData = JSON.parse(raw);
        } catch {
            await client.unwatch();
            const error = new Error('Os dados atuais do cardapio estao corrompidos.');
            error.statusCode = 500;
            throw error;
        }

        const item = applyMenuItemChange(menuData, change.sourceCategoryId, change.targetCategoryId, change.item);
        try {
            const result = await client.multi().set('menu_data', JSON.stringify(menuData)).exec();
            if (result) return item;
        } catch (error) {
            if (error && error.name === 'WatchError') continue;
            throw error;
        }
    }

    const error = new Error('O cardapio foi alterado simultaneamente. Tente salvar novamente.');
    error.statusCode = 409;
    throw error;
}

module.exports = { applyMenuItemChange, normalizeMenuItem, saveMenuItem };
