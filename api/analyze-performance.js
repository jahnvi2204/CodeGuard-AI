const MLService = require('../backend/src/services/mlService');
const LanguageDetectionService = require('../backend/src/services/languageDetection');
const { createSuccessResponse, createErrorResponse } = require('../backend/src/utils/helpers');

module.exports = async function handler(req, res) {
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
            return res.status(400).json(createErrorResponse(
                'Invalid input',
                'Code is required and must be a string'
            ));
        }
        
        const finalLanguage = language || LanguageDetectionService.detectLanguage(code);
        
        const mlResult = await MLService.callService('/analyze/performance', {
            code: code,
            language: finalLanguage
        });

        if (!mlResult.success) {
            return res.status(503).json(createErrorResponse(
                'ML service unavailable',
                mlResult.error
            ));
        }

        res.json(createSuccessResponse(mlResult.data));
        
    } catch (error) {
        console.error('Performance analysis error:', error);
        res.status(500).json(createErrorResponse(
            'Performance analysis failed',
            error.message
        ));
    }
};
