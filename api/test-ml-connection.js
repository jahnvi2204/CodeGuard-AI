const MLService = require('../backend/src/services/mlService');

module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const mlResult = await MLService.testConnection();
        
        if (!mlResult.success) {
            return res.status(503).json({
                connection: 'failed',
                error: mlResult.error,
                details: mlResult.details
            });
        }

        res.json({
            connection: 'successful',
            ml_service_response: mlResult.data,
            test_timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('ML connection test error:', error);
        res.status(500).json({
            connection: 'failed',
            error: 'Test failed',
            details: error.message
        });
    }
};
