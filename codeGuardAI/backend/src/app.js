const express = require('express');
const cors = require('cors');
const config = require('./config');
const corsOptions = require('./config/cors');
const rateLimiter = require('./middleware/rateLimiter');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Middleware
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