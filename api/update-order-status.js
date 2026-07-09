// Vercel Serverless Function: Update Order Status
// URL: /api/update-order-status
const { createClient } = require('redis');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ success: false, error: 'Method not allowed' });
        return;
    }

    const { REDIS_URL } = process.env;

    if (!REDIS_URL) {
        res.status(200).json({ 
            success: false, 
            error: 'Vercel Redis Storage not connected.' 
        });
        return;
    }

    let client;
    try {
        const { orderId, status } = req.body || {};
        if (!orderId || !status) {
            res.status(400).json({ success: false, error: 'Missing orderId or status in request body.' });
            return;
        }

        // Connect to Redis
        client = createClient({ url: REDIS_URL });
        client.on('error', (err) => console.error('Redis Client Error', err));
        await client.connect();

        // Get existing orders
        const ordersRaw = await client.get('orders');
        let orders = [];
        if (ordersRaw) {
            try {
                orders = JSON.parse(ordersRaw);
            } catch (e) {
                console.error('Failed to parse orders JSON:', e);
            }
        }

        // Check if we need to delete or update
        if (status === 'deleted') {
            orders = orders.filter(o => o.id !== orderId);
        } else {
            orders = orders.map(o => {
                if (o.id === orderId) {
                    return { ...o, status };
                }
                return o;
            });
        }

        // Save back to Redis
        await client.set('orders', JSON.stringify(orders));

        res.status(200).json({ success: true });

    } catch (err) {
        console.error('Serverless update-order-status error:', err);
        res.status(500).json({ success: false, error: err.message });
    } finally {
        if (client) {
            try {
                await client.disconnect();
            } catch (e) {}
        }
    }
};
