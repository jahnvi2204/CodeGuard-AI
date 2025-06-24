import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Github, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Chrome,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Zap,
  LogOut
} from 'lucide-react';

// Firebase configuration will be fetched from backend
let firebaseConfig = null;
let auth = null;
let googleProvider = null;
let githubProvider = null;

const FirebaseAuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  // Initialize Firebase
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Fetch Firebase config from backend
        const response = await fetch('http://localhost:5000/api/firebase-config');
        const config = await response.json();
        
        // Dynamically import Firebase modules
        const { initializeApp } = await import('firebase/app');
        const { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, onAuthStateChanged, signOut } = await import('firebase/auth');
        
        // Initialize Firebase
        const app = initializeApp(config);
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
        githubProvider = new GithubAuthProvider();
        
        // Add scopes for additional user info
        googleProvider.addScope('profile');
        googleProvider.addScope('email');
        githubProvider.addScope('user:email');
        
        // Set up auth state listener
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // Get Firebase ID token
            const idToken = await firebaseUser.getIdToken();
            
            // Store token for API requests
            localStorage.setItem('firebaseToken', idToken);
            
            // Get user profile from backend
            try {
              const userResponse = await fetch('http://localhost:5000/api/auth/me', {
                headers: {
                  'Authorization': `Bearer ${idToken}`
                }
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                setUser(userData);
              }
            } catch (err) {
              console.error('Error fetching user data:', err);
            }
          } else {
            setUser(null);
            localStorage.removeItem('firebaseToken');
          }
        });
        
        setFirebaseInitialized(true);
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setError('Failed to initialize authentication');
      }
    };

    initializeFirebase();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleTraditionalAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setSuccess(`${isLogin ? 'Login' : 'Registration'} successful!`);
        setUser(data.user);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseAuth = async (provider) => {
    if (!firebaseInitialized || !auth) {
      setError('Authentication not initialized');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { signInWithPopup } = await import('firebase/auth');
      
      let authProvider;
      if (provider === 'google') {
        authProvider = googleProvider;
      } else if (provider === 'github') {
        authProvider = githubProvider;
      }

      const result = await signInWithPopup(auth, authProvider);
      const idToken = await result.user.getIdToken();
      
      // Store token for API requests
      localStorage.setItem('firebaseToken', idToken);
      
      setSuccess('Successfully signed in!');
    } catch (error) {
      console.error('Firebase auth error:', error);
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (auth) {
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
      }
      
      // Clear all tokens
      localStorage.removeItem('firebaseToken');
      localStorage.removeItem('authToken');
      
      setUser(null);
      setSuccess('Successfully signed out');
    } catch (error) {
      setError('Error signing out');
    }
  };

  // If user is logged in, show dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 p-8">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to CodeGuard AI</h1>
              <p className="text-gray-400">You are successfully authenticated!</p>
            </div>

            {/* User Info */}
            <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-white font-semibold">
                    {user.displayName || user.username}
                  </h3>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Auth Provider:</span>
                  <span className="text-white capitalize">{user.authProvider || 'Local'}</span>
                </div>
                {user.emailVerified !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email Verified:</span>
                    <span className={`${user.emailVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                      {user.emailVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
                {user.security?.lastLogin && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Login:</span>
                    <span className="text-white">
                      {new Date(user.security.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-green-300 text-sm">{success}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                <Shield className="w-5 h-5" />
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-400">
              {isLogin ? 'Sign in to CodeGuard AI' : 'Join CodeGuard AI today'}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-green-300 text-sm">{success}</span>
            </div>
          )}

          {/* Firebase Auth Buttons */}
          {firebaseInitialized && (
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleFirebaseAuth('google')}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 p-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                <Chrome className="w-5 h-5" />
                <span className="font-medium">Continue with Google</span>
              </button>

              <button
                onClick={() => handleFirebaseAuth('github')}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                <Github className="w-5 h-5" />
                <span className="font-medium">Continue with GitHub</span>
              </button>
            </div>
          )}

          {/* Loading state for Firebase initialization */}
          {!firebaseInitialized && (
            <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-300 text-sm">Initializing authentication...</span>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with email</span>
            </div>
          </div>

          {/* Traditional Form */}
          <form onSubmit={handleTraditionalAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your username"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Form */}
          <div className="mt-6 text-center">
            <span className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Security Analysis</p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Performance Insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseAuthComponent;