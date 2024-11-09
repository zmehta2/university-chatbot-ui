import React, { useState } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import { authApi } from '../services/authApi.js'; 

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        const newUser = await authApi.signup(formData);
        // After successful signup, automatically log in
        const authResponse = await authApi.signup(formData.username, formData.password);
        onLogin({
          ...newUser,
          token: authResponse.token
        });
      } else {
        const authResponse = await authApi.login(formData.username, formData.password);
        onLogin({
          username: formData.username,
          token: authResponse.token
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            University FAQ Chatbot
          </h2>
          <h3 className="text-xl font-semibold text-center mb-6">
            {isSignup ? 'Create Account' : 'Login'}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                  required />
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email"
                    required />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  required />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Please wait...
                </span>
              ) : (
                isSignup ? 'Sign Up' : 'Login'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
                setFormData({ username: '', password: '', email: '' });
              } }
              className="text-blue-500 hover:underline"
            >
              {isSignup
                ? 'Already have an account? Login'
                : 'Don\'t have an account? Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;