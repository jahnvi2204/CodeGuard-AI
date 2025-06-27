import React, { useState, useEffect, useRef } from 'react';
import { Shield, Save, FolderOpen, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

const Header = () => {
  const { state, actions } = useAppContext();
  const [message, setMessage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const dropdownRef = useRef();

  // Load saved projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('codeguard_projects');
    setProjects(saved ? JSON.parse(saved) : []);
  }, [message]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleSave = () => {
    const project = {
      code: state.code,
      language: state.language,
      analysisResults: state.analysisResults,
      savedAt: new Date().toISOString()
    };
    const saved = localStorage.getItem('codeguard_projects');
    const arr = saved ? JSON.parse(saved) : [];
    arr.unshift(project); // newest first
    localStorage.setItem('codeguard_projects', JSON.stringify(arr));
    setMessage('Project saved!');
    setTimeout(() => setMessage(''), 1500);
  };

  const handleLoad = (project) => {
    actions.setCode(project.code || '');
    actions.setLanguage(project.language || 'auto');
    actions.setAnalysisResults(project.analysisResults || null);
    setMessage('Project loaded!');
    setDropdownOpen(false);
    setTimeout(() => setMessage(''), 1500);
  };

  return (
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
          <div className="flex items-center space-x-4 relative">
            <button
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105"
              onClick={handleSave}
            >
              <Save className="w-4 h-4" />
              <span className="font-medium">Save Project</span>
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg transform hover:scale-105"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                <FolderOpen className="w-4 h-4" />
                <span className="font-medium">Saved Projects</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
                  {projects.length === 0 ? (
                    <div className="p-4 text-gray-400 text-sm">No saved projects.</div>
                  ) : (
                    projects.map((proj, idx) => (
                      <button
                        key={proj.savedAt + idx}
                        className="w-full text-left px-4 py-2 hover:bg-gray-800 text-gray-200 text-sm border-b border-gray-800 last:border-b-0"
                        onClick={() => handleLoad(proj)}
                      >
                        Saved: {formatTimestamp(proj.savedAt)}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {message && (
              <span className="ml-4 text-green-400 text-sm">{message}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
