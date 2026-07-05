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

        // Save menu_data and settings to the online KV database in parallel
        const [menuSaveRes, settingsSaveRes] = await Promise.all([
            fetch('https://kvdb.io/CYaBnkx1ocHtp2QpHyHLUn/menu_data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menuData)
            }),
            fetch('https://kvdb.io/CYaBnkx1ocHtp2QpHyHLUn/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })
        ]);

        if (menuSaveRes.ok && settingsSaveRes.ok) {
            res.status(200).json({ success: true });
        } else {
            throw new Error(`Failed to save database. Menu Status: ${menuSaveRes.status}, Settings Status: ${settingsSaveRes.status}`);
        }

    } catch (err) {
        console.error('Serverless save error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};
