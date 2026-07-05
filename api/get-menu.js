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

    try {
        // Fetch menu_data and settings from the KV database
        const [menuRes, settingsRes] = await Promise.all([
            fetch('https://kvdb.io/CYaBnkx1ocHtp2QpHyHLUn/menu_data'),
            fetch('https://kvdb.io/CYaBnkx1ocHtp2QpHyHLUn/settings')
        ]);

        let menuData = null;
        let settings = null;

        if (menuRes.ok) {
            const menuText = await menuRes.text();
            if (menuText && menuText.trim().length > 0) {
                try {
                    menuData = JSON.parse(menuText);
                } catch (e) {
                    console.error('Failed to parse menu text:', e);
                }
            }
        }

        if (settingsRes.ok) {
            const settingsText = await settingsRes.text();
            if (settingsText && settingsText.trim().length > 0) {
                try {
                    settings = JSON.parse(settingsText);
                } catch (e) {
                    console.error('Failed to parse settings text:', e);
                }
            }
        }

        // Return data
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
