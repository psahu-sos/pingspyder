import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShieldCheck, UserPlus, Mail, Lock, User, 
  RefreshCcw, AlertCircle, CheckCircle2, Loader2, Info, X, Trash2, KeyRound, Edit 
} from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

const UserManagement = () => {
  // === CONTEXT & HOOKS ===
  const { isDarkMode, primaryColor } = useTheme();

  // === MOCK DATA FOR LIST ===
  const mockUsers = [
    { id: 'usr_001', name: 'Aman Sharma', email: 'aman.s@netscope.pro', role: 'NOC Operator', initials: 'AS', status: 'Active', joined: '12 May 2026' },
    { id: 'usr_002', name: 'Riya Patel', email: 'riya.p@netscope.pro', role: 'Super Admin', initials: 'RP', status: 'Active', joined: '01 May 2026' },
    { id: 'usr_003', name: 'Karan Singh', email: 'karan.s@netscope.pro', role: 'NOC Operator', initials: 'KS', status: 'Offline', joined: '14 May 2026' }
  ];

  // === LOCAL STATE ===
  const initialFormState = { fullName: '', email: '', role: 'USER', password: '', confirmPassword: '' };
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  // State for Profile Modal
  const [selectedProfile, setSelectedProfile] = useState(null);

  // === EVENT HANDLERS ===
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback(null);
    if (formData.password !== formData.confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match. Please verify.' });
      return;
    }
    if (formData.password.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback({ type: 'success', message: `Account for ${formData.fullName} successfully provisioned (Local State).` });
    }, 1500);
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setFeedback(null);
  };

  const handleAction = (actionType) => {
    alert(`Backend Action Triggered: ${actionType} for ${selectedProfile.name}`);
    setSelectedProfile(null);
  };

  // === UI RENDER ===
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 h-full flex flex-col relative">
      
      {/* Page Header */}
      <div className={`p-6 rounded-[24px] border shadow-sm flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="p-3 rounded-2xl shadow-inner" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h2 className={`text-xl font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Access Control Module
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Identity Management & Role Provisioning
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* === LEFT COLUMN: CREATION FORM === */}
        <div className={`lg:col-span-2 rounded-[24px] border shadow-sm flex flex-col overflow-hidden transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
          <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-50 bg-slate-50/30'}`}>
            <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Provision New User</h3>
            <button type="button" onClick={handleReset} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <RefreshCcw className="w-3 h-3" /> Create New User
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 flex-1 flex flex-col">
            {feedback && (
              <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border ${feedback.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                {feedback.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                <p className="text-xs font-black uppercase tracking-wider">{feedback.message}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                <div className={`flex items-center px-4 h-[48px] rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus-within:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus-within:ring-2 focus-within:ring-blue-100'}`}>
                  <User className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} placeholder="e.g. John Doe" className="w-full bg-transparent text-xs font-bold outline-none placeholder:text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">User ID (Email)</label>
                <div className={`flex items-center px-4 h-[48px] rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus-within:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus-within:ring-2 focus-within:ring-blue-100'}`}>
                  <Mail className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="operator@netscope.com" className="w-full bg-transparent text-xs font-bold outline-none placeholder:text-slate-400" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Access Role</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 h-[48px] rounded-2xl border cursor-pointer transition-all ${formData.role === 'USER' ? 'border-transparent text-white' : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`} style={formData.role === 'USER' ? { backgroundColor: primaryColor, boxShadow: `0 4px 14px -4px ${primaryColor}60` } : {}}>
                    <input type="radio" name="role" value="USER" checked={formData.role === 'USER'} onChange={handleInputChange} className="hidden" />
                    <User className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">NOC Operator</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 h-[48px] rounded-2xl border cursor-pointer transition-all ${formData.role === 'ADMIN' ? 'border-transparent text-white' : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`} style={formData.role === 'ADMIN' ? { backgroundColor: primaryColor, boxShadow: `0 4px 14px -4px ${primaryColor}60` } : {}}>
                    <input type="radio" name="role" value="ADMIN" checked={formData.role === 'ADMIN'} onChange={handleInputChange} className="hidden" />
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">Super Admin</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Security Key (Password)</label>
                <div className={`flex items-center px-4 h-[48px] rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus-within:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus-within:ring-2 focus-within:ring-blue-100'}`}>
                  <Lock className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input type="password" name="password" required value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="w-full bg-transparent text-xs font-bold outline-none placeholder:text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Confirm Security Key</label>
                <div className={`flex items-center px-4 h-[48px] rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus-within:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus-within:ring-2 focus-within:ring-blue-100'}`}>
                  <CheckCircle2 className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                  <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" className="w-full bg-transparent text-xs font-bold outline-none placeholder:text-slate-400" />
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 flex items-center justify-end gap-4">
              <button type="button" onClick={handleReset} className={`px-6 h-[48px] rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Clear Form</button>
              <button type="submit" disabled={isSubmitting} className={`px-8 h-[48px] flex items-center justify-center gap-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg ${isSubmitting ? (isDarkMode ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed') : 'text-white hover:opacity-90'}`} style={!isSubmitting ? { backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}40` } : {}}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {isSubmitting ? 'PROVISIONING...' : 'SAVE & PROVISION'}
              </button>
            </div>
          </form>
        </div>

        {/* === RIGHT COLUMN: MOCK RECENT USERS === */}
        <div className="space-y-6">
          <div className={`rounded-[24px] border shadow-sm p-6 transition-colors ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
            <h3 className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              <Info className="w-4 h-4" style={{ color: primaryColor }} /> Security Guidelines
            </h3>
            <ul className={`space-y-3 text-[11px] font-bold leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: primaryColor }}></div> Users created here are granted immediate access to the portal.</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: primaryColor }}></div> Passwords must be strictly alpha-numeric and over 6 characters.</li>
            </ul>
          </div>

          <div className={`rounded-[24px] border shadow-sm transition-colors overflow-hidden ${isDarkMode ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className={`p-5 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-50 bg-slate-50/30'}`}>
               <h3 className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Active Personnel Database</h3>
            </div>
            <div className="p-2">
               {mockUsers.map(user => (
                 <div 
                   key={user.id}
                   onClick={() => setSelectedProfile(user)}
                   className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${isDarkMode ? 'hover:bg-slate-800/80' : 'hover:bg-slate-50'}`}
                 >
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center border text-[10px] font-black ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>{user.initials}</div>
                   <div>
                     <p className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{user.name}</p>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{user.role}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* === CONTEXTUAL PROFILE MODAL (REACT PORTAL) === */}
      {selectedProfile && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-md flex flex-col rounded-3xl overflow-hidden shadow-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            
            {/* Modal Header */}
            <div className="relative h-24" style={{ backgroundColor: `${primaryColor}20` }}>
              <button onClick={() => setSelectedProfile(null)} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="px-8 pb-8 pt-0 relative flex flex-col items-center text-center">
              <div className={`w-20 h-20 -mt-10 rounded-2xl flex items-center justify-center text-2xl font-black border-4 shadow-lg mb-4 ${isDarkMode ? 'bg-slate-800 border-slate-900 text-white' : 'bg-slate-100 border-white text-slate-800'}`}>
                {selectedProfile.initials}
              </div>
              <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProfile.name}</h2>
              <p className="text-[11px] font-bold text-slate-500 lowercase mt-1">{selectedProfile.email}</p>
              
              <div className="flex items-center gap-2 mt-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border dark:border-slate-700`}>
                  {selectedProfile.role}
                </span>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${selectedProfile.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                  {selectedProfile.status}
                </span>
              </div>

              <div className={`w-full p-4 rounded-2xl flex justify-between items-center text-left mb-6 border ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50/50 border-slate-100'}`}>
                 <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account ID</p>
                   <p className={`text-xs font-bold mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{selectedProfile.id}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date Joined</p>
                   <p className={`text-xs font-bold mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{selectedProfile.joined}</p>
                 </div>
              </div>

              {/* Admin Actions */}
              <div className="w-full space-y-2">
                <button onClick={() => handleAction('Update Role')} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all ${isDarkMode ? 'border-slate-700 text-blue-400 hover:bg-slate-800' : 'border-slate-200 text-blue-600 hover:bg-blue-50'}`}>
                  <Edit className="w-4 h-4" /> Edit Profile Details
                </button>
                <button onClick={() => handleAction('Reset Password')} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all ${isDarkMode ? 'border-slate-700 text-amber-500 hover:bg-slate-800' : 'border-slate-200 text-amber-600 hover:bg-amber-50'}`}>
                  <KeyRound className="w-4 h-4" /> Force Password Reset
                </button>
                <button onClick={() => handleAction('Delete Account')} className={`w-full flex items-center gap-3 p-3 rounded-xl border border-transparent text-xs font-bold transition-all bg-red-500/10 text-red-500 hover:bg-red-500/20`}>
                  <Trash2 className="w-4 h-4" /> Revoke Account Access
                </button>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default UserManagement;