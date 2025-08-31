const MLService = require('./mlService');
const { formatResponse, formatError } = require('./helpers');
const { HTTP_STATUS } = require('./constants');
const config = require('./config');

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
        const healthCheck = await MLService.checkStatus();

        const responseData = {
            ml_service_url: config.mlServiceUrl,
            health_check: healthCheck,
            last_checked: new Date().toISOString()
        };

        res.json(formatResponse(responseData, true, 'ML service status retrieved successfully'));
        
    } catch (error) {
        console.error('ML status check error:', error);
        res.status(500).json(formatError(error, 500));
    }
};
