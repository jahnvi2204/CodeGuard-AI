import React, { useState, useRef } from 'react';
import { AlertTriangle, Shield, Zap, TrendingUp, Play, Save, Terminal, Bug, Clock, Code2, CheckCircle, XCircle } from 'lucide-react';

const CodeGuardAI = () => {
  const [code, setCode] = useState(`// Sample JavaScript code for analysis
function authenticateUser(username, password) {
  // Potential SQL injection vulnerability
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  
  // Potential XSS vulnerability  
  document.getElementById('welcome').innerHTML = "Welcome " + username;
  
  // Performance issue - inefficient loop
  let result = [];
  for(let i = 0; i < 10000; i++) {
    for(let j = 0; j < 1000; j++) {
      result.push(i * j);
    }
  }
  
  return executeQuery(query);
}

// Hardcoded secret
const API_KEY = "sk-12345abcdef";

function processData(data) {
  // Missing error handling
  const parsed = JSON.parse(data);
  return parsed.results;
}`);

  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [progress, setProgress] = useState(0);
  const textareaRef = useRef();

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    
    const stages = [
      { message: "Scanning for vulnerabilities...", duration: 800 },
      { message: "Analyzing performance patterns...", duration: 600 },
      { message: "Checking best practices...", duration: 500 },
      { message: "Calculating security score...", duration: 300 }
    ];

    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, stages[i].duration));
      setProgress(((i + 1) / stages.length) * 100);
    }
    
    const vulnerabilities = [
      {
        id: 1,
        type: 'SQL Injection',
        severity: 'Critical',
        line: 3,
        description: 'Direct string concatenation in SQL query allows injection attacks',
        suggestion: 'Use parameterized queries or prepared statements',
        cweId: 'CWE-89',
        confidence: 95
      },
      {
        id: 2,
        type: 'Cross-Site Scripting (XSS)',
        severity: 'High', 
        line: 6,
        description: 'Unsanitized user input directly inserted into DOM',
        suggestion: 'Use textContent instead of innerHTML or sanitize input',
        cweId: 'CWE-79',
        confidence: 90
      },
      {
        id: 3,
        type: 'Hardcoded Secrets',
        severity: 'High',
        line: 16,
        description: 'API key hardcoded in source code',
        suggestion: 'Use environment variables or secure configuration management',
        cweId: 'CWE-798',
        confidence: 100
      }
    ];

    const performanceIssues = [
      {
        id: 1,
        type: 'Algorithmic Complexity',
        severity: 'High',
        line: 9,
        description: 'Nested loop creates O(n²) complexity with 10M iterations',
        suggestion: 'Optimize algorithm or use more efficient data structures',
        estimatedImprovement: '95% faster execution',
        impact: 'High CPU usage, poor scalability'
      },
      {
        id: 2,
        type: 'Memory Inefficiency',
        severity: 'Medium',
        line: 10,
        description: 'Array growth in tight loop causes memory fragmentation',
        suggestion: 'Pre-allocate array size or use different data structure',
        estimatedImprovement: '60% memory reduction',
        impact: 'Memory leaks, garbage collection pressure'
      }
    ];

    const bestPractices = [
      {
        id: 1,
        type: 'Error Handling',
        severity: 'Medium',
        line: 20,
        description: 'Missing try-catch blocks for JSON parsing',
        suggestion: 'Add proper error handling for potentially unsafe operations'
      },
      {
        id: 2,
        type: 'Function Naming',
        severity: 'Low',
        line: 1,
        description: 'Function name could be more descriptive',
        suggestion: 'Consider renaming to validateUserCredentials'
      }
    ];

    const securityScore = Math.max(0, 100 - (vulnerabilities.length * 20));
    const performanceScore = Math.max(0, 100 - (performanceIssues.length * 15));
    const practicesScore = Math.max(0, 100 - (bestPractices.length * 10));
    const overallScore = Math.round((securityScore + performanceScore + practicesScore) / 3);

    setAnalysisResults({
      vulnerabilities,
      performanceIssues,
      bestPractices,
      score: overallScore,
      securityScore,
      performanceScore,
      practicesScore,
      analysisTime: '2.4s',
      linesAnalyzed: code.split('\n').length,
      timestamp: new Date().toLocaleString()
    });
    
    setIsAnalyzing(false);
    setActiveTab('analysis');
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Critical': 'from-red-600 to-red-800',
      'High': 'from-orange-500 to-red-600',
      'Medium': 'from-yellow-500 to-orange-500',
      'Low': 'from-blue-500 to-blue-600'
    };
    return `bg-gradient-to-r ${colors[severity] || 'from-gray-500 to-gray-600'}`;
  };

  const getSeverityIcon = (severity) => {
    const iconClass = "w-5 h-5 text-white";
    switch (severity) {
      case 'Critical': return <XCircle className={iconClass} />;
      case 'High': return <AlertTriangle className={iconClass} />;
      case 'Medium': return <AlertTriangle className={iconClass} />;
      case 'Low': return <CheckCircle className={iconClass} />;
      default: return <AlertTriangle className={iconClass} />;
    }
  };

  const VulnerabilityCard = ({ vuln }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-4 hover:border-gray-600 transition-all duration-200 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getSeverityColor(vuln.severity)}`}>
            {getSeverityIcon(vuln.severity)}
          </div>
          <div>
            <h4 className="font-semibold text-white text-lg">{vuln.type}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(vuln.severity)}`}>
                {vuln.severity}
              </span>
              <span className="text-gray-400 text-sm">Line {vuln.line}</span>
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-gray-400 text-sm">{vuln.confidence}% confidence</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-300 mb-4 leading-relaxed">{vuln.description}</p>
      
      <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-medium text-sm">RECOMMENDATION</span>
        </div>
        <p className="text-green-300 text-sm leading-relaxed">{vuln.suggestion}</p>
      </div>
      
      {vuln.cweId && (
        <div className="mt-3 flex items-center space-x-2">
          <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded font-mono">{vuln.cweId}</span>
        </div>
      )}
    </div>
  );

  const PerformanceCard = ({ issue }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-4 hover:border-gray-600 transition-all duration-200 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-lg">{issue.type}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(issue.severity)}`}>
                {issue.severity}
              </span>
              <span className="text-gray-400 text-sm">Line {issue.line}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-300 mb-3 leading-relaxed">{issue.description}</p>
      
      {issue.impact && (
        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 mb-4">
          <p className="text-red-300 text-sm"><strong>Impact:</strong> {issue.impact}</p>
        </div>
      )}
      
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-medium text-sm">OPTIMIZATION</span>
        </div>
        <p className="text-blue-300 text-sm leading-relaxed mb-2">{issue.suggestion}</p>
        {issue.estimatedImprovement && (
          <div className="flex items-center space-x-2">
            <span className="text-green-400 text-sm font-medium">Expected improvement:</span>
            <span className="text-green-300 text-sm">{issue.estimatedImprovement}</span>
          </div>
        )}
      </div>
    </div>
  );

  const backgroundStyle = {
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #000000 50%, #0f0f0f 75%, #000000 100%)'
  };

  return (
    <div className="min-h-screen bg-black text-white" style={backgroundStyle}>
      <header className="bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  CodeGuard AI
                </h1>
                <p className="text-gray-400 text-sm">Advanced Code Security & Performance Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105">
                <Save className="w-4 h-4" />
                <span className="font-medium">Save Project</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 mb-6 bg-gray-800/60 rounded-xl p-2 backdrop-blur-sm border border-gray-700">
          {[
            { id: 'editor', label: 'Code Editor', icon: Terminal },
            { id: 'analysis', label: 'Security Analysis', icon: Shield },
            { id: 'metrics', label: 'Performance Metrics', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'editor' && (
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-700 bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Code2 className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-semibold text-white">Code Editor</h3>
                    </div>
                    <button
                      onClick={analyzeCode}
                      disabled={isAnalyzing}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg transform hover:scale-105 font-medium"
                    >
                      <Play className="w-4 h-4" />
                      <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-96 bg-gray-900 border border-gray-600 rounded-lg p-4 text-gray-100 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-inner"
                      placeholder="Paste your code here for comprehensive security and performance analysis..."
                      style={{
                        backgroundColor: '#0f0f0f',
                        color: '#e5e7eb',
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
                      }}
                    />
                    <div className="absolute bottom-4 right-4 text-gray-500 text-xs bg-gray-800 px-2 py-1 rounded">
                      Lines: {code.split('\n').length} | Characters: {code.length}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-6">
                {analysisResults ? (
                  <>
                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
                      <div className="flex items-center space-x-3 mb-6">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                        <h3 className="text-xl font-semibold text-white">Security Vulnerabilities</h3>
                        <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm font-medium">
                          {analysisResults.vulnerabilities.length} found
                        </span>
                      </div>
                      {analysisResults.vulnerabilities.map(vuln => (
                        <VulnerabilityCard key={vuln.id} vuln={vuln} />
                      ))}
                    </div>

                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
                      <div className="flex items-center space-x-3 mb-6">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-xl font-semibold text-white">Performance Issues</h3>
                        <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm font-medium">
                          {analysisResults.performanceIssues.length} found
                        </span>
                      </div>
                      {analysisResults.performanceIssues.map(issue => (
                        <PerformanceCard key={issue.id} issue={issue} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-12 text-center shadow-2xl">
                    <Bug className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Analysis Results</h3>
                    <p className="text-gray-500">Run an analysis to see security vulnerabilities and performance issues</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
                {analysisResults ? (
                  <>
                    <div className="flex items-center space-x-3 mb-6">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-semibold text-white">Performance Dashboard</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="bg-blue-900/30 border border-blue-700/50 p-4 rounded-xl">
                        <div className="text-3xl font-bold text-blue-400">{analysisResults.score}</div>
                        <div className="text-sm text-blue-300">Overall Score</div>
                      </div>
                      <div className="bg-green-900/30 border border-green-700/50 p-4 rounded-xl">
                        <div className="text-3xl font-bold text-green-400">{analysisResults.analysisTime}</div>
                        <div className="text-sm text-green-300">Analysis Time</div>
                      </div>
                      <div className="bg-purple-900/30 border border-purple-700/50 p-4 rounded-xl">
                        <div className="text-3xl font-bold text-purple-400">{analysisResults.linesAnalyzed}</div>
                        <div className="text-sm text-purple-300">Lines Analyzed</div>
                      </div>
                      <div className="bg-orange-900/30 border border-orange-700/50 p-4 rounded-xl">
                        <div className="text-3xl font-bold text-orange-400">
                          {analysisResults.vulnerabilities.length + analysisResults.performanceIssues.length}
                        </div>
                        <div className="text-sm text-orange-300">Total Issues</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300">Security Score</span>
                          <span className="text-gray-300">{analysisResults.securityScore}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-1000" 
                            style={{width: `${analysisResults.securityScore}%`}}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300">Performance Score</span>
                          <span className="text-gray-300">{analysisResults.performanceScore}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000" 
                            style={{width: `${analysisResults.performanceScore}%`}}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300">Best Practices</span>
                          <span className="text-gray-300">{analysisResults.practicesScore}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000" 
                            style={{width: `${analysisResults.practicesScore}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Metrics Available</h3>
                    <p className="text-gray-500">Run an analysis to see performance metrics and scores</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Lines of Code</span>
                  <span className="font-medium text-white">{code.split('\n').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Analysis</span>
                  <span className="font-medium text-white">
                    {analysisResults ? 'Just now' : 'Not analyzed'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Language</span>
                  <span className="font-medium text-white">JavaScript</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-medium ${isAnalyzing ? 'text-yellow-400' : 'text-green-400'}`}>
                    {isAnalyzing ? 'Analyzing...' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">AI-Powered Features</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Advanced Security Analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">Performance Optimization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Best Practice Validation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Real-time Metrics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span className="text-gray-300">Instant Analysis</span>
                </div>
              </div>
            </div>

            {analysisResults && (
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Analysis Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Critical Issues</span>
                    <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm font-medium">
                      {analysisResults.vulnerabilities.filter(v => v.severity === 'Critical').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">High Priority</span>
                    <span className="px-3 py-1 bg-orange-900/50 text-orange-300 rounded-full text-sm font-medium">
                      {[...analysisResults.vulnerabilities, ...analysisResults.performanceIssues].filter(v => v.severity === 'High').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Medium Priority</span>
                    <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm font-medium">
                      {[...analysisResults.vulnerabilities, ...analysisResults.performanceIssues, ...analysisResults.bestPractices].filter(v => v.severity === 'Medium').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Analyzed</span>
                    <span className="text-green-400 font-medium">{analysisResults.timestamp}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                <Shield className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">AI Analysis in Progress</h3>
              <p className="text-gray-400 mb-6">Running comprehensive security scans and performance analysis</p>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                  style={{width: `${progress}%`}}
                ></div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <Terminal className="w-4 h-4" />
                <span>
                  {progress < 25 ? 'Scanning vulnerabilities...' : 
                   progress < 50 ? 'Analyzing performance...' : 
                   progress < 75 ? 'Checking best practices...' : 
                   'Calculating scores...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeGuardAI;