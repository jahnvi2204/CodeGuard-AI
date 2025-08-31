import React from 'react';
import { Shield, Terminal } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Loading = () => {
  const { state } = useAppContext();
  const { progress } = state;

  return (
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
  );
};

export default Loading;