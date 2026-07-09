// Vercel Serverless Function: Save Order
// URL: /api/save-order
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
        // Fallback or warning if Redis is not configured (e.g. running locally without Vercel storage)
        res.status(200).json({ 
            success: true, 
            warning: 'Vercel Redis Storage not connected. Order saved locally on client only.' 
        });
        return;
    }

    let client;
    try {
        const orderData = req.body;
        if (!orderData || !orderData.id) {
            res.status(400).json({ success: false, error: 'Invalid order data.' });
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
                console.error('Failed to parse existing orders JSON:', e);
            }
        }

        // Add new order to the beginning
        orders.unshift(orderData);

        // Keep orders list bounded (e.g. keep last 200 orders to avoid bloating Redis)
        if (orders.length > 200) {
            orders = orders.slice(0, 200);
        }

        // Save back to Redis
        await client.set('orders', JSON.stringify(orders));

        res.status(200).json({ success: true, order: orderData });

    } catch (err) {
        console.error('Serverless save-order error:', err);
        res.status(500).json({ success: false, error: err.message });
    } finally {
        if (client) {
            try {
                await client.disconnect();
            } catch (e) {}
        }
    }
};
