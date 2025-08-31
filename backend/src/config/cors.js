const config = require('./index');

const corsOptions = {
    origin: config.nodeEnv === 'production' 
        ? config.cors.production
        : config.cors.development,
    credentials: true
};

module.exports = corsOptions;
