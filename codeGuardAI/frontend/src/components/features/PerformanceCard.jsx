import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { getSeverityColor } from '../../utils/helpers';

const PerformanceCard = ({ issue }) => {
  return (
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
};

export default PerformanceCard;

