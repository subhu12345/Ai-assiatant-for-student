import React, { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { UserProfile, ViewMode } from '../types';

interface LoginViewProps {
  onNavigate: (view: ViewMode) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both your student email and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Look up existing or auto-register mock user
      const existingUsers: UserProfile[] = JSON.parse(localStorage.getItem('student_ai_users') || '[]');
      let user = existingUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

      if (!user) {
        // Create demo account automatically if not found
        user = {
          uid: 'usr_' + Math.random().toString(36).substring(2, 11),
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          email: email.trim().toLowerCase(),
          created_at: new Date().toISOString(),
        };
        existingUsers.push(user);
        localStorage.setItem('student_ai_users', JSON.stringify(existingUsers));
      }

      localStorage.setItem('student_ai_current_user', JSON.stringify(user));
      setLoading(false);
      onLoginSuccess(user);
    }, 500);
  };

  return (
    <div id="login-view" className="max-w-md mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 font-bold">
            <LogIn className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Login</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your AI Tutor dashboard and saved conversation records
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Student Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition bg-slate-50/50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="submit-login-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <span>Verifying with Firebase...</span> : <span>Log In to AI Tutor</span>}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Need to create a new student account?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
              >
                Register Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
