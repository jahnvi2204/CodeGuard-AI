const axios = require('axios');
const config = require('./config');

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
            console.error(`ML Service Error [${endpoint}]:`, {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                data: error.response?.data
            });

            return {
                success: false,
                error: {
                    message: error.message,
                    code: error.code || 'UNKNOWN_ERROR',
                    status: error.response?.status || 500,
                    details: error.response?.data || null
                }
            };
        }
    }

    async analyzeCode(code, language) {
        return await this.callService('/analyze', {
            code: code,
            language: language || 'auto'
        });
    }

    async analyzePerformance(code, language) {
        return await this.callService('/performance', {
            code: code,
            language: language || 'auto'
        });
    }

    async analyzeVulnerabilities(code, language) {
        return await this.callService('/vulnerabilities', {
            code: code,
            language: language || 'auto'
        });
    }

    async checkStatus() {
        try {
            const response = await axios({
                method: 'GET',
                url: `${this.baseURL}/health`,
                timeout: 10000,
                headers: {
                    'User-Agent': 'CodeGuard-API-Server/1.0'
                }
            });

            return {
                success: true,
                status: 'online',
                data: response.data,
                responseTime: response.headers['x-response-time'] || 'unknown'
            };
        } catch (error) {
            console.error('ML Service Health Check Failed:', {
                message: error.message,
                code: error.code,
                status: error.response?.status
            });

            return {
                success: false,
                status: 'offline',
                error: {
                    message: error.message,
                    code: error.code || 'HEALTH_CHECK_FAILED',
                    status: error.response?.status || 500
                }
            };
        }
    }
}

module.exports = new MLService();
