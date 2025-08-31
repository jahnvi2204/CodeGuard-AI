import { useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { codeAnalysisService } from '../../services/CodeAnalysisService';

const LanguageDetector = () => {
  const { state, actions } = useAppContext();
  const debounceRef = useRef();

  useEffect(() => {
    if (!state.code || state.code.trim().length === 0) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await codeAnalysisService.detectLanguage(state.code);
        if (res?.success && res.data?.language) {
          actions.setLanguage(res.data.language);
        }
      } catch (e) {
        // ignore detection errors
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.code]);

  return null;
};

export default LanguageDetector; 