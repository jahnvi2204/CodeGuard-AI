const { LANGUAGE_PATTERNS } = require('../utils/constants');

class LanguageDetectionService {
    static detectLanguage(code) {
        if (!code || code.trim().length === 0) {
            return 'unknown';
        }

        const scores = {};
        
        for (const [language, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
            let score = 0;
            for (const pattern of patterns) {
                if (pattern.test(code)) {
                    score++;
                }
            }
            scores[language] = score;
        }

        const maxScore = Math.max(...Object.values(scores));
        if (maxScore === 0) {
            return 'unknown';
        }

        return Object.keys(scores).find(lang => scores[lang] === maxScore) || 'unknown';
    }

    static getConfidence(language) {
        return language === 'unknown' ? 0 : 0.85;
    }
}

module.exports = LanguageDetectionService;