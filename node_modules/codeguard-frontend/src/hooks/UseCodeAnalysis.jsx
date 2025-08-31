import { codeAnalysisService } from '../services/codeAnalysisService';
import { useAppContext } from '../context/AppContext';

export const useCodeAnalysis = () => {
  const { state, actions } = useAppContext();

  const analyzeCode = async (analysisType = 'complete') => {
    if (!state.code?.trim()) {
      actions.setError('Please enter some code to analyze');
      return;
    }

    actions.setAnalyzing(true);
    actions.clearError();
    actions.setProgress(0);

    const stages = [
      { message: "Scanning for vulnerabilities...", duration: 800 },
      { message: "Analyzing performance patterns...", duration: 600 },
      { message: "Checking best practices...", duration: 500 },
      { message: "Calculating security score...", duration: 300 }
    ];

    try {
      for (let i = 0; i < stages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, stages[i].duration));
        actions.setProgress(((i + 1) / stages.length) * 100);
      }

      let result;
      const language = state.language === 'auto' ? null : state.language;

      switch (analysisType) {
        case 'vulnerabilities':
          result = await codeAnalysisService.analyzeVulnerabilities(state.code, language);
          break;
        case 'performance':
          result = await codeAnalysisService.analyzePerformance(state.code, language);
          break;
        default:
          result = await codeAnalysisService.analyzeCode(state.code, language);
      }

      actions.setAnalysisResults(result);
      actions.setActiveTab('analysis');
      return result;

    } catch (error) {
      const errorMessage = error.message || 'Analysis failed';
      actions.setError(errorMessage);
      throw error;
    }
  };

  const checkServiceStatus = async () => {
    try {
      const health = await codeAnalysisService.getHealth();
      actions.setServiceStatus({ health });
    } catch (error) {
      console.error('Service status check failed:', error);
    }
  };

  return {
    analyzeCode,
    checkServiceStatus,
    isAnalyzing: state.isAnalyzing,
    results: state.analysisResults,
    error: state.error,
    progress: state.progress
  };
};
