import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

// Try to load the most recent saved project from localStorage
let initialState = {
  code: '',
  language: 'auto',
  analysisResults: null,
  isAnalyzing: false,
  error: null,
  activeTab: 'editor',
  progress: 0,
  serviceStatus: null
};

try {
  const saved = localStorage.getItem('codeguard_projects');
  if (saved) {
    const arr = JSON.parse(saved);
    if (arr.length > 0) {
      initialState = {
        ...initialState,
        code: arr[0].code || initialState.code,
        language: arr[0].language || initialState.language,
        analysisResults: arr[0].analysisResults || null
      };
    }
  }
} catch (e) {}

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CODE':
      return { ...state, code: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_ANALYSIS_RESULTS':
      return { 
        ...state, 
        analysisResults: action.payload,
        isAnalyzing: false,
        error: null
      };
    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload, 
        isAnalyzing: false 
      };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_SERVICE_STATUS':
      return { ...state, serviceStatus: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESET_ANALYSIS':
      return { 
        ...state, 
        analysisResults: null, 
        error: null, 
        isAnalyzing: false,
        progress: 0
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    state,
    dispatch,
    actions: {
      setCode: (code) => dispatch({ type: 'SET_CODE', payload: code }),
      setLanguage: (language) => dispatch({ type: 'SET_LANGUAGE', payload: language }),
      setAnalysisResults: (results) => dispatch({ type: 'SET_ANALYSIS_RESULTS', payload: results }),
      setAnalyzing: (analyzing) => dispatch({ type: 'SET_ANALYZING', payload: analyzing }),
      setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
      setActiveTab: (tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }),
      setProgress: (progress) => dispatch({ type: 'SET_PROGRESS', payload: progress }),
      setServiceStatus: (status) => dispatch({ type: 'SET_SERVICE_STATUS', payload: status }),
      clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
      resetAnalysis: () => dispatch({ type: 'RESET_ANALYSIS' })
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
