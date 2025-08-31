import React from 'react';
import { Shield, Zap, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../utils/Constants';

const Sidebar = () => {
  const { state } = useAppContext();
  const { analysisResults, isAnalyzing, code, language } = state;

  // Find the label for the current language value
  const languageLabel =
    SUPPORTED_LANGUAGES.find(l => l.value === language)?.label ||
    (language === 'unknown' ? 'Unknown' : (language ? language.charAt(0).toUpperCase() + language.slice(1) : ''));

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
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
            <span className="font-medium text-white">{languageLabel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Status</span>
            <span className={`font-medium ${isAnalyzing ? 'text-yellow-400' : 'text-green-400'}`}>
              {isAnalyzing ? 'Analyzing...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* AI Features */}
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

      {/* Analysis Summary */}
      {analysisResults && (
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Analysis Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Critical Issues</span>
              <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm font-medium">
                {(analysisResults.vulnerabilities || []).filter(v => v.severity === 'Critical').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">High Priority</span>
              <span className="px-3 py-1 bg-orange-900/50 text-orange-300 rounded-full text-sm font-medium">
                {[
                  ...(analysisResults.vulnerabilities || []), 
                  ...(analysisResults.performance_issues || [])
                ].filter(v => v.severity === 'High').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Medium Priority</span>
              <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm font-medium">
                {[
                  ...(analysisResults.vulnerabilities || []), 
                  ...(analysisResults.performance_issues || []),
                  ...(analysisResults.best_practices || [])
                ].filter(v => v.severity === 'Medium').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Analyzed</span>
              <span className="text-green-400 font-medium">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
