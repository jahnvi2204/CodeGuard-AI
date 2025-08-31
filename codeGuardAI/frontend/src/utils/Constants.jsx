export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'CodeGuard AI',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.NODE_ENV || 'development',
  buildTime: __BUILD_TIME__ || new Date().toISOString()
};

export const SUPPORTED_LANGUAGES = [
  { value: 'auto', label: 'Auto Detect' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' }
];


export const SAMPLE_CODES = {
  javascript: `// Sample JavaScript code for analysis
function authenticateUser(username, password) {
  // Potential SQL injection vulnerability
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  
  // Potential XSS vulnerability  
  document.getElementById('welcome').innerHTML = "Welcome " + username;
  
  // Performance issue - inefficient loop
  let result = [];
  for(let i = 0; i < 10000; i++) {
    for(let j = 0; j < 1000; j++) {
      result.push(i * j);
    }
  }
  
  return executeQuery(query);
}

// Hardcoded secret
const API_KEY = "sk-12345abcdef";

function processData(data) {
  // Missing error handling
  const parsed = JSON.parse(data);
  return parsed.results;
}`,
  python: `def unsafe_query(user_id):
    # SQL Injection vulnerability
    query = "SELECT * FROM users WHERE id = " + user_id
    return execute_query(query)

def process_data(data):
    # Potential performance issue
    for i in range(len(data)):
        for j in range(len(data)):
            if data[i] == data[j]:
                print("Found match")

# Hardcoded secret
API_KEY = "sk-1234567890abcdef"`,
  java: `public class UserService {
    public User getUser(String userId) {
        // SQL Injection vulnerability
        String query = "SELECT * FROM users WHERE id = " + userId;
        return database.executeQuery(query);
    }
    
    // Hardcoded secret
    private static final String API_KEY = "sk-1234567890abcdef";
}`
};
