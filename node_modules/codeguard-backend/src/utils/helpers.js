const getCurrentTimestamp = () => new Date().toISOString();

const getCodeMetrics = (code) => ({
    codeLength: code.length,
    lineCount: code.trim() ? code.split('\n').length : 0
});

const createErrorResponse = (error, details = null) => ({
    error,
    details,
    timestamp: getCurrentTimestamp()
});

const createSuccessResponse = (data, metadata = null) => ({
    ...data,
    ...(metadata && { metadata }),
    timestamp: getCurrentTimestamp()
});

module.exports = {
    getCurrentTimestamp,
    getCodeMetrics,
    createErrorResponse,
    createSuccessResponse
};
