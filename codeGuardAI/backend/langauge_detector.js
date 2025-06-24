class ProgrammingLanguageDetector {
    constructor() {
        // Common file extensions mapping
        this.extensionMap = {
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.py': 'python',
            '.java': 'java',
            '.c': 'c',
            '.cpp': 'cpp',
            '.cxx': 'cpp',
            '.cc': 'cpp',
            '.h': 'c',
            '.hpp': 'cpp',
            '.cs': 'csharp',
            '.php': 'php',
            '.rb': 'ruby',
            '.go': 'go',
            '.rs': 'rust',
            '.kt': 'kotlin',
            '.swift': 'swift',
            '.r': 'r',
            '.sql': 'sql',
            '.html': 'html',
            '.css': 'css',
            '.scss': 'scss',
            '.sass': 'sass',
            '.xml': 'xml',
            '.json': 'json',
            '.yaml': 'yaml',
            '.yml': 'yaml'
        };

        // Language-specific keywords and patterns
        this.languageSignatures = {
            javascript: {
                keywords: ['function', 'var', 'let', 'const', 'typeof', 'undefined', 'null', 'true', 'false'],
                patterns: [
                    /function\s+\w+\s*\(/,
                    /const\s+\w+\s*=/,
                    /let\s+\w+\s*=/,
                    /var\s+\w+\s*=/,
                    /=>\s*{/,
                    /console\.log/,
                    /document\./,
                    /window\./
                ],
                unique: ['===', '!==', 'typeof', 'undefined']
            },
            python: {
                keywords: ['def', 'class', 'import', 'from', 'if', 'elif', 'else', 'for', 'while', 'try', 'except'],
                patterns: [
                    /def\s+\w+\s*\(/,
                    /class\s+\w+\s*:/,
                    /import\s+\w+/,
                    /from\s+\w+\s+import/,
                    /if\s+__name__\s*==\s*['"']__main__['"']/,
                    /print\s*\(/
                ],
                unique: ['elif', 'def ', '__init__', '__name__', 'import ']
            },
            java: {
                keywords: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements'],
                patterns: [
                    /public\s+class\s+\w+/,
                    /public\s+static\s+void\s+main/,
                    /System\.out\.println/,
                    /\w+\s+\w+\s*=\s*new\s+\w+\s*\(/,
                    /@\w+/
                ],
                unique: ['System.out.', 'public static void main', 'extends ', 'implements ']
            },
            c: {
                keywords: ['#include', 'int', 'char', 'float', 'double', 'void', 'struct', 'typedef'],
                patterns: [
                    /#include\s*<[^>]+>/,
                    /int\s+main\s*\(/,
                    /printf\s*\(/,
                    /scanf\s*\(/,
                    /\w+\s*\*\s*\w+/
                ],
                unique: ['#include', 'printf(', 'scanf(', 'int main(']
            },
            cpp: {
                keywords: ['#include', 'namespace', 'using', 'class', 'public:', 'private:', 'protected:'],
                patterns: [
                    /#include\s*<iostream>/,
                    /using\s+namespace\s+std/,
                    /std::/,
                    /cout\s*<</, 
                    /cin\s*>>/,
                    /class\s+\w+\s*{/
                ],
                unique: ['std::', 'cout <<', 'cin >>', 'using namespace', '#include <iostream>']
            },
            csharp: {
                keywords: ['using', 'namespace', 'class', 'public', 'private', 'static', 'void'],
                patterns: [
                    /using\s+System/,
                    /namespace\s+\w+/,
                    /Console\.WriteLine/,
                    /public\s+static\s+void\s+Main/,
                    /\[.*\]/
                ],
                unique: ['Console.WriteLine', 'using System', 'namespace ']
            },
            php: {
                keywords: ['<?php', 'function', 'class', 'public', 'private', 'protected'],
                patterns: [
                    /<\?php/,
                    /\$\w+/,
                    /echo\s+/,
                    /function\s+\w+\s*\(/,
                    /->\w+/
                ],
                unique: ['<?php', 
            , 'echo ', '->']
            },
            go: {
                keywords: ['package', 'import', 'func', 'var', 'const', 'type', 'struct'],
                patterns: [
                    /package\s+main/,
                    /import\s*\(/,
                    /func\s+\w+\s*\(/,
                    /fmt\.Print/,
                    /:=/
                ],
                unique: ['package ', 'func ', 'fmt.', ':=']
            },
            rust: {
                keywords: ['fn', 'let', 'mut', 'struct', 'enum', 'impl', 'trait'],
                patterns: [
                    /fn\s+\w+\s*\(/,
                    /let\s+mut\s+/,
                    /println!\s*\(/,
                    /::\w+/,
                    /&\w+/
                ],
                unique: ['fn ', 'let mut', 'println!', '::']
            },
            ruby: {
                keywords: ['def', 'class', 'module', 'end', 'if', 'else', 'elsif'],
                patterns: [
                    /def\s+\w+/,
                    /class\s+\w+/,
                    /puts\s+/,
                    /@\w+/,
                    /\w+\.each\s+do/
                ],
                unique: ['def ', 'puts ', 'end', 'elsif']
            },
            sql: {
                keywords: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER'],
                patterns: [
                    /SELECT\s+.*\s+FROM/i,
                    /INSERT\s+INTO/i,
                    /UPDATE\s+.*\s+SET/i,
                    /DELETE\s+FROM/i,
                    /CREATE\s+TABLE/i
                ],
                unique: ['SELECT ', 'FROM ', 'WHERE ', 'INSERT INTO']
            }
        };
    }

    detectLanguage(code, filename = '') {
        // First, try to detect by file extension
        if (filename) {
            const ext = this.getFileExtension(filename);
            if (this.extensionMap[ext]) {
                return {
                    language: this.extensionMap[ext],
                    confidence: 0.9,
                    method: 'file_extension'
                };
            }
        }

        // If no filename or unknown extension, analyze code content
        return this.detectByContent(code);
    }

    detectByContent(code) {
        const scores = {};
        const codeNormalized = code.toLowerCase();

        // Score each language based on patterns and keywords
        for (const [language, signature] of Object.entries(this.languageSignatures)) {
            let score = 0;

            // Check unique identifiers (high weight)
            signature.unique.forEach(unique => {
                if (codeNormalized.includes(unique.toLowerCase())) {
                    score += 10;
                }
            });

            // Check patterns (medium weight)
            signature.patterns.forEach(pattern => {
                if (pattern.test(code)) {
                    score += 5;
                }
            });

            // Check keywords (low weight)
            signature.keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
                const matches = codeNormalized.match(regex);
                if (matches) {
                    score += matches.length * 1;
                }
            });

            scores[language] = score;
        }

        // Find the language with highest score
        const detectedLanguage = Object.entries(scores)
            .filter(([, score]) => score > 0)
            .sort(([, a], [, b]) => b - a)[0];

        if (!detectedLanguage) {
            return {
                language: 'text',
                confidence: 0.1,
                method: 'fallback'
            };
        }

        const [language, score] = detectedLanguage;
        const maxPossibleScore = this.languageSignatures[language].unique.length * 10 + 
                                this.languageSignatures[language].patterns.length * 5;
        const confidence = Math.min(score / maxPossibleScore, 1.0);

        return {
            language,
            confidence: Math.round(confidence * 100) / 100,
            method: 'content_analysis',
            allScores: scores
        };
    }

    getFileExtension(filename) {
        const lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
    }

    getSupportedLanguages() {
        return [...new Set(Object.values(this.extensionMap))];
    }
}

