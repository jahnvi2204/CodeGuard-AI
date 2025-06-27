const { createErrorResponse, getCurrentTimestamp } = require('../utils/helpers');

const notFoundHandler = (req, res) => {
    const { API_ENDPOINTS } = require('../utils/constants');
    
    res.status(404).json({
        error: 'Endpoint not found',
        message: `${req.method} ${req.originalUrl} is not a valid endpoint`,
        availableEndpoints: API_ENDPOINTS,
        timestamp: getCurrentTimestamp()
    });
};

const globalErrorHandler = (error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: 'Something went wrong on our end',
        timestamp: getCurrentTimestamp()
    });
};

module.exports = {
    notFoundHandler,
    globalErrorHandler
};