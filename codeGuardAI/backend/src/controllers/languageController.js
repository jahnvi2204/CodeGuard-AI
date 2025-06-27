const LanguageDetectionService = require('../services/languageDetection');
const { getCodeMetrics, createSuccessResponse, createErrorResponse } = require('../utils/helpers');

class LanguageController {
    static async detectLanguage(req, res) {
        try {
            const { code } = req.body;
            
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
    }
}

module.exports = LanguageController;