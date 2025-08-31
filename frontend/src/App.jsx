import React, { useEffect, useCallback } from 'react';
import { Terminal, Shield, TrendingUp } from 'lucide-react';
import { useAppContext } from './context/AppContext';
import { useCodeAnalysis } from './hooks/useCodeAnalysis';
import Header from './components/common/Header';
import Loading from './components/common/Loading';
import CodeEditor from './components/ui/CodeEditor';
import AnalysisDashboard from './components/features/AnalysisDashboard';
import MetricsDashboard from './components/features/MetricsDashboard';
import Sidebar from './components/features/Sidebar';

function App() {
  const { state, actions } = useAppContext();
  const { checkServiceStatus } = useCodeAnalysis();

  // Memoize the service status check to prevent unnecessary re-renders
  const handleServiceStatusCheck = useCallback(() => {
    if (checkServiceStatus) {
      checkServiceStatus();
    }
  }, [checkServiceStatus]);

  useEffect(() => {
    handleServiceStatusCheck();
  }, [handleServiceStatusCheck]);

  const backgroundStyle = {
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #000000 50%, #0f0f0f 75%, #000000 100%)'
  };

  const tabs = [
    { id: 'editor', label: 'Code Editor', icon: Terminal },
    { id: 'analysis', label: 'Security Analysis', icon: Shield },
    { id: 'metrics', label: 'Performance Metrics', icon: TrendingUp }
  ];

  const renderTabContent = () => {
    try {
      switch (state.activeTab) {
        case 'editor':
          return <CodeEditor />;
        case 'analysis':
          return <AnalysisDashboard />;
        case 'metrics':
          return <MetricsDashboard />;
        default:
          return <CodeEditor />;
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">Error loading component. Please refresh the page.</p>
        </div>
      );
    }
  };

  const handleTabClick = (tabId) => {
    try {
      actions.setActiveTab(tabId);
    } catch (error) {
      console.error('Error setting active tab:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white" style={backgroundStyle}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-800/60 rounded-xl p-2 backdrop-blur-sm border border-gray-700">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                  state.activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                aria-label={`Switch to ${tab.label}`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {renderTabContent()}
          </div>
          <div>
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {state.isAnalyzing && <Loading />}
      
      {/* Error Display */}
      {state.error && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 border border-red-700 rounded-lg p-4 max-w-md">
          <p className="text-red-300 text-sm">{state.error}</p>
          <button 
            onClick={() => actions.clearError && actions.clearError()}
            className="mt-2 text-red-400 hover:text-red-300 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;