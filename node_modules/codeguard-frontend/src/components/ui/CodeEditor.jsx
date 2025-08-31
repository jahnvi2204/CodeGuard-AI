import React from 'react';
import { Code2, Play, FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useCodeAnalysis } from '../../hooks/UseCodeAnalysis';
import { SAMPLE_CODES } from '../../utils/Constants';
import LanguageDetector from './LanguageDetector';

const CodeEditor = () => {
  const { state, actions } = useAppContext();
  const { analyzeCode, isAnalyzing } = useCodeAnalysis();

  const handleAnalyze = () => {
    analyzeCode();
  };

  const loadSampleCode = () => {
    const currentLanguage = state.language === 'auto' ? 'javascript' : state.language;
    const sampleCode = SAMPLE_CODES[currentLanguage] || SAMPLE_CODES.javascript;
    actions.setCode(sampleCode);
    if (state.language === 'auto') {
      actions.setLanguage('javascript');
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Code2 className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Code Editor</h3>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadSampleCode}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-lg font-medium transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              <span>Load Sample</span>
            </button>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !state.code?.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg transform hover:scale-105 font-medium"
            >
              <Play className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="relative">
          <textarea
            value={state.code}
            onChange={(e) => actions.setCode(e.target.value)}
            className="w-full h-96 bg-gray-900 border border-gray-600 rounded-lg p-4 text-gray-100 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-inner"
            placeholder="Paste your code here for comprehensive security and performance analysis..."
            style={{
              backgroundColor: '#0f0f0f',
              color: '#e5e7eb',
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
            }}
          />
          <div className="absolute bottom-4 right-4 text-gray-500 text-xs bg-gray-800 px-2 py-1 rounded">
            Lines: {state.code.trim() ? state.code.split('\n').length : 0} | Characters: {state.code.length}
          </div>
        </div>
        <LanguageDetector />
      </div>
    </div>
  );
};

export default CodeEditor;
