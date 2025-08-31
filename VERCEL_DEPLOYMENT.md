# CodeGuard AI - Vercel Deployment Guide

This project has been converted from Docker to Vercel deployment. The backend now runs as serverless functions while the frontend is served as a static site.

## Project Structure

```
codeguard-ai/
├── api/                              # Vercel serverless functions
│   ├── health.js                     # Health check endpoint
│   ├── ml-status.js                  # ML service status
│   ├── detect-language.js            # Language detection
│   ├── analyze-code.js               # Code analysis
│   ├── analyze-vulnerabilities.js    # Vulnerability analysis
│   ├── analyze-performance.js        # Performance analysis
│   ├── test-ml-connection.js         # ML connection test
│   └── package.json                  # API dependencies
├── codeGuardAI/
│   ├── frontend/                     # React frontend
│   └── backend/                      # Original backend (kept for modules)
├── vercel.json                       # Vercel configuration
├── package.json                      # Root package.json with deployment scripts
└── env.production                    # Environment variables example

```

## Deployment Steps

### 1. Prerequisites
- Vercel CLI installed: `npm i -g vercel`
- Vercel account

### 2. Environment Variables
Set these in your Vercel dashboard or via CLI:

```bash
# Frontend
VITE_API_BASE_URL=/api
VITE_APP_NAME=CodeGuard AI
VITE_APP_VERSION=1.0.0

# Backend/API
NODE_ENV=production
ML_SERVICE_URL=https://ml-service-a9l2.onrender.com
CORS_ORIGINS=https://codeguard-ai.vercel.app
HELMET_ENABLED=true
TRUST_PROXY=true
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

### 4. Local Development

```bash
# Install dependencies
npm run install:all

# Run locally with Vercel dev server
npm run vercel:dev

# Or run frontend only
npm run dev:frontend
```

## API Endpoints

All API endpoints are now serverless functions:

- `GET /api/health` - Health check
- `GET /api/ml-status` - ML service status
- `POST /api/detect-language` - Language detection
- `POST /api/analyze-code` - Complete code analysis
- `POST /api/analyze-vulnerabilities` - Vulnerability analysis
- `POST /api/analyze-performance` - Performance analysis
- `POST /api/test-ml-connection` - Test ML service connection

## Changes Made

### Removed Docker Components
- ✅ Removed all Dockerfiles
- ✅ Removed docker-compose files
- ✅ Removed nginx configuration
- ✅ Removed Docker deployment scripts

### Added Vercel Components
- ✅ Created `/api` directory with serverless functions
- ✅ Updated `vercel.json` configuration
- ✅ Updated package.json scripts for Vercel
- ✅ Updated frontend API base URL
- ✅ Added environment configuration

### Configuration Updates
- Frontend now uses relative `/api` paths
- CORS configured for Vercel domain
- Environment variables optimized for serverless
- Build process updated for static site generation

## Troubleshooting

### Function Timeout
If functions timeout, check the ML service URL and network connectivity.

### CORS Issues
Ensure `CORS_ORIGINS` environment variable includes your Vercel domain.

### Build Failures
Check that all dependencies are properly listed in the respective package.json files.

### Environment Variables
Verify all required environment variables are set in Vercel dashboard.

## Scripts

- `npm run deploy` - Deploy to production
- `npm run deploy:preview` - Deploy preview
- `npm run vercel:dev` - Local development with Vercel
- `npm run vercel:build` - Build for Vercel
- `npm run build` - Build frontend only
- `npm run dev` - Local development (frontend + backend separately)

## Performance

Serverless functions provide:
- Automatic scaling
- Pay-per-use billing
- Global edge distribution
- Reduced infrastructure management

The ML service remains external at `https://ml-service-a9l2.onrender.com`.
