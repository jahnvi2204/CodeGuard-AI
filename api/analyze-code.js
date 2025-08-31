const MLService = require('./mlService');
const { validateCode, validateLanguage, formatResponse, formatError, detectLanguageFromCode, getCodeMetrics } = require('./helpers');
const { HTTP_STATUS } = require('./constants');
const config = require('./config');

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
        
        const mlResult = await MLService.callService('/analyze/complete', {
            code: code,
            language: finalLanguage
        });

        if (!mlResult.success) {
            return res.status(503).json(formatError(
                'ML service unavailable',
                {
                    message: 'Could not connect to analysis service',
                    details: mlResult.error,
                    fallback: 'Please try again later'
                }
            ));
        }

        const metadata = {
            detectedLanguage: finalLanguage,
            providedLanguage: language || null,
            ...getCodeMetrics(code),
            mlServiceUrl: config.mlServiceUrl
        };

        const enhancedResponse = formatResponse(mlResult.data, metadata);
        res.json(enhancedResponse);
        
    } catch (error) {
        console.error('Code analysis error:', error);
        res.status(500).json(formatError(
            'Analysis failed',
            error.message
        ));
    }
};
