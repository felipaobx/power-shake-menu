// Vercel Serverless Function: Save Menu Data
// URL: /api/save-menu
const { createClient } = require('redis');

module.exports = async (req, res) => {
    // Enable CORS for testing
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

    // Check if Redis is connected on Vercel
    if (!REDIS_URL) {
        res.status(500).json({ 
            success: false, 
            error: 'Banco de dados Vercel Redis não está conectado! Por favor, certifique-se de que a variável de ambiente REDIS_URL está ativa no painel da Vercel.' 
        });
        return;
    }

    let client;
    try {
        const { menuData, settings, pin } = req.body || {};
        
        // Define admin PIN from environment variable, fallback to default "1234"
        const ADMIN_PIN = process.env.ADMIN_PIN || '1234';

        // PIN Validation
        if (!pin || pin.toString() !== ADMIN_PIN.toString()) {
            res.status(401).json({ success: false, error: 'PIN de Administrador incorreto!' });
            return;
        }

        // Validate payload data
        if (!menuData || !settings) {
            res.status(400).json({ success: false, error: 'Dados incompletos no corpo da requisição.' });
            return;
        }

        // Connect to Redis
        client = createClient({ url: REDIS_URL });
        client.on('error', (err) => console.error('Redis Client Error', err));
        await client.connect();

        // Write menu_data and settings to Redis
        await Promise.all([
            client.set('menu_data', JSON.stringify(menuData)),
            client.set('settings', JSON.stringify(settings))
        ]);

        res.status(200).json({ success: true });

    } catch (err) {
        console.error('Serverless save error:', err);
        res.status(500).json({ success: false, error: err.message });
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
