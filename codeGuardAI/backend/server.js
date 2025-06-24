const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const PORT = process.env.PORT || 5000;

// ============================================================================
// PROGRAMMING LANGUAGE DETECTION
// ============================================================================

class ProgrammingLanguageDetector {
    constructor() {
        // Common file extensions mapping
        this.extensionMap = {
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.py': 'python',
            '.java': 'java',
            '.c': 'c',
            '.cpp': 'cpp',
            '.cxx': 'cpp',
            '.cc': 'cpp',
            '.h': 'c',
            '.hpp': 'cpp',
            '.cs': 'csharp',
            '.php': 'php',
            '.rb': 'ruby',
            '.go': 'go',
            '.rs': 'rust',
            '.kt': 'kotlin',
            '.swift': 'swift',
            '.r': 'r',
            '.sql': 'sql',
            '.html': 'html',
            '.css': 'css',
            '.scss': 'scss',
            '.sass': 'sass',
            '.xml': 'xml',
            '.json': 'json',
            '.yaml': 'yaml',
            '.yml': 'yaml'
        };

        // Language-specific keywords and patterns
        this.languageSignatures = {
            javascript: {
                keywords: ['function', 'var', 'let', 'const', 'typeof', 'undefined', 'null', 'true', 'false'],
                patterns: [
                    /function\s+\w+\s*\(/,
                    /const\s+\w+\s*=/,
                    /let\s+\w+\s*=/,
                    /var\s+\w+\s*=/,
                    /=>\s*{/,
                    /console\.log/,
                    /document\./,
                    /window\./
                ],
                unique: ['===', '!==', 'typeof', 'undefined']
            },
            python: {
                keywords: ['def', 'class', 'import', 'from', 'if', 'elif', 'else', 'for', 'while', 'try', 'except'],
                patterns: [
                    /def\s+\w+\s*\(/,
                    /class\s+\w+\s*:/,
                    /import\s+\w+/,
                    /from\s+\w+\s+import/,
                    /if\s+__name__\s*==\s*['"']__main__['"']/,
                    /print\s*\(/
                ],
                unique: ['elif', 'def ', '__init__', '__name__', 'import ']
            },
            java: {
                keywords: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements'],
                patterns: [
                    /public\s+class\s+\w+/,
                    /public\s+static\s+void\s+main/,
                    /System\.out\.println/,
                    /\w+\s+\w+\s*=\s*new\s+\w+\s*\(/,
                    /@\w+/
                ],
                unique: ['System.out.', 'public static void main', 'extends ', 'implements ']
            },
            c: {
                keywords: ['#include', 'int', 'char', 'float', 'double', 'void', 'struct', 'typedef'],
                patterns: [
                    /#include\s*<[^>]+>/,
                    /int\s+main\s*\(/,
                    /printf\s*\(/,
                    /scanf\s*\(/,
                    /\w+\s*\*\s*\w+/
                ],
                unique: ['#include', 'printf(', 'scanf(', 'int main(']
            },
            cpp: {
                keywords: ['#include', 'namespace', 'using', 'class', 'public:', 'private:', 'protected:'],
                patterns: [
                    /#include\s*<iostream>/,
                    /using\s+namespace\s+std/,
                    /std::/,
                    /cout\s*<</, 
                    /cin\s*>>/,
                    /class\s+\w+\s*{/
                ],
                unique: ['std::', 'cout <<', 'cin >>', 'using namespace', '#include <iostream>']
            },
            csharp: {
                keywords: ['using', 'namespace', 'class', 'public', 'private', 'static', 'void'],
                patterns: [
                    /using\s+System/,
                    /namespace\s+\w+/,
                    /Console\.WriteLine/,
                    /public\s+static\s+void\s+Main/,
                    /\[.*\]/
                ],
                unique: ['Console.WriteLine', 'using System', 'namespace ']
            },
            php: {
                keywords: ['<?php', 'function', 'class', 'public', 'private', 'protected'],
                patterns: [
                    /<\?php/,
                    /\$\w+/,
                    /echo\s+/,
                    /function\s+\w+\s*\(/,
                    /->\w+/
                ],
                unique: ['<?php', 
            , 'echo ', '->']
            },
            go: {
                keywords: ['package', 'import', 'func', 'var', 'const', 'type', 'struct'],
                patterns: [
                    /package\s+main/,
                    /import\s*\(/,
                    /func\s+\w+\s*\(/,
                    /fmt\.Print/,
                    /:=/
                ],
                unique: ['package ', 'func ', 'fmt.', ':=']
            },
            rust: {
                keywords: ['fn', 'let', 'mut', 'struct', 'enum', 'impl', 'trait'],
                patterns: [
                    /fn\s+\w+\s*\(/,
                    /let\s+mut\s+/,
                    /println!\s*\(/,
                    /::\w+/,
                    /&\w+/
                ],
                unique: ['fn ', 'let mut', 'println!', '::']
            },
            ruby: {
                keywords: ['def', 'class', 'module', 'end', 'if', 'else', 'elsif'],
                patterns: [
                    /def\s+\w+/,
                    /class\s+\w+/,
                    /puts\s+/,
                    /@\w+/,
                    /\w+\.each\s+do/
                ],
                unique: ['def ', 'puts ', 'end', 'elsif']
            },
            sql: {
                keywords: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER'],
                patterns: [
                    /SELECT\s+.*\s+FROM/i,
                    /INSERT\s+INTO/i,
                    /UPDATE\s+.*\s+SET/i,
                    /DELETE\s+FROM/i,
                    /CREATE\s+TABLE/i
                ],
                unique: ['SELECT ', 'FROM ', 'WHERE ', 'INSERT INTO']
            }
        };
    }

    detectLanguage(code, filename = '') {
        // First, try to detect by file extension
        if (filename) {
            const ext = this.getFileExtension(filename);
            if (this.extensionMap[ext]) {
                return {
                    language: this.extensionMap[ext],
                    confidence: 0.9,
                    method: 'file_extension'
                };
            }
        }

        // If no filename or unknown extension, analyze code content
        return this.detectByContent(code);
    }

    detectByContent(code) {
        const scores = {};
        const codeNormalized = code.toLowerCase();

        // Score each language based on patterns and keywords
        for (const [language, signature] of Object.entries(this.languageSignatures)) {
            let score = 0;

            // Check unique identifiers (high weight)
            signature.unique.forEach(unique => {
                if (codeNormalized.includes(unique.toLowerCase())) {
                    score += 10;
                }
            });

            // Check patterns (medium weight)
            signature.patterns.forEach(pattern => {
                if (pattern.test(code)) {
                    score += 5;
                }
            });

            // Check keywords (low weight)
            signature.keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
                const matches = codeNormalized.match(regex);
                if (matches) {
                    score += matches.length * 1;
                }
            });

            scores[language] = score;
        }

        // Find the language with highest score
        const detectedLanguage = Object.entries(scores)
            .filter(([, score]) => score > 0)
            .sort(([, a], [, b]) => b - a)[0];

        if (!detectedLanguage) {
            return {
                language: 'text',
                confidence: 0.1,
                method: 'fallback'
            };
        }

        const [language, score] = detectedLanguage;
        const maxPossibleScore = this.languageSignatures[language].unique.length * 10 + 
                                this.languageSignatures[language].patterns.length * 5;
        const confidence = Math.min(score / maxPossibleScore, 1.0);

        return {
            language,
            confidence: Math.round(confidence * 100) / 100,
            method: 'content_analysis',
            allScores: scores
        };
    }

    getFileExtension(filename) {
        const lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
    }

    getSupportedLanguages() {
        return [...new Set(Object.values(this.extensionMap))];
    }
}

// ============================================================================
// ML SERVICE INTEGRATION
// ============================================================================

class MLServiceClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async checkHealth() {
        try {
            const response = await axios.get(`${this.baseURL}/health`);
            return response.data;
        } catch (error) {
            console.error('ML service health check failed:', error.message);
            return { status: 'unavailable', error: error.message };
        }
    }

    async analyzeCode(code, language) {
        try {
            const response = await axios.post(`${this.baseURL}/analyze/complete`, {
                code,
                language
            });
            return {
                ...response.data,
                mlPowered: true,
                source: 'ml_service'
            };
        } catch (error) {
            console.error('ML analysis failed:', error.message);
            throw new Error(`ML analysis failed: ${error.message}`);
        }
    }

    async testMLModels() {
        try {
            const response = await axios.post(`${this.baseURL}/test-ml`, {});
            return response.data;
        } catch (error) {
            console.error('ML model test failed:', error.message);
            return { status: 'failed', error: error.message };
        }
    }
}

// Initialize services with error handling
let languageDetector;
let mlService;

try {
    languageDetector = new ProgrammingLanguageDetector();
    mlService = new MLServiceClient(ML_SERVICE_URL);
    console.log('✅ Services initialized successfully');
} catch (error) {
    console.error('❌ Failed to initialize services:', error);
    process.exit(1);
}

// ============================================================================
// VALIDATION MIDDLEWARE
// ============================================================================

const validateCodeInput = (req, res, next) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({ 
                error: 'Code is required',
                details: 'Request body must include a "code" field with the source code to analyze'
            });
        }
        
        if (typeof code !== 'string') {
            return res.status(400).json({ 
                error: 'Code must be a string',
                details: `Received type: ${typeof code}`
            });
        }
        
        if (code.trim() === '') {
            return res.status(400).json({ 
                error: 'Code cannot be empty',
                details: 'Provide actual source code content for analysis'
            });
        }
        
        if (code.length > 1000000) { // 1MB limit
            return res.status(413).json({ 
                error: 'Code too large',
                details: 'Maximum code size is 1MB (1,000,000 characters)',
                currentSize: code.length
            });
        }
        
        next();
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ 
            error: 'Validation failed',
            message: error.message 
        });
    }
};

const validateLanguageInput = (req, res, next) => {
    try {
        const { language } = req.body;
        
        if (language && typeof language !== 'string') {
            return res.status(400).json({ 
                error: 'Language must be a string',
                details: `Received type: ${typeof language}`
            });
        }
        
        if (language && !languageDetector.validateLanguage(language)) {
            return res.status(400).json({ 
                error: 'Unsupported language',
                details: `Language "${language}" is not supported`,
                supportedLanguages: languageDetector.getSupportedLanguages()
            });
        }
        
        next();
    } catch (error) {
        console.error('Language validation error:', error);
        res.status(500).json({ 
            error: 'Language validation failed',
            message: error.message 
        });
    }
};

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

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('📝 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📝 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

// Start server with comprehensive error handling
const server = app.listen(PORT, () => {
    console.log(`🚀 Enhanced CodeGuard Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔍 Language detection: http://localhost:${PORT}/api/detect-language`);
    console.log(`🧪 Code analysis: http://localhost:${PORT}/api/analyze-code`);
    console.log(`🤖 ML service URL: ${ML_SERVICE_URL}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⚡ Server ready to accept connections`);
});

// Handle server startup errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please choose a different port or stop the process using this port.`);
        console.error(`💡 Try: lsof -ti:${PORT} | xargs kill -9`);
    } else if (error.code === 'EACCES') {
        console.error(`❌ Permission denied to bind to port ${PORT}. Try using a port > 1024 or run with sudo.`);
    } else {
        console.error(`❌ Server startup error:`, error);
    }
    process.exit(1);
});

module.exports = app;