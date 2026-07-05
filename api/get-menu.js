// Vercel Serverless Function: Get Menu Data
// URL: /api/get-menu
const { createClient } = require('redis');

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

    const { REDIS_URL } = process.env;

    // Check if REDIS_URL is connected
    if (!REDIS_URL) {
        console.warn('Vercel Redis Storage not connected.');
        res.status(200).json({
            success: false,
            error: 'Vercel Redis Storage not connected.',
            menuData: null,
            settings: null
        });
        return;
    }

    let client;
    try {
        // Connect to Redis using TCP connection
        client = createClient({ url: REDIS_URL });
        client.on('error', (err) => console.error('Redis Client Error', err));
        await client.connect();

        // Get key values in parallel
        const [menuRaw, settingsRaw] = await Promise.all([
            client.get('menu_data'),
            client.get('settings')
        ]);

        let menuData = null;
        let settings = null;

        if (menuRaw) {
            try {
                menuData = JSON.parse(menuRaw);
            } catch (e) {
                console.error('Failed to parse menu JSON:', e);
            }
        }

        if (settingsRaw) {
            try {
                settings = JSON.parse(settingsRaw);
            } catch (e) {
                console.error('Failed to parse settings JSON:', e);
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
    } finally {
        if (client) {
            try {
                await client.disconnect();
            } catch (e) {
                // ignore error on disconnect
            }
        }
    }
};
