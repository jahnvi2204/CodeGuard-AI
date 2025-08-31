const MLService = require('../backend/src/services/mlService');
const { API_ENDPOINTS } = require('../backend/src/utils/constants');
const config = require('../backend/src/config');

module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const mlHealth = await MLService.checkHealth();
        
        res.json({
            status: 'healthy',
            service: 'CodeGuard API Server',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            ml_service: {
                url: config.mlServiceUrl,
                ...mlHealth
            },
            endpoints: API_ENDPOINTS
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};
