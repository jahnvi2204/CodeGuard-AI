const MLService = require('../services/mlService');
const { API_ENDPOINTS } = require('../utils/constants');
const config = require('../config');

class HealthController {
    static async getHealth(req, res) {
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
    }

    static async getMLStatus(req, res) {
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
    }
}

module.exports = HealthController;