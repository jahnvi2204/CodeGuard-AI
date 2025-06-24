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