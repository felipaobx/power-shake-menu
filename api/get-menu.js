const { createClient } = require('redis');
const { requireMethod, setSecurityHeaders } = require('./_security');

function publicSettings(settings) {
    if (!settings || typeof settings !== 'object') return null;
    const { users, ...safeSettings } = settings;
    return safeSettings;
}

module.exports = async (req, res) => {
    setSecurityHeaders(res);
    // Menu changes made in the dashboard must be visible immediately.
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('CDN-Cache-Control', 'no-store');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    if (!requireMethod(req, res, 'GET')) return;

    const { REDIS_URL } = process.env;
    if (!REDIS_URL) {
        res.status(200).json({ success: false, menuData: null, settings: null });
        return;
    }

    let client;
    try {
        client = createClient({ url: REDIS_URL });
        client.on('error', error => console.error('Redis error:', error.message));
        await client.connect();
        const [menuRaw, settingsRaw] = await Promise.all([
            client.get('menu_data'),
            client.get('settings')
        ]);

        let menuData = null;
        let settings = null;
        try { if (menuRaw) menuData = JSON.parse(menuRaw); } catch {}
        try { if (settingsRaw) settings = publicSettings(JSON.parse(settingsRaw)); } catch {}
        res.status(200).json({ success: true, menuData, settings });
    } catch (error) {
        console.error('get-menu error:', error.message);
        res.status(503).json({ success: false, error: 'Cardápio temporariamente indisponível.', menuData: null, settings: null });
    } finally {
        if (client) {
            try { await client.disconnect(); } catch {}
        }
    }
};
