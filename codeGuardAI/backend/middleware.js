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

