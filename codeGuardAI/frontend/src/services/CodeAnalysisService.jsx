import api from './Api';

export const codeAnalysisService = {
  analyzeCode: async (code, language = null) => {
    try {
      const response = await api.post('/analyze-code', { code, language });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  analyzeVulnerabilities: async (code, language = null) => {
    try {
      const response = await api.post('/analyze-vulnerabilities', { code, language });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  analyzePerformance: async (code, language = null) => {
    try {
      const response = await api.post('/analyze-performance', { code, language });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  getHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  detectLanguage: async (code) => {
    try {
      const response = await api.post('/detect-language', { code });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }
};
