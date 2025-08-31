import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const MetricsDashboard = () => {
  const { state } = useAppContext();
  const { analysisResults } = state;

  if (!analysisResults) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Metrics Available</h3>
          <p className="text-gray-500">Run an analysis to see performance metrics and scores</p>
        </div>
      </div>
    );
  }

  const calculateScores = () => {
    const vulnerabilities = analysisResults.vulnerabilities || [];
    const performanceIssues = analysisResults.performance_issues || [];
    const bestPractices = analysisResults.best_practices || [];

    const securityScore = Math.max(0, 100 - (vulnerabilities.length * 20));
    const performanceScore = Math.max(0, 100 - (performanceIssues.length * 15));
    const practicesScore = Math.max(0, 100 - (bestPractices.length * 10));
    const overallScore = Math.round((securityScore + performanceScore + practicesScore) / 3);

    return { securityScore, performanceScore, practicesScore, overallScore };
  };

  const scores = calculateScores();

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <TrendingUp className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Performance Dashboard</h3>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-900/30 border border-blue-700/50 p-4 rounded-xl">
          <div className="text-3xl font-bold text-blue-400">{scores.overallScore}</div>
          <div className="text-sm text-blue-300">Overall Score</div>
        </div>
        <div className="bg-green-900/30 border border-green-700/50 p-4 rounded-xl">
          <div className="text-3xl font-bold text-green-400">{analysisResults.analysis_time || '2.4s'}</div>
          <div className="text-sm text-green-300">Analysis Time</div>
        </div>
        <div className="bg-purple-900/30 border border-purple-700/50 p-4 rounded-xl">
          <div className="text-3xl font-bold text-purple-400">{analysisResults.lines_analyzed || (state.code.trim() ? state.code.split('\n').length : 0)}</div>
          <div className="text-sm text-purple-300">Lines Analyzed</div>
        </div>
        <div className="bg-orange-900/30 border border-orange-700/50 p-4 rounded-xl">
          <div className="text-3xl font-bold text-orange-400">
            {(analysisResults.vulnerabilities?.length || 0) + (analysisResults.performance_issues?.length || 0)}
          </div>
          <div className="text-sm text-orange-300">Total Issues</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Security Score</span>
            <span className="text-gray-300">{scores.securityScore}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-1000" 
              style={{width: `${scores.securityScore}%`}}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Performance Score</span>
            <span className="text-gray-300">{scores.performanceScore}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000" 
              style={{width: `${scores.performanceScore}%`}}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Best Practices</span>
            <span className="text-gray-300">{scores.practicesScore}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000" 
              style={{width: `${scores.practicesScore}%`}}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;


