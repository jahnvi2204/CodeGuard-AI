// ============================================================================
// API ROUTES
// ============================================================================

// Health check with comprehensive system status
app.get('/api/health', async (req, res) => {
    try {
        const startTime = Date.now();
        
        // Check ML service health
        const mlHealth = await mlService.checkHealth();
        
        // System information
        const systemInfo = {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            timestamp: new Date().toISOString()
        };
        
        const responseTime = Date.now() - startTime;
        
        res.json({
            status: 'healthy',
            server: {
                port: PORT,
                environment: process.env.NODE_ENV || 'development',
                responseTime: `${responseTime}ms`
            },
            services: {
                languageDetection: 'available',
                mlService: mlHealth.status,
                mlServiceDetails: mlHealth
            },
            supportedLanguages: languageDetector.getSupportedLanguages(),
            features: {
                languageDetection: true,
                codeAnalysis: mlHealth.status === 'healthy',
                batchProcessing: true,
                fileUpload: false // Not implemented in this version
            },
            system: systemInfo
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Language detection endpoint with robust error handling
app.post('/api/detect-language', validateCodeInput, (req, res) => {
    try {
        const { code, filename } = req.body;
        const startTime = Date.now();
        
        // Validate filename if provided
        if (filename && typeof filename !== 'string') {
            return res.status(400).json({ 
                error: 'Filename must be a string',
                details: `Received type: ${typeof filename}`
            });
        }
        
        const detection = languageDetector.detectLanguage(code, filename);
        const responseTime = Date.now() - startTime;
        
        // Check if there was an error in detection
        if (detection.error) {
            return res.status(400).json({
                ...detection,
                responseTime: `${responseTime}ms`,
                timestamp: new Date().toISOString()
            });
        }
        
        res.json({
            ...detection,
            supportedForAnalysis: ['javascript', 'python', 'java'].includes(detection.language),
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString(),
            inputStats: {
                codeLength: code.length,
                linesOfCode: code.split('\n').length,
                hasFilename: !!filename
            }
        });
    } catch (error) {
        console.error('Language detection endpoint error:', error);
        res.status(500).json({ 
            error: 'Language detection failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Enhanced code analysis with comprehensive error handling
app.post('/api/analyze-code', validateCodeInput, validateLanguageInput, async (req, res) => {
    const startTime = Date.now();
    let analysisAttempted = false;
    
    try {
        const { code, language: providedLanguage, filename, autoDetect = true } = req.body;
        
        let detectedLanguage = providedLanguage;
        let languageDetection = null;
        
        // Auto-detect language if not provided or if autoDetect is true
        if (!providedLanguage || autoDetect) {
            try {
                languageDetection = languageDetector.detectLanguage(code, filename);
                
                if (languageDetection.error) {
                    return res.status(400).json({
                        error: 'Language detection failed',
                        details: languageDetection.error,
                        languageDetection,
                        timestamp: new Date().toISOString()
                    });
                }
                
                detectedLanguage = languageDetection.language;
            } catch (detectionError) {
                console.error('Language auto-detection failed:', detectionError);
                return res.status(500).json({
                    error: 'Language auto-detection failed',
                    message: detectionError.message,
                    fallback: 'Please specify language manually'
                });
            }
        }
        
        // Validate detected language
        if (!detectedLanguage) {
            return res.status(400).json({
                error: 'Unable to determine programming language',
                details: 'Please specify the language manually or provide a filename with extension',
                supportedLanguages: languageDetector.getSupportedLanguages()
            });
        }
        
        // Check if language is supported for ML analysis
        const supportedLanguages = ['javascript', 'python', 'java'];
        if (!supportedLanguages.includes(detectedLanguage.toLowerCase())) {
            return res.status(422).json({
                error: `Language '${detectedLanguage}' is not yet supported for analysis`,
                detectedLanguage,
                languageDetection,
                supportedLanguages,
                message: 'Please try with JavaScript, Python, or Java code',
                responseTime: `${Date.now() - startTime}ms`
            });
        }
        
        // Perform ML analysis
        analysisAttempted = true;
        const analysisResult = await mlService.analyzeCode(code, detectedLanguage);
        const responseTime = Date.now() - startTime;
        
        res.json({
            success: true,
            detectedLanguage,
            languageDetection,
            analysis: {
                ...analysisResult,
                codeLength: code.length,
                linesOfCode: code.split('\n').length,
                processingTime: `${responseTime}ms`
            },
            metadata: {
                analysisAttempted: true,
                mlServiceUsed: true,
                timestamp: new Date().toISOString(),
                version: '1.0'
            }
        });
        
    } catch (error) {
        const responseTime = Date.now() - startTime;
        console.error('Code analysis error:', error);
        
        // Provide different error responses based on the type of error
        if (error.message.includes('ML analysis failed')) {
            res.status(503).json({ 
                error: 'ML analysis service unavailable',
                message: error.message,
                fallback: 'ML service is currently unavailable. Please try again later.',
                analysisAttempted,
                responseTime: `${responseTime}ms`,
                timestamp: new Date().toISOString()
            });
        } else if (error.message.includes('timeout')) {
            res.status(504).json({
                error: 'Analysis timeout',
                message: 'Code analysis took too long to complete',
                suggestion: 'Try with smaller code samples or contact support',
                responseTime: `${responseTime}ms`,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                error: 'Code analysis failed',
                message: error.message,
                analysisAttempted,
                responseTime: `${responseTime}ms`,
                timestamp: new Date().toISOString()
            });
        }
    }
});

// Test ML service connectivity with detailed diagnostics
app.get('/api/test-ml', async (req, res) => {
    try {
        const startTime = Date.now();
        
        // Test basic connectivity
        const healthCheck = await mlService.checkHealth();
        
        // Test ML models if service is healthy
        let modelTest = null;
        if (healthCheck.status === 'healthy' || healthCheck.statusCode === 200) {
            try {
                modelTest = await mlService.testMLModels();
            } catch (modelError) {
                console.warn('ML model test failed:', modelError.message);
                modelTest = {
                    status: 'failed',
                    error: modelError.message
                };
            }
        }
        
        const responseTime = Date.now() - startTime;
        
        res.json({
            healthCheck,
            modelTest,
            diagnostics: {
                mlServiceUrl: ML_SERVICE_URL,
                responseTime: `${responseTime}ms`,
                timestamp: new Date().toISOString(),
                recommendedAction: healthCheck.status === 'healthy' 
                    ? 'ML service is ready for code analysis'
                    : 'Start the ML service on port 8000 and ensure it\'s accessible'
            }
        });
        
    } catch (error) {
        console.error('ML test error:', error);
        res.status(500).json({ 
            error: 'ML service test failed',
            message: error.message,
            diagnostics: {
                mlServiceUrl: ML_SERVICE_URL,
                timestamp: new Date().toISOString(),
                troubleshooting: [
                    'Ensure ML service is running on port 8000',
                    'Check network connectivity',
                    'Verify ML service dependencies are installed',
                    'Check ML service logs for errors'
                ]
            }
        });
    }
});

// Batch language detection with comprehensive error handling
app.post('/api/detect-languages-batch', (req, res) => {
    try {
        const { files } = req.body;
        const startTime = Date.now();
        
        // Validate input
        if (!files) {
            return res.status(400).json({ 
                error: 'Files array is required',
                details: 'Request body must include a "files" array'
            });
        }
        
        if (!Array.isArray(files)) {
            return res.status(400).json({ 
                error: 'Files must be an array',
                details: `Received type: ${typeof files}`
            });
        }
        
        if (files.length === 0) {
            return res.status(400).json({ 
                error: 'Files array cannot be empty',
                details: 'Provide at least one file for batch processing'
            });
        }
        
        if (files.length > 100) { // Limit batch size
            return res.status(413).json({ 
                error: 'Too many files',
                details: 'Maximum batch size is 100 files',
                currentSize: files.length
            });
        }
        
        const results = [];
        const errors = [];
        
        files.forEach((file, index) => {
            try {
                // Validate individual file structure
                if (!file || typeof file !== 'object') {
                    errors.push({
                        index,
                        error: 'Invalid file object',
                        details: 'Each file must be an object with code and filename properties'
                    });
                    return;
                }
                
                if (!file.code) {
                    errors.push({
                        index,
                        error: 'Missing code property',
                        filename: file.filename
                    });
                    return;
                }
                
                if (typeof file.code !== 'string') {
                    errors.push({
                        index,
                        error: 'Code must be a string',
                        filename: file.filename,
                        receivedType: typeof file.code
                    });
                    return;
                }
                
                const detection = languageDetector.detectLanguage(file.code, file.filename);
                
                results.push({
                    index,
                    filename: file.filename || `file_${index}`,
                    ...detection,
                    supportedForAnalysis: ['javascript', 'python', 'java'].includes(detection.language),
                    codeLength: file.code.length,
                    linesOfCode: file.code.split('\n').length
                });
                
            } catch (fileError) {
                console.error(`Error processing file ${index}:`, fileError);
                errors.push({
                    index,
                    filename: file.filename,
                    error: 'Processing failed',
                    message: fileError.message
                });
            }
        });
        
        const responseTime = Date.now() - startTime;
        
        res.json({
            results,
            errors: errors.length > 0 ? errors : undefined,
            summary: {
                totalFiles: files.length,
                successfullyProcessed: results.length,
                failedFiles: errors.length,
                detectedLanguages: [...new Set(results.map(r => r.language))],
                supportedFiles: results.filter(r => r.supportedForAnalysis).length,
                processingTime: `${responseTime}ms`
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Batch language detection error:', error);
        res.status(500).json({ 
            error: 'Batch processing failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get supported languages and extensions
app.get('/api/supported-languages', (req, res) => {
    try {
        const languages = languageDetector.getSupportedLanguages();
        const extensions = languageDetector.extensionMap;
        
        res.json({
            languages,
            extensions,
            analysisSupported: ['javascript', 'python', 'java'],
            detectionMethod: 'content_analysis + file_extension',
            counts: {
                totalLanguages: languages.length,
                totalExtensions: Object.keys(extensions).length,
                analysisReady: 3
            },
            capabilities: {
                contentAnalysis: true,
                fileExtensionDetection: true,
                batchProcessing: true,
                mlIntegration: true
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Supported languages endpoint error:', error);
        res.status(500).json({ 
            error: 'Failed to retrieve supported languages',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Code preprocessing and statistics
app.post('/api/preprocess-code', validateCodeInput, (req, res) => {
    try {
        const { code, language: providedLanguage, filename } = req.body;
        const startTime = Date.now();
        
        const detection = languageDetector.detectLanguage(code, filename);
        const language = providedLanguage || detection.language;
        
        // Basic preprocessing with error handling
        let statistics;
        try {
            const lines = code.split('\n');
            const nonEmptyLines = lines.filter(line => line.trim() !== '');
            
            // Language-specific comment detection
            const commentPatterns = {
                javascript: [/^\s*\/\//, /^\s*\/\*/, /\*\/\s*$/],
                python: [/^\s*#/],
                java: [/^\s*\/\//, /^\s*\/\*/, /\*\/\s*$/],
                c: [/^\s*\/\//, /^\s*\/\*/, /\*\/\s*$/, /^\s*#/],
                cpp: [/^\s*\/\//, /^\s*\/\*/, /\*\/\s*$/],
                sql: [/^\s*--/, /^\s*\/\*/]
            };
            
            const patterns = commentPatterns[language] || [/^\s*\/\//, /^\s*#/];
            const comments = lines.filter(line => {
                const trimmed = line.trim();
                return patterns.some(pattern => pattern.test(trimmed));
            });
            
            statistics = {
                totalLines: lines.length,
                codeLines: nonEmptyLines.length,
                emptyLines: lines.length - nonEmptyLines.length,
                commentLines: comments.length,
                characters: code.length,
                charactersNoSpaces: code.replace(/\s/g, '').length,
                words: code.split(/\s+/).filter(word => word.length > 0).length,
                averageLineLength: Math.round(code.length / lines.length),
                maxLineLength: Math.max(...lines.map(line => line.length))
            };
        } catch (statsError) {
            console.warn('Statistics calculation failed:', statsError);
            statistics = {
                totalLines: code.split('\n').length,
                characters: code.length,
                error: 'Detailed statistics unavailable'
            };
        }
        
        const responseTime = Date.now() - startTime;
        
        res.json({
            originalCode: code,
            language,
            detection,
            statistics,
            readyForAnalysis: ['javascript', 'python', 'java'].includes(language.toLowerCase()),
            preprocessing: {
                codeNormalized: code.trim().length > 0,
                languageDetected: !detection.error,
                statisticsGenerated: !statistics.error
            },
            metadata: {
                processingTime: `${responseTime}ms`,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Code preprocessing error:', error);
        res.status(500).json({ 
            error: 'Code preprocessing failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
        availableEndpoints: [
            'GET /api/health',
            'POST /api/detect-language',
            'POST /api/analyze-code',
            'GET /api/test-ml',
            'POST /api/detect-languages-batch',
            'GET /api/supported-languages',
            'POST /api/preprocess-code'
        ],
        documentation: 'https://github.com/your-repo/codeguard-api',
        timestamp: new Date().toISOString()
    });
});

// Global error handling middleware
app.use((error, req, res, next) => {
    console.error('🚨 Global error handler:', {
        error: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    
    // Don't send error details in production
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.status(500).json({ 
        error: 'Internal server error',
        message: isDevelopment ? error.message : 'An unexpected error occurred',
        stack: isDevelopment ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'unknown'
    });
});