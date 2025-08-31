// Helper functions for API
const { SUPPORTED_LANGUAGES, VALIDATION_RULES } = require('./constants');

function validateCode(code) {
    if (!code || typeof code !== 'string') {
        return { 
            isValid: false, 
            error: 'Code is required and must be a string' 
        };
    }

    const trimmedCode = code.trim();
    
    if (trimmedCode.length < VALIDATION_RULES.CODE_MIN_LENGTH) {
        return { 
            isValid: false, 
            error: 'Code cannot be empty' 
        };
    }

    if (trimmedCode.length > VALIDATION_RULES.CODE_MAX_LENGTH) {
        return { 
            isValid: false, 
            error: `Code exceeds maximum length of ${VALIDATION_RULES.CODE_MAX_LENGTH} characters` 
        };
    }

    return { isValid: true };
}

function validateLanguage(language) {
    if (!language || typeof language !== 'string') {
        return { isValid: true }; // Language is optional
    }

    const normalizedLanguage = language.toLowerCase().trim();
    
    if (normalizedLanguage.length > VALIDATION_RULES.LANGUAGE_MAX_LENGTH) {
        return { 
            isValid: false, 
            error: 'Language name is too long' 
        };
    }

    if (!SUPPORTED_LANGUAGES.includes(normalizedLanguage) && normalizedLanguage !== 'auto') {
        return { 
            isValid: false, 
            error: `Unsupported language: ${language}. Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}` 
        };
    }

    return { isValid: true };
}

function getCodeMetrics(code) {
    if (!code || typeof code !== 'string') {
        return {
            lineCount: 0,
            characterCount: 0,
            wordCount: 0,
            isEmpty: true
        };
    }

    const trimmedCode = code.trim();
    
    if (trimmedCode.length === 0) {
        return {
            lineCount: 0,
            characterCount: 0,
            wordCount: 0,
            isEmpty: true
        };
    }

    const lines = trimmedCode.split('\n');
    const words = trimmedCode.split(/\s+/).filter(word => word.length > 0);

    return {
        lineCount: lines.length,
        characterCount: trimmedCode.length,
        wordCount: words.length,
        isEmpty: false
    };
}

function detectLanguageFromCode(code) {
    if (!code || typeof code !== 'string') {
        return 'unknown';
    }

    const trimmedCode = code.trim().toLowerCase();

    // Simple language detection based on common patterns
    const patterns = {
        javascript: [/function\s+\w+\s*\(/, /const\s+\w+\s*=/, /let\s+\w+\s*=/, /var\s+\w+\s*=/, /=>\s*{/, /console\.log/],
        typescript: [/interface\s+\w+/, /type\s+\w+\s*=/, /class\s+\w+.*implements/, /:.*\s*=>/],
        python: [/def\s+\w+\s*\(/, /import\s+\w+/, /from\s+\w+\s+import/, /if\s+__name__\s*==\s*["']__main__["']/, /print\s*\(/],
        java: [/public\s+class\s+\w+/, /public\s+static\s+void\s+main/, /System\.out\.println/, /import\s+java\./],
        cpp: [/#include\s*<.*>/, /using\s+namespace/, /std::/, /cout\s*<</, /cin\s*>>/],
        c: [/#include\s*<.*\.h>/, /printf\s*\(/, /scanf\s*\(/, /int\s+main\s*\(/],
        csharp: [/using\s+System/, /namespace\s+\w+/, /public\s+class\s+\w+/, /Console\.WriteLine/],
        php: [/<\?php/, /\$\w+/, /echo\s+/, /function\s+\w+\s*\(/],
        ruby: [/def\s+\w+/, /puts\s+/, /require\s+['"]/, /class\s+\w+/],
        go: [/package\s+\w+/, /func\s+\w+\s*\(/, /import\s+["']/],
        rust: [/fn\s+\w+\s*\(/, /let\s+mut/, /println!\s*\(/, /use\s+std::/],
        swift: [/func\s+\w+\s*\(/, /var\s+\w+/, /let\s+\w+/, /print\s*\(/],
        kotlin: [/fun\s+\w+\s*\(/, /val\s+\w+/, /var\s+\w+/, /println\s*\(/]
    };

    for (const [language, languagePatterns] of Object.entries(patterns)) {
        if (languagePatterns.some(pattern => pattern.test(trimmedCode))) {
            return language;
        }
    }

    return 'unknown';
}

function formatResponse(data, success = true, message = null) {
    return {
        success,
        message,
        data,
        timestamp: new Date().toISOString()
    };
}

function formatError(error, statusCode = 500) {
    return {
        success: false,
        error: {
            message: error.message || 'An error occurred',
            code: error.code || 'INTERNAL_ERROR',
            status: statusCode
        },
        timestamp: new Date().toISOString()
    };
}

module.exports = {
    validateCode,
    validateLanguage,
    getCodeMetrics,
    detectLanguageFromCode,
    formatResponse,
    formatError
};
