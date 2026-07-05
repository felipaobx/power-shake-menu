// Vercel Serverless Function: Get Menu Data
// URL: /api/get-menu

module.exports = async (req, res) => {
    // Enable CORS for testing
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;

    // Check if Vercel KV is connected
    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
        console.warn('Vercel KV Storage not connected.');
        res.status(200).json({
            success: false,
            error: 'Vercel KV Storage not connected.',
            menuData: null,
            settings: null
        });
        return;
    }

    try {
        // Fetch menu_data and settings from Vercel KV using REST API
        const [menuRes, settingsRes] = await Promise.all([
            fetch(`${KV_REST_API_URL}/get/menu_data`, {
                headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
            }),
            fetch(`${KV_REST_API_URL}/get/settings`, {
                headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
            })
        ]);

        let menuData = null;
        let settings = null;

        if (menuRes.ok) {
            const menuJson = await menuRes.json();
            if (menuJson && menuJson.result) {
                try {
                    menuData = typeof menuJson.result === 'string' ? JSON.parse(menuJson.result) : menuJson.result;
                } catch (e) {
                    menuData = menuJson.result;
                }
            }
        }

        if (settingsRes.ok) {
            const settingsJson = await settingsRes.json();
            if (settingsJson && settingsJson.result) {
                try {
                    settings = typeof settingsJson.result === 'string' ? JSON.parse(settingsJson.result) : settingsJson.result;
                } catch (e) {
                    settings = settingsJson.result;
                }
            }
        }

        res.status(200).json({
            success: true,
            menuData,
            settings
        });

    } catch (err) {
        console.error('Serverless fetch error:', err);
        res.status(200).json({
            success: false,
            error: err.message,
            menuData: null,
            settings: null
        });
    }
};
