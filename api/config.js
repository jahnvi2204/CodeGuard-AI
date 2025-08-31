// Simplified config for Vercel serverless functions
// Environment variables are automatically available in process.env

const config = {
    port: process.env.PORT || 5002,
    nodeEnv: process.env.NODE_ENV || 'production',
    mlServiceUrl: process.env.ML_SERVICE_URL || 'https://ml-service-a9l2.onrender.com',
    
    cors: {
        production: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'],
        development: ['http://localhost:3002', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:4173']
    },
    
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || (1 * 60 * 1000), // 1 minute
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 500,
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: '1 minute'
        }
    },
    
    security: {
        helmet: {
            contentSecurityPolicy: false, // Disable for development
            crossOriginEmbedderPolicy: false
        }
    },
    
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'combined'
    }
};

module.exports = config;
