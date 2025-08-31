const rateLimit = require('express-rate-limit');
const config = require('../config');

const rateLimiter = rateLimit(config.rateLimit);

module.exports = rateLimiter;