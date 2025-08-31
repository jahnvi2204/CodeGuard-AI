const MLService = require('./mlService');
const { validateCode, validateLanguage, formatResponse, formatError, detectLanguageFromCode } = require('./helpers');
const { HTTP_STATUS } = require('./constants');

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
        const { code, language } = req.body;
        
        if (!code || typeof code !== 'string') {
            return res.status(400).json(formatError(
                'Invalid input',
                'Code is required and must be a string'
            ));
        }
        
        const finalLanguage = language || detectLanguageFromCode(code);
        
        const mlResult = await MLService.callService('/analyze/vulnerabilities', {
            code: code,
            language: finalLanguage
        });

        if (!mlResult.success) {
            return res.status(503).json(formatError(
                'ML service unavailable',
                mlResult.error
            ));
        }

        res.json(formatResponse(mlResult.data));
        
    } catch (error) {
        console.error('Vulnerability analysis error:', error);
        res.status(500).json(formatError(
            'Vulnerability analysis failed',
            error.message
        ));
    }
};
