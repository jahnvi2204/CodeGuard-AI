const MLService = require('../backend/src/services/mlService');
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
        const healthCheck = await MLService.checkHealth();
        const serviceInfo = healthCheck.available ? await MLService.getSystemStatus() : null;
        const debugInfo = healthCheck.available ? await MLService.getDebugEnvironment() : null;

        res.json({
            ml_service_url: config.mlServiceUrl,
            health_check: healthCheck,
            service_info: serviceInfo,
            debug_info: debugInfo,
            last_checked: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('ML status check error:', error);
        res.status(500).json({
            error: 'Status check failed',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
};
