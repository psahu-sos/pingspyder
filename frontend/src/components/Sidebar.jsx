import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Users } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import { useAuth } from '../lib/AuthContext';
import sosLogo from '../assets/logo-sos.png'; 

const Sidebar = () => {
  const { primaryColor, isDarkMode } = useTheme();
  const { authUser } = useAuth();

  return (
    <aside className={`w-[260px] h-full flex flex-col border-r transition-colors z-20 shrink-0 ${isDarkMode ? 'bg-[#18181B] border-slate-800' : 'bg-white border-slate-100'}`}>
      
      <div className={`h-20 flex items-center px-6 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-md overflow-hidden bg-white border-2" style={{ borderColor: primaryColor }}>
          <img src={sosLogo} alt="Logo" className="w-7 h-7 object-contain" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className={`text-xl font-black tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            PingSpyder <span style={{ color: primaryColor }}></span>
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
            NOC Intelligence
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Command Center</p>
        </div>

        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all ${isActive ? 'shadow-md' : isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}
          style={({ isActive }) => isActive ? { backgroundColor: primaryColor, color: '#fff' } : {}}
        >
          <LayoutDashboard className="w-4 h-4" /> Live Dashboard
        </NavLink>

        <NavLink 
          to="/analytics" 
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all ${isActive ? 'shadow-md' : isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}
          style={({ isActive }) => isActive ? { backgroundColor: primaryColor, color: '#fff' } : {}}
        >
          <Activity className="w-4 h-4" /> Signal Analytics
        </NavLink>

        {authUser?.role === 'ADMIN' && (
          <>
            <div className="px-3 mt-8 mb-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Administration</p>
            </div>
            <NavLink 
              to="/user-management" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all ${isActive ? 'shadow-md' : isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}
              style={({ isActive }) => isActive ? { backgroundColor: primaryColor, color: '#fff' } : {}}
            >
              <Users className="w-4 h-4" /> User Management
            </NavLink>
          </>
        )}
      </nav>

      <div className={`p-6 border-t mt-auto ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>System Online</span>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;