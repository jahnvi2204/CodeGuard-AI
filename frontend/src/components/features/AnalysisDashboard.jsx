import React from 'react';
import { AlertTriangle, Zap, Bug } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import VulnerabilityCard from './VulnerabilityCard';
import PerformanceCard from './PerformanceCard';

const AnalysisDashboard = () => {
  const { state } = useAppContext();
  const { analysisResults } = state;

  if (!analysisResults) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-12 text-center shadow-2xl">
        <Bug className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No Analysis Results</h3>
        <p className="text-gray-500">Run an analysis to see security vulnerabilities and performance issues</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vulnerabilities Section */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h3 className="text-xl font-semibold text-white">Security Vulnerabilities</h3>
          <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm font-medium">
            {analysisResults.vulnerabilities?.length || 0} found
          </span>
        </div>
        {analysisResults.vulnerabilities?.length > 0 ? (
          analysisResults.vulnerabilities.map((vuln, index) => (
            <VulnerabilityCard key={index} vuln={vuln} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No vulnerabilities detected</p>
          </div>
        )}
      </div>

      {/* Performance Issues Section */}
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Performance Issues</h3>
          <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm font-medium">
            {analysisResults.performance_issues?.length || 0} found
          </span>
        </div>
        {analysisResults.performance_issues?.length > 0 ? (
          analysisResults.performance_issues.map((issue, index) => (
            <PerformanceCard key={index} issue={issue} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No performance issues detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisDashboard;

