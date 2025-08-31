// API Constants for Vercel functions
const API_ENDPOINTS = {
    HEALTH: '/health',
    ANALYZE_CODE: '/analyze-code',
    ANALYZE_PERFORMANCE: '/analyze-performance', 
    ANALYZE_VULNERABILITIES: '/analyze-vulnerabilities',
    DETECT_LANGUAGE: '/detect-language',
    ML_STATUS: '/ml-status'
};

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
};

const ERROR_MESSAGES = {
    VALIDATION_ERROR: 'Validation failed',
    INTERNAL_ERROR: 'Internal server error',
    METHOD_NOT_ALLOWED: 'Method not allowed',
    RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
    ML_SERVICE_UNAVAILABLE: 'ML service is currently unavailable',
    INVALID_LANGUAGE: 'Unsupported or invalid programming language',
    EMPTY_CODE: 'Code cannot be empty',
    CODE_TOO_LARGE: 'Code exceeds maximum size limit'
};

const SUPPORTED_LANGUAGES = [
    'javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'php', 'ruby', 
    'go', 'rust', 'typescript', 'kotlin', 'swift', 'scala', 'r', 'matlab',
    'perl', 'lua', 'bash', 'powershell', 'sql', 'html', 'css', 'xml', 'json'
];

const VALIDATION_RULES = {
    CODE_MAX_LENGTH: 100000, // 100KB
    CODE_MIN_LENGTH: 1,
    LANGUAGE_MAX_LENGTH: 50
};

module.exports = {
    API_ENDPOINTS,
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUPPORTED_LANGUAGES,
    VALIDATION_RULES
};
