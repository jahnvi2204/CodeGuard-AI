// server.js - Main Express server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const multer = require('multer');
const { Server } = require('socket.io');
const http = require('http');
const redis = require('redis');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// Redis client for caching
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// File upload configuration
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// MongoDB Models
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['developer', 'admin'], default: 'developer' },
  createdAt: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  language: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  files: [{
    name: String,
    content: String,
    path: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AnalysisSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  vulnerabilities: [{
    type: String,
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
    line: Number,
    description: String,
    suggestion: String,
    cweId: String
  }],
  performanceIssues: [{
    type: String,
    severity: { type: String, enum: ['Low', 'Medium', 'High'] },
    line: Number,
    description: String,
    suggestion: String,
    estimatedImprovement: String
  }],
  bestPractices: [{
    type: String,
    severity: { type: String, enum: ['Low', 'Medium', 'High'] },
    line: Number,
    description: String,
    suggestion: String
  }],
  score: { type: Number, min: 0, max: 100 },
  analysisTime: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Analysis = mongoose.model('Analysis', AnalysisSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// ML Analysis Service
class MLAnalysisService {
  static async analyzeCode(code, language) {
    const startTime = Date.now();
    
    // Simulate ML analysis - in production, this would call Python microservices
    const vulnerabilities = await this.detectVulnerabilities(code, language);
    const performanceIssues = await this.analyzePerformance(code, language);
    const bestPractices = await this.checkBestPractices(code, language);
    
    const analysisTime = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
    const score = this.calculateScore(vulnerabilities, performanceIssues, bestPractices);
    
    return {
      vulnerabilities,
      performanceIssues,
      bestPractices,
      score,
      analysisTime
    };
  }

  static async detectVulnerabilities(code, language) {
    // Simulated vulnerability detection patterns
    const vulnerabilities = [];
    
    // SQL Injection detection
    if (code.includes("SELECT") && code.includes("+ ")) {
      vulnerabilities.push({
        type: 'SQL Injection',
        severity: 'High',
        line: this.findLineNumber(code, "SELECT"),
        description: 'Direct string concatenation in SQL query allows injection attacks',
        suggestion: 'Use parameterized queries or prepared statements',
        cweId: 'CWE-89'
      });
    }
    
    // XSS detection
    if (code.includes("innerHTML") && code.includes("+ ")) {
      vulnerabilities.push({
        type: 'Cross-Site Scripting (XSS)',
        severity: 'Medium',
        line: this.findLineNumber(code, "innerHTML"),
        description: 'Unsanitized user input directly inserted into DOM',
        suggestion: 'Use textContent instead of innerHTML or sanitize input',
        cweId: 'CWE-79'
      });
    }
    
    // Buffer overflow (for C/C++)
    if (language === 'c' || language === 'cpp') {
      if (code.includes("strcpy") || code.includes("strcat")) {
        vulnerabilities.push({
          type: 'Buffer Overflow',
          severity: 'Critical',
          line: this.findLineNumber(code, "strcpy"),
          description: 'Unsafe string functions can cause buffer overflow',
          suggestion: 'Use safer alternatives like strncpy or string classes',
          cweId: 'CWE-120'
        });
      }
    }
    
    return vulnerabilities;
  }

  static async analyzePerformance(code, language) {
    const issues = [];
    
    // Nested loop detection
    const nestedLoopPattern = /for\s*\([^}]*\{[^}]*for\s*\(/g;
    if (nestedLoopPattern.test(code)) {
      issues.push({
        type: 'Algorithmic Complexity',
        severity: 'High',
        line: this.findLineNumber(code, "for"),
        description: 'Nested loop creates O(n²) complexity',
        suggestion: 'Optimize algorithm or use more efficient data structures',
        estimatedImprovement: '95% faster execution'
      });
    }
    
    // Large array creation in loop
    if (code.includes("push") && code.includes("for")) {
      issues.push({
        type: 'Memory Inefficiency',
        severity: 'Medium',
        line: this.findLineNumber(code, "push"),
        description: 'Array growth in tight loop causes memory fragmentation',
        suggestion: 'Pre-allocate array size or use different data structure',
        estimatedImprovement: '60% memory reduction'
      });
    }
    
    return issues;
  }

  static async checkBestPractices(code, language) {
    const issues = [];
    
    // Function naming
    if (code.includes("function ")) {
      const functionPattern = /function\s+([a-z][a-zA-Z]*)/g;
      let match;
      while ((match = functionPattern.exec(code)) !== null) {
        if (match[1].length < 5) {
          issues.push({
            type: 'Function Naming',
            severity: 'Low',
            line: this.findLineNumber(code, match[0]),
            description: 'Function name could be more descriptive',
            suggestion: 'Use descriptive names that explain the function\'s purpose'
          });
        }
      }
    }
    
    // Missing error handling
    if (!code.includes("try") && !code.includes("catch")) {
      issues.push({
        type: 'Error Handling',
        severity: 'Medium',
        line: 1,
        description: 'No error handling detected in code',
        suggestion: 'Add try-catch blocks for proper error handling'
      });
    }
    
    return issues;
  }

  static findLineNumber(code, searchString) {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchString)) {
        return i + 1;
      }
    }
    return 1;
  }

  static calculateScore(vulnerabilities, performanceIssues, bestPractices) {
    let score = 100;
    
    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'Critical': score -= 25; break;
        case 'High': score -= 15; break;
        case 'Medium': score -= 10; break;
        case 'Low': score -= 5; break;
      }
    });
    
    performanceIssues.forEach(issue => {
      switch (issue.severity) {
        case 'High': score -= 10; break;
        case 'Medium': score -= 5; break;
        case 'Low': score -= 2; break;
      }
    });
    
    bestPractices.forEach(practice => {
      switch (practice.severity) {
        case 'High': score -= 5; break;
        case 'Medium': score -= 3; break;
        case 'Low': score -= 1; break;
      }
    });
    
    return Math.max(0, score);
  }
}

// Routes

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analysis Routes
app.post('/api/analysis/analyze', authenticateToken, async (req, res) => {
  try {
    const { code, language, projectId } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }
    
    // Check cache first
    const cacheKey = `analysis:${Buffer.from(code).toString('base64')}:${language}`;
    const cachedResult = await redisClient.get(cacheKey);
    
    if (cachedResult) {
      return res.json({
        ...JSON.parse(cachedResult),
        cached: true
      });
    }
    
    // Perform ML analysis
    const analysisResult = await MLAnalysisService.analyzeCode(code, language);
    
    // Save analysis to database
    const analysis = new Analysis({
      projectId: projectId || null,
      userId: req.user.userId,
      code,
      language,
      ...analysisResult
    });
    
    await analysis.save();
    
    // Cache result for 1 hour
    await redisClient.setex(cacheKey, 3600, JSON.stringify(analysisResult));
    
    // Emit real-time update if WebSocket connected
    io.to(`user:${req.user.userId}`).emit('analysisComplete', {
      analysisId: analysis._id,
      result: analysisResult
    });
    
    res.json(analysisResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analysis/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const analyses = await Analysis.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('projectId', 'name');
    
    const total = await Analysis.countDocuments({ userId: req.user.userId });
    
    res.json({
      analyses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project Routes
app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { name, description, language } = req.body;
    
    const project = new Project({
      name,
      description,
      language,
      userId: req.user.userId
    });
    
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// File Upload Route
app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fs = require('fs');
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    
    // Detect language from file extension
    const extension = req.file.originalname.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'ts': 'typescript'
    };
    
    const language = languageMap[extension] || 'text';
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({
      content: fileContent,
      language,
      filename: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined room`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() + 's'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codeguard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});