import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Eye, EyeOff, ArrowRight, X, Sparkles } from 'lucide-react';
import { INITIAL_USER } from '../../data/initialData';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    setIsLoggedIn, 
    setCurrentUser, 
    setCurrentPage, 
    showToast 
  } = useApp();

  const [email, setEmail] = useState('alex.vance@socialflow.io');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('Alex Vance');
  const [rememberMe, setRememberMe] = useState(true);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authModalMode === 'forgot') {
      showToast(`Password reset link sent to ${email}`);
      setAuthModalMode('login');
      return;
    }

    // Sign in or Register
    setCurrentUser({
      ...INITIAL_USER,
      email: email || INITIAL_USER.email,
      name: name || INITIAL_USER.name
    });
    setIsLoggedIn(true);
    setAuthModalOpen(false);
    setCurrentPage('dashboard');
    showToast(`Welcome back, ${name || 'Alex'}!`);
  };

  const handleDemoLogin = (role: 'Admin' | 'Customer') => {
    setCurrentUser({
      ...INITIAL_USER,
      role: role,
      name: role === 'Admin' ? 'Alex Vance (Admin)' : 'Alex Vance (Customer)'
    });
    setIsLoggedIn(true);
    setAuthModalOpen(false);
    setCurrentPage(role === 'Admin' ? 'admin' : 'dashboard');
    showToast(`Signed in as ${role} account`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon (Reference 4 center emblem) */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 text-white flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Zap className="w-6 h-6 fill-white text-white" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {authModalMode === 'login' && 'Welcome back'}
            {authModalMode === 'register' && 'Create an account'}
            {authModalMode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authModalMode === 'login' && 'Sign in to your SocialFlow Panel account'}
            {authModalMode === 'register' && 'Start scaling your social media engagement today'}
            {authModalMode === 'forgot' && "Enter your email to receive recovery instructions"}
          </p>
        </div>

        {/* Quick Demo Fillers */}
        <div className="mb-5 p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl">
          <div className="text-[11px] font-semibold text-emerald-950 flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant Demo Sign-in</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('Customer')}
              className="py-1 px-2 bg-white hover:bg-emerald-50 text-[11px] font-bold text-emerald-700 rounded-lg border border-emerald-200 transition-colors shadow-2xs"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('Admin')}
              className="py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-[11px] font-bold text-white rounded-lg transition-colors shadow-2xs"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Vance"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
          </div>

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('forgot')}
                    className="text-xs text-emerald-600 hover:text-emerald-800 font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {authModalMode === 'login' && (
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-xs text-slate-600">
                Remember me
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>
              {authModalMode === 'login' && 'Sign in'}
              {authModalMode === 'register' && 'Create Account'}
              {authModalMode === 'forgot' && 'Send Reset Link'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {authModalMode !== 'forgot' && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-400 font-medium">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('Customer')}
                className="py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span className="font-bold text-red-500">G</span> Google
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('Customer')}
                className="py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span className="font-bold text-slate-900">🐙</span> GitHub
              </button>
            </div>
          </>
        )}

        <div className="text-center mt-6 text-xs text-slate-500">
          {authModalMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthModalMode('register')}
                className="text-emerald-600 font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setAuthModalMode('login')}
                className="text-emerald-600 font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
