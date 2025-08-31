# CodeGuard AI 🛡️

A comprehensive AI-powered code analysis platform that detects vulnerabilities, analyzes performance, and provides intelligent insights for secure and efficient software development.

## 🚀 Features

- **🔍 Code Vulnerability Detection**: Advanced AI-powered analysis to identify security vulnerabilities
- **⚡ Performance Analysis**: Comprehensive performance bottleneck detection and optimization suggestions
- **🤖 Language Auto-Detection**: Automatically detects programming languages
- **📊 Interactive Dashboard**: Beautiful, responsive interface with real-time analysis results
- **🔧 Multi-Language Support**: JavaScript, Python, Java, C++, C, and more
- **📈 Detailed Metrics**: In-depth analysis with actionable recommendations

## 🏗️ Architecture

### Backend (Node.js + Express)
- **RESTful API** with comprehensive endpoint coverage
- **Rate limiting** and security middleware
- **ML Service Integration** for AI-powered analysis
- **Structured logging** with Winston
- **Production-ready** configurations

### Frontend (React + Vite)
- **Modern React 18** with hooks and context
- **Responsive design** with Tailwind CSS
- **Real-time updates** and interactive components
- **Optimized build** with code splitting

### Infrastructure
- **Docker containerization** for easy deployment
- **Docker Compose** for multi-service orchestration
- **Production configurations** with security best practices
- **Health checks** and monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Docker and Docker Compose (optional, for containerized deployment)

### Option 1: Docker Deployment (Recommended)

```bash
# Clone the repository
git clone https://github.com/jahnvi2204/CodeGuard-AI.git
cd CodeGuard-AI

# Start development environment
docker-compose up -d

# Or start production environment
docker-compose -f docker-compose.prod.yml up -d
```

**Access the application:**
- Frontend: http://localhost (port 80)
- Backend API: http://localhost:5002
- Health Check: http://localhost:5002/api/health

### Option 2: Local Development

#### Backend Setup
```bash
cd codeGuardAI/backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd codeGuardAI/frontend
npm install
npm run dev
```

### Option 3: Using Deployment Scripts

#### Linux/macOS
```bash
# Make script executable
chmod +x deploy.sh

# Deploy development environment
./deploy.sh dev

# Deploy production environment
./deploy.sh prod --build

# Show logs
./deploy.sh prod --logs

# Stop services
./deploy.sh prod --stop
```

#### Windows
```cmd
# Deploy development environment
deploy.bat dev

# Deploy production environment
deploy.bat prod --build

# Show status
deploy.bat prod --status
```

## 📖 API Documentation

### Core Endpoints

#### Health Check
```
GET /api/health
```

#### Language Detection
```
POST /api/detect-language
Content-Type: application/json

{
  "code": "console.log('Hello World');"
}
```

#### Code Analysis
```
POST /api/analyze-code
Content-Type: application/json

{
  "code": "your code here",
  "language": "javascript"
}
```

#### Vulnerability Analysis
```
POST /api/analyze-vulnerabilities
Content-Type: application/json

{
  "code": "your code here",
  "language": "javascript"
}
```

#### Performance Analysis
```
POST /api/analyze-performance
Content-Type: application/json

{
  "code": "your code here",
  "language": "javascript"
}
```

### Response Format

All analysis endpoints return:
```json
{
  "success": true,
  "data": {
    "analysis": "...",
    "metrics": {...},
    "suggestions": [...]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Configuration

### Environment Variables

#### Backend Configuration
Create `.env` in `codeGuardAI/backend/`:
```env
PORT=5002
NODE_ENV=production
ML_SERVICE_URL=https://ml-service-a9l2.onrender.com
CORS_ORIGINS=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=500
HELMET_ENABLED=true
TRUST_PROXY=true
LOG_LEVEL=info
```

#### Frontend Configuration
Create `.env` in `codeGuardAI/frontend/`:
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_APP_NAME=CodeGuard AI
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
```

## 🚢 Deployment

### Cloud Platforms

#### Netlify + Render
1. **Frontend (Netlify)**:
   - Connect GitHub repository
   - Build command: `cd codeGuardAI/frontend && npm run build`
   - Publish directory: `codeGuardAI/frontend/dist`

2. **Backend (Render)**:
   - Connect GitHub repository
   - Root directory: `codeGuardAI/backend`
   - Build command: `npm install`
   - Start command: `npm start`

#### Vercel + Railway
1. **Frontend (Vercel)**:
   ```bash
   cd codeGuardAI/frontend
   npx vercel --prod
   ```

2. **Backend (Railway)**:
   - Connect repository with `codeGuardAI/backend` as root

#### AWS/Google Cloud/Azure
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed cloud deployment instructions.

### Docker Deployment

#### Development
```bash
docker-compose up -d
```

#### Production
```bash
# Create production environment
cp .env.example .env
# Edit .env with production values

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** configuration for cross-origin requests
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **Error handling** without information leakage
- **Environment variable** protection
- **Non-root Docker containers**

## 📊 Monitoring

### Health Checks
- Backend: `/api/health`
- Frontend: `/health`
- Docker health checks included

### Logging
- Structured logging with Winston
- Log rotation and management
- Error tracking and debugging
- Performance monitoring

### Metrics
- Response time tracking
- Error rate monitoring
- Resource usage metrics
- API endpoint analytics

## 🧪 Testing

```bash
# Backend tests
cd codeGuardAI/backend
npm test
npm run test:coverage

# Frontend tests (to be implemented)
cd codeGuardAI/frontend
npm test

# Linting
npm run lint
npm run lint:fix
```

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Comprehensive deployment instructions
- [API Documentation](docs/API.md) - Detailed API reference
- [Architecture Guide](docs/ARCHITECTURE.md) - System architecture overview
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Todo

- [ ] Add comprehensive test suite
- [ ] Implement user authentication
- [ ] Add database integration
- [ ] Create CI/CD pipeline
- [ ] Add real-time notifications
- [ ] Implement code diff analysis
- [ ] Add more programming languages
- [ ] Create mobile application

## 🐛 Known Issues

- ML service dependency on external API
- Limited language support in current version
- Performance optimization needed for large files

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Jahnvi Saxena** - *Lead Developer* - [GitHub](https://github.com/jahnvi2204)

## 🙏 Acknowledgments

- ML service powered by advanced AI models
- UI inspired by modern development tools
- Built with love for the developer community

## 📞 Support

- 📧 Email: support@codeguard-ai.com
- 🐛 Issues: [GitHub Issues](https://github.com/jahnvi2204/CodeGuard-AI/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/jahnvi2204/CodeGuard-AI/discussions)

---

<div align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red.svg" alt="Made with love">
  <img src="https://img.shields.io/badge/React-18.3.1-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/Docker-Ready-blue.svg" alt="Docker">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
</div>

<div align="center">
  <strong>🛡️ Secure Code, Better Future 🚀</strong>
</div>

