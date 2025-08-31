const axios = require('axios');
const config = require('../config');

class MLService {
    constructor() {
        this.baseURL = config.mlServiceUrl;
        this.defaultTimeout = 30000;
    }

    async callService(endpoint, data, timeout = this.defaultTimeout) {
        try {
            const response = await axios({
                method: 'POST',
                url: `${this.baseURL}${endpoint}`,
                data: data,
                timeout: timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'CodeGuard-API-Server/1.0'
                }
            });
            
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            console.error(`ML Service Error (${endpoint}):`, error.message);
            return this.handleError(error);
        }
    }

    handleError(error) {
        if (error.code === 'ECONNREFUSED') {
            return {
                success: false,
                error: 'ML service is not available',
                details: 'Connection refused - service may be down'
            };
        } else if (error.code === 'ETIMEDOUT') {
            return {
                success: false,
                error: 'ML service timeout',
                details: 'Request took too long to complete'
            };
        } else if (error.response) {
            return {
                success: false,
                error: 'ML service error',
                details: error.response.data || error.message,
                status: error.response.status
            };
        } else {
            return {
                success: false,
                error: 'Network error',
                details: error.message
            };
        }
    }

    async checkHealth() {
        try {
            const response = await axios.get(`${this.baseURL}/health`, { timeout: 10000 });
            return {
                available: true,
                status: response.data,
                responseTime: response.headers['x-response-time'] || 'unknown'
            };
        } catch (error) {
            return {
                available: false,
                error: error.message,
                lastChecked: new Date().toISOString()
            };
        }
    }

    async getSystemStatus() {
        try {
            const response = await axios.get(`${this.baseURL}/system-status`, { timeout: 5000 });
            return response.data;
        } catch (error) {
            console.warn('Could not fetch ML service info:', error.message);
            return null;
        }
    }

    async getDebugEnvironment() {
        try {
            const response = await axios.get(`${this.baseURL}/debug-environment`, { timeout: 5000 });
            return response.data;
        } catch (error) {
            console.warn('Could not fetch ML debug info:', error.message);
            return null;
        }
    }

    async testConnection() {
        return await this.callService('/test-analysis', {});
    }
}

module.exports = new MLService();