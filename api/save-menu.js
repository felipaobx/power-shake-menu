const { createClient } = require('redis');
const { mergeAuthUsers, requireAuth } = require('./_auth');
const { assertBodySize, requireMethod, requireSameOrigin, setSecurityHeaders } = require('./_security');

function validateMenu(menuData) {
    if (!menuData || !Array.isArray(menuData.categories) || menuData.categories.length > 100) {
        const error = new Error('Estrutura do cardápio inválida.');
        error.statusCode = 400;
        throw error;
    }
    const itemCount = menuData.categories.reduce((total, category) => {
        if (!category || !Array.isArray(category.items) || category.items.length > 500) {
            const error = new Error('Uma categoria do cardápio é inválida.');
            error.statusCode = 400;
            throw error;
        }
        return total + category.items.length;
    }, 0);
    if (itemCount > 2000) {
        const error = new Error('O cardápio excede o limite de itens.');
        error.statusCode = 400;
        throw error;
    }
}

module.exports = async (req, res) => {
    setSecurityHeaders(res);
    if (!requireMethod(req, res, 'POST') || !requireSameOrigin(req, res)) return;

    const { REDIS_URL } = process.env;
    if (!REDIS_URL) {
        res.status(503).json({ success: false, error: 'Banco de dados indisponível.' });
        return;
    }

    let client;
    try {
        assertBodySize(req.body, 5 * 1024 * 1024);
        client = createClient({ url: REDIS_URL });
        client.on('error', error => console.error('Redis error:', error.message));
        await client.connect();
        if (!await requireAuth(client, req, res, ['admin'])) return;

        const { menuData, settings } = req.body || {};
        validateMenu(menuData);
        if (!settings || typeof settings !== 'object') {
            res.status(400).json({ success: false, error: 'Configurações inválidas.' });
            return;
        }

        const { users, ...safeSettings } = settings;
        const existingRaw = await client.get('auth_users');
        const existingUsers = existingRaw ? JSON.parse(existingRaw) : [];
        const authUsers = users === undefined ? existingUsers : mergeAuthUsers(existingUsers, users);

        await client.multi()
            .set('menu_data', JSON.stringify(menuData))
            .set('settings', JSON.stringify(safeSettings))
            .set('auth_users', JSON.stringify(authUsers))
            .exec();

        res.status(200).json({
            success: true,
            users: authUsers.map(({ pinHash, pinSalt, ...user }) => ({ ...user, hasPin: true }))
        });
    } catch (error) {
        console.error('save-menu error:', error.message);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.statusCode ? error.message : 'Não foi possível salvar o cardápio.'
        });
    } finally {
        if (client) {
            try { await client.disconnect(); } catch {}
        }
    }
};
