const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mlServiceUrl: process.env.ML_SERVICE_URL || 'https://ml-service-a9l2.onrender.com',
    
    cors: {
        production: ['https://your-frontend-domain.com'],
        development: ['http://localhost:3002', 'http://localhost:3001', 'http://localhost:5173']
    },
    
    rateLimit: {
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 500,
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: '1 minute'
        }
    },
    
    json: {
        limit: '10mb'
    }
};

module.exports = config;