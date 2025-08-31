const MLService = require('../services/mlService');
const LanguageDetectionService = require('../services/languageDetection');
const { getCodeMetrics, createSuccessResponse, createErrorResponse } = require('../utils/helpers');
const config = require('../config');

class AnalysisController {
    static async analyzeCode(req, res) {
        try {
            const { code, language } = req.body;
            
            const finalLanguage = language || LanguageDetectionService.detectLanguage(code);
            
            const mlResult = await MLService.callService('/analyze/complete', {
                code: code,
                language: finalLanguage
            });

            if (!mlResult.success) {
                return res.status(503).json(createErrorResponse(
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

            const enhancedResponse = createSuccessResponse(mlResult.data, metadata);
            res.json(enhancedResponse);
            
        } catch (error) {
            console.error('Code analysis error:', error);
            res.status(500).json(createErrorResponse(
                'Analysis failed',
                error.message
            ));
        }
    }

    static async analyzeVulnerabilities(req, res) {
        try {
            const { code, language } = req.body;
            
            const finalLanguage = language || LanguageDetectionService.detectLanguage(code);
            
            const mlResult = await MLService.callService('/analyze/vulnerabilities', {
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
            console.error('Vulnerability analysis error:', error);
            res.status(500).json(createErrorResponse(
                'Vulnerability analysis failed',
                error.message
            ));
        }
    }

    static async analyzePerformance(req, res) {
        try {
            const { code, language } = req.body;
            
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
    }

    static async testMLConnection(req, res) {
        try {
            const mlResult = await MLService.testConnection();
            
            if (!mlResult.success) {
                return res.status(503).json({
                    connection: 'failed',
                    error: mlResult.error,
                    details: mlResult.details
                });
            }

            res.json({
                connection: 'successful',
                ml_service_response: mlResult.data,
                test_timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('ML connection test error:', error);
            res.status(500).json({
                connection: 'failed',
                error: 'Test failed',
                details: error.message
            });
        }
    }
}

module.exports = AnalysisController;