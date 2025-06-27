const app = require('./src/app');
const config = require('./src/config');
const MLService = require('./src/services/mlService');

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
    console.log(`📝 Received ${signal}, shutting down gracefully...`);
    process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server with comprehensive error handling
const server = app.listen(config.port, async () => {
    console.log(`🚀 Enhanced CodeGuard Server running on port ${config.port}`);
    console.log(`🔗 Health check: http://localhost:${config.port}/api/health`);
    console.log(`🔍 Language detection: http://localhost:${config.port}/api/detect-language`);
    console.log(`🧪 Code analysis: http://localhost:${config.port}/api/analyze-code`);
    console.log(`🛡️  Vulnerability analysis: http://localhost:${config.port}/api/analyze-vulnerabilities`);
    console.log(`⚡ Performance analysis: http://localhost:${config.port}/api/analyze-performance`);
    console.log(`📊 ML service status: http://localhost:${config.port}/api/ml-status`);
    console.log(`🤖 ML service URL: ${config.mlServiceUrl}`);
    console.log(`📚 Environment: ${config.nodeEnv}`);
    
    // Test ML service connection on startup
    console.log('🔍 Testing ML service connection...');
    const healthCheck = await MLService.checkHealth();
    if (healthCheck.available) {
        console.log('✅ ML service is available and responding');
    } else {
        console.log('⚠️  ML service is not responding:', healthCheck.error);
        console.log('💡 Server will still start, but ML features may not work');
    }
    
    console.log(`⚡ Server ready to accept connections`);
});

// Handle server startup errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${config.port} is already in use. Please choose a different port or stop the process using this port.`);
        console.error(`💡 Try: lsof -ti:${config.port} | xargs kill -9`);
    } else if (error.code === 'EACCES') {
        console.error(`❌ Permission denied to bind to port ${config.port}. Try using a port > 1024 or run with sudo.`);
    } else {
        console.error(`❌ Server startup error:`, error);
    }
    process.exit(1);
});

module.exports = server;