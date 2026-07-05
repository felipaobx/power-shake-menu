// Vercel Serverless Function: Save Menu Data
// URL: /api/save-menu

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

    const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;

    // Check if KV is connected on Vercel
    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
        res.status(500).json({ 
            success: false, 
            error: 'Banco de dados Vercel KV não conectado! Vá no painel da Vercel, clique na aba "Storage", crie um banco de dados "KV" e conecte-o a este projeto para habilitar o salvamento global.' 
        });
        return;
    }

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

        // Save menu_data and settings to the Vercel KV database in parallel
        // Send stringified values in the POST body to avoid URL size limit issues
        const [menuSaveRes, settingsSaveRes] = await Promise.all([
            fetch(`${KV_REST_API_URL}/set/menu_data`, {
                method: 'POST',
                headers: { 
                    Authorization: `Bearer ${KV_REST_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(menuData)
            }),
            fetch(`${KV_REST_API_URL}/set/settings`, {
                method: 'POST',
                headers: { 
                    Authorization: `Bearer ${KV_REST_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            })
        ]);

        if (menuSaveRes.ok && settingsSaveRes.ok) {
            res.status(200).json({ success: true });
        } else {
            const menuErr = await menuSaveRes.text();
            const settingsErr = await settingsSaveRes.text();
            throw new Error(`Failed to save database. Menu: ${menuSaveRes.status} (${menuErr}), Settings: ${settingsSaveRes.status} (${settingsErr})`);
        }

    } catch (err) {
        console.error('Serverless save error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};
