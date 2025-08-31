const LANGUAGE_PATTERNS = {
    python: [
        /def\s+\w+\s*\(/,
        /import\s+\w+/,
        /from\s+\w+\s+import/,
        /if\s+__name__\s*==\s*['"']__main__['"']/,
        /print\s*\(/,
        /class\s+\w+.*:/
    ],
    javascript: [
        /function\s+\w+\s*\(/,
        /const\s+\w+\s*=/,
        /let\s+\w+\s*=/,
        /var\s+\w+\s*=/,
        /=>\s*{/,
        /console\.log\s*\(/,
        /require\s*\(/,
        /module\.exports/
    ],
    java: [
        /public\s+class\s+\w+/,
        /public\s+static\s+void\s+main/,
        /import\s+java\./,
        /System\.out\.print/,
        /private\s+\w+\s+\w+/,
        /public\s+\w+\s+\w+\s*\(/
    ],
    cpp: [
        /#include\s*<.*>/,
        /using\s+namespace\s+std/,
        /int\s+main\s*\(/,
        /std::/,
        /cout\s*<</, 
        /cin\s*>>/
    ],
    c: [
        /#include\s*<.*\.h>/,
        /int\s+main\s*\(/,
        /printf\s*\(/,
        /scanf\s*\(/,
        /malloc\s*\(/,
        /free\s*\(/
    ]
};

const API_ENDPOINTS = [
    'GET /api/health',
    'POST /api/detect-language',
    'POST /api/analyze-code',
    'POST /api/analyze-vulnerabilities',
    'POST /api/analyze-performance',
    'GET /api/ml-status',
    'POST /api/test-ml-connection'
];

const ML_SERVICE_ENDPOINTS = [
    'POST /analyze/vulnerabilities',
    'POST /analyze/performance', 
    'POST /analyze/complete',
    'GET /health',
    'GET /system-status',
    'POST /test-analysis',
    'GET /debug-environment'
];
module.exports = {
    LANGUAGE_PATTERNS,
    API_ENDPOINTS,
    ML_SERVICE_ENDPOINTS
};
