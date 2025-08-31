# CodeGuard AI Frontend

Beautiful React frontend for CodeGuard AI - Advanced Code Security & Performance Analysis.

## ?? Features

- **Dark Theme UI** with gradient backgrounds
- **Real-time Code Analysis** with ML service integration
- **Security Vulnerability Detection** with detailed reports
- **Performance Metrics Dashboard** with visual analytics
- **Responsive Design** built with Tailwind CSS
- **Modern React** with hooks and context API

## ?? Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## ?? Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## ??? Project Structure

```
frontend/
+-- public/
+-- src/
¦   +-- components/
¦   ¦   +-- common/
¦   ¦   +-- ui/
¦   ¦   +-- features/
¦   +-- context/
¦   +-- hooks/
¦   +-- services/
¦   +-- styles/
¦   +-- utils/
+-- package.json
+-- vite.config.js
```

## ?? Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)
- Axios (API calls)
- React Hot Toast (notifications)

## ?? API Integration

The frontend connects to the CodeGuard AI backend endpoints:
- `/api/analyze-code` - Complete code analysis
- `/api/analyze-vulnerabilities` - Security analysis
- `/api/analyze-performance` - Performance analysis
- `/api/health` - Service health check
- `/api/ml-status` - ML service status

Built with ?? by Jahnvi Saxena
