const { createClient } = require('redis');
const { requireAuth } = require('./_auth');
const { assertBodySize, requireMethod, requireSameOrigin, setSecurityHeaders } = require('./_security');
const { cleanText } = require('./_validation');

module.exports = async (req, res) => {
    setSecurityHeaders(res);
    if (!requireMethod(req, res, 'POST') || !requireSameOrigin(req, res)) return;
    if (!process.env.REDIS_URL) {
        res.status(503).json({ success: false, error: 'Cardápio indisponível.' });
        return;
    }

    let client;
    try {
        assertBodySize(req.body, 4096);
        client = createClient({ url: process.env.REDIS_URL });
        client.on('error', error => console.error('Redis error:', error.message));
        await client.connect();
        if (!await requireAuth(client, req, res)) return;

        const categoryId = cleanText(req.body && req.body.categoryId, 80);
        const itemId = cleanText(req.body && req.body.itemId, 80);
        const available = req.body && req.body.available;
        if (!categoryId || !itemId || typeof available !== 'boolean') {
            res.status(400).json({ success: false, error: 'Dados de disponibilidade inválidos.' });
            return;
        }

        const raw = await client.get('menu_data');
        const menuData = raw ? JSON.parse(raw) : null;
        const category = menuData && menuData.categories && menuData.categories.find(item => item.id === categoryId);
        const menuItem = category && category.items && category.items.find(item => item.id === itemId);
        if (!menuItem) {
            res.status(404).json({ success: false, error: 'Produto não encontrado.' });
            return;
        }

        menuItem.outOfStock = !available;
        delete menuItem.available;
        await client.set('menu_data', JSON.stringify(menuData));
        res.status(200).json({ success: true, outOfStock: menuItem.outOfStock });
    } catch (error) {
        console.error('update-item-availability error:', error.message);
        res.status(500).json({ success: false, error: 'Não foi possível atualizar o produto.' });
    } finally {
        if (client) {
            try { await client.disconnect(); } catch {}
        }
    }
};
