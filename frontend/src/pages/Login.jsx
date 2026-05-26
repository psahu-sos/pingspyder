import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, User as UserIcon, Loader2, Server } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useTheme } from '../lib/ThemeContext';

const Login = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { isDarkMode, primaryColor } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(username, password);
    if (res.success) {
      navigate('/dashboard'); 
    } else {
      setError(res.message || 'Unauthorized: Invalid credentials provided.');
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors ${isDarkMode ? 'bg-[#0F172A]' : 'bg-slate-50'}`}>
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <div className={`w-full max-w-md p-8 rounded-[32px] border shadow-2xl relative z-10 backdrop-blur-sm transition-colors ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-100'}`}>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
            <Server className="w-8 h-8" />
          </div>
          <h1 className={`text-2xl font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            PingSpyder
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">NOC Intelligence Portal</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <p className="text-[11px] font-black uppercase tracking-wider">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Operator ID (User ID or Email)</label>
            <div className={`flex items-center px-4 h-[52px] rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus-within:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus-within:ring-2 focus-within:ring-blue-100'}`}>
              <UserIcon className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin123 or admin@pingspyder.com"
                className="w-full bg-transparent text-xs font-bold outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Security Key</label>
            <div className={`flex items-center px-4 h-[52px] rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus-within:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus-within:ring-2 focus-within:ring-blue-100'}`}>
              <Lock className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-xs font-bold outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full h-[52px] mt-4 flex items-center justify-center gap-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
              loading 
                ? (isDarkMode ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed')
                : 'text-white hover:opacity-90'
            }`}
            style={!loading ? { backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}40` } : {}}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            {loading ? 'AUTHENTICATING...' : 'SECURE LOGIN'}
          </button>
        </form>

        <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest mt-8">
          Contact system administrator for access recovery.
        </p>
      </div>
    </div>
  );
};

export default Login;