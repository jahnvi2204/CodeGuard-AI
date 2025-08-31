const LanguageDetectionService = require('../codeGuardAI/backend/src/services/languageDetection');
const { getCodeMetrics, createSuccessResponse, createErrorResponse } = require('../codeGuardAI/backend/src/utils/helpers');

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
        const { code } = req.body;
        
        if (!code || typeof code !== 'string') {
            return res.status(400).json(createErrorResponse(
                'Invalid input',
                'Code is required and must be a string'
            ));
        }
        
        const detectedLanguage = LanguageDetectionService.detectLanguage(code);
        const confidence = LanguageDetectionService.getConfidence(detectedLanguage);
        const codeMetrics = getCodeMetrics(code);

        const responseData = {
            language: detectedLanguage,
            confidence: confidence,
            ...codeMetrics
        };

        res.json(createSuccessResponse(responseData));
    } catch (error) {
        console.error('Language detection error:', error);
        res.status(500).json(createErrorResponse(
            'Language detection failed',
            error.message
        ));
    }
};
