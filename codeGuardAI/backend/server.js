const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const PORT = process.env.PORT || 5000;

// ============================================================================
// PROGRAMMING LANGUAGE DETECTION
// ============================================================================





// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('📝 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📝 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

// Start server with comprehensive error handling
const server = app.listen(PORT, () => {
    console.log(`🚀 Enhanced CodeGuard Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔍 Language detection: http://localhost:${PORT}/api/detect-language`);
    console.log(`🧪 Code analysis: http://localhost:${PORT}/api/analyze-code`);
    console.log(`🤖 ML service URL: ${ML_SERVICE_URL}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⚡ Server ready to accept connections`);
});

// Handle server startup errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please choose a different port or stop the process using this port.`);
        console.error(`💡 Try: lsof -ti:${PORT} | xargs kill -9`);
    } else if (error.code === 'EACCES') {
        console.error(`❌ Permission denied to bind to port ${PORT}. Try using a port > 1024 or run with sudo.`);
    } else {
        console.error(`❌ Server startup error:`, error);
    }
    process.exit(1);
});

module.exports = app;