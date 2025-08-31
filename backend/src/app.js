const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const config = require('./config');
const corsOptions = require('./config/cors');
const rateLimiter = require('./middleware/rateLimiter');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');
const { logger, requestLogger } = require('./utils/logger');
const routes = require('./routes');

const app = express();

// Trust proxy if configured
if (config.security.trustProxy) {
    app.set('trust proxy', 1);
}

// Security middleware
if (config.security.helmetEnabled) {
    app.use(helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    }));
}

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv === 'production') {
    app.use(morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) }
    }));
} else {
    app.use(morgan('dev'));
}
app.use(requestLogger);

// CORS and parsing middleware
app.use(cors(corsOptions));
app.use(express.json(config.json));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Routes
app.use(routes);

// Error handling
app.use('*', notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;