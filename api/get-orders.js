// Vercel Serverless Function: Get Orders
// URL: /api/get-orders
const { createClient } = require('redis');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { REDIS_URL } = process.env;

    if (!REDIS_URL) {
        res.status(200).json({ 
            success: false, 
            error: 'Vercel Redis Storage not connected.',
            orders: [] 
        });
        return;
    }

    let client;
    try {
        // Connect to Redis
        client = createClient({ url: REDIS_URL });
        client.on('error', (err) => console.error('Redis Client Error', err));
        await client.connect();

        // Get orders
        const ordersRaw = await client.get('orders');
        let orders = [];

        if (ordersRaw) {
            try {
                orders = JSON.parse(ordersRaw);
            } catch (e) {
                console.error('Failed to parse orders JSON:', e);
            }
        }

        res.status(200).json({
            success: true,
            orders
        });

    } catch (err) {
        console.error('Serverless get-orders error:', err);
        res.status(200).json({
            success: false,
            error: err.message,
            orders: []
        });
    } finally {
        if (client) {
            try {
                await client.disconnect();
            } catch (e) {}
        }
    }
};
