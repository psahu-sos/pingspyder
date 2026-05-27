import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, Bell, User, Settings, LogOut, ChevronRight, Clock, Calendar, Moon, Sun, ArrowLeft, Check, Activity, LineChart, Users 
} from 'lucide-react'; 
import { useNotifications } from '../lib/NotificationContext';
import { useTheme } from '../lib/ThemeContext';
import { useData } from '../lib/DataContext';
import { useAuth } from '../lib/AuthContext'; 

const Header = () => {
  const location = useLocation(); 
  const isAnalyticsPage = location.pathname === '/analytics';
  const isUserManagementPage = location.pathname === '/user-management'; 
  
  const { notifications, clearNotifications } = useNotifications();
  const { primaryColor, setPrimaryColor, isDarkMode, setIsDarkMode } = useTheme();
  
  // Fetch activeFilters along with networkData and searchQuery
  const { networkData, searchQuery, setSearchQuery, activeFilters } = useData(); 
  const { authUser, logout } = useAuth(); 

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showSettingsView, setShowSettingsView] = useState(false); 
  const [showNotif, setShowNotif] = useState(false);
  const [time, setTime] = useState(new Date());

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // 🔥 FILTER LOGIC ADDED HERE TO SYNC WITH DASHBOARD TABLE 🔥
  const displayedData = useMemo(() => {
    if (!networkData) return [];
    let filtered = networkData;

    if (activeFilters && activeFilters.length > 0) {
      filtered = filtered.filter(node => 
        activeFilters.some(filter => 
          (node.tag && node.tag.toUpperCase() === filter.toUpperCase()) || 
          (node.remarks && node.remarks.toUpperCase().includes(filter.toUpperCase()))
        )
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(node =>
        (node.stretch && node.stretch.toLowerCase().includes(query)) ||
        (node.location && node.location.toLowerCase().includes(query)) ||
        (node.tag && node.tag.toLowerCase().includes(query)) ||
        (node.status && node.status.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [networkData, searchQuery, activeFilters]);

  // Use dynamically filtered data to count offline nodes for the Bell icon
  const offlineNodes = displayedData.filter(n => n.status === 'DOWN' || n.status === 'CRITICAL FAIL' || n.status === 'PARTIAL').length;

  // UI Configuration for Theme Options
  const THEME_COLORS = [
    { name: 'Blue', value: '#0052FF' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Emerald', value: '#10B981' },
    { name: 'Rose', value: '#E11D48' },
    { name: 'Orange', value: '#F59E0B' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setShowSettingsView(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`h-20 border-b transition-colors duration-300 flex items-center justify-between px-8 sticky top-0 z-50 ${isDarkMode ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white/90 border-slate-100 backdrop-blur-md'}`}>
      
      {/* Left Section: Icon & Dynamic Page Title */}
      <div className="flex items-center gap-4 min-w-[220px]">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm border" style={{ backgroundColor: `${primaryColor}15`, borderColor: primaryColor, color: primaryColor }}>
          {isAnalyticsPage ? <LineChart className="w-4 h-4" /> : isUserManagementPage ? <Users className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className={`text-base font-black tracking-tight leading-none uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {isAnalyticsPage ? "Signal History" : isUserManagementPage ? "User Management" : "Live Monitor"}
          </h1>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md font-bold text-[9px] border shadow-sm" style={{ color: primaryColor, backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}40` }}>
              <Clock className="w-3 h-3" />
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[9px] uppercase tracking-wider">
              <Calendar className="w-3 h-3" />
              {time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Center Section: Global Search */}
      <div className="relative flex-1 max-w-xl mx-8">
        {!isUserManagementPage && (
          <>
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-11 pl-12 pr-6 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 transition-all shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-700' : 'bg-slate-50/50 border-slate-100 placeholder-slate-400 focus:bg-white'}`}
              style={{ '--tw-ring-color': primaryColor }}
              placeholder="Global search by Stretch, Tag or Location..."
            />
          </>
        )}
      </div>

      {/* Right Section: Notifications & Profile */}
      <div className="flex items-center gap-6">
        
        {/* Notifications Dropdown (Synced with Search) */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotif(!showNotif)} 
            className={`flex items-center justify-center w-11 h-11 rounded-[14px] border shadow-sm transition-all relative group ${
              offlineNodes > 0 
                ? (isDarkMode ? 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20' : 'bg-red-50 border-red-200 hover:bg-red-100') 
                : (isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50')
            }`}
          >
            <Bell className={`w-5 h-5 transition-transform group-hover:rotate-12 ${offlineNodes > 0 ? 'text-red-500 animate-pulse' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`} />
            
            {offlineNodes > 0 && (
              <span className={`absolute -top-1.5 -right-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-md border-[2px] ${isDarkMode ? 'border-[#1E293B]' : 'border-white'}`}>
                {offlineNodes}
              </span>
            )}
          </button>

          {showNotif && (
            <div className={`absolute right-0 mt-4 w-80 rounded-3xl shadow-2xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-50 bg-slate-50/30'}`}>
                <h3 className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>System Alerts</h3>
                <button onClick={clearNotifications} className="text-[10px] font-bold hover:underline" style={{ color: primaryColor }}>Clear All</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-[11px] font-bold italic">All systems operational. No alerts.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b flex gap-3 transition-all ${isDarkMode ? 'border-slate-700 hover:bg-red-500/10' : 'border-slate-50 hover:bg-red-50/30'}`}>
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                      <div>
                        <p className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{n.message}</p>
                        <p className="text-[9px] text-slate-400 mt-1 font-black uppercase tracking-tighter">{n.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={`h-8 w-px mx-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setShowSettingsView(false); }} 
            className="flex items-center gap-4 p-1.5 pl-3 pr-5 rounded-2xl cursor-pointer transition-all shadow-md active:scale-95 group text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/20">
              <User className="text-white w-5 h-5" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[11px] font-black uppercase tracking-wider leading-none">{authUser?.name || 'Unknown User'}</p>
              <p className="text-[9px] font-bold text-white/80 uppercase tracking-tighter mt-1">{authUser?.role || 'Role'} Access</p>
            </div>
          </button>
          
          {isProfileOpen && (
             <div className={`absolute right-0 mt-4 w-72 rounded-[28px] shadow-2xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100'}`}>
               {!showSettingsView ? (
                 <>
                  <div className={`p-6 pb-4 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50/50'}`}>
                    <h3 className="text-xs font-black uppercase tracking-tight">{authUser?.name || 'Unknown User'}</h3>
                    <p className="text-[10px] font-bold text-slate-400 lowercase mt-0.5">{authUser?.email || 'Email not available'}</p>
                  </div>
                  <div className="p-3 space-y-1">
                    <button onClick={() => setShowSettingsView(true)} className="w-full flex items-center justify-between p-3 text-white rounded-2xl shadow-lg transition-all" style={{ backgroundColor: primaryColor }}>
                      <div className="flex items-center gap-3">
                        <Settings className="w-4 h-4" />
                        <span className="text-xs font-bold">Settings & Appearance</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                    <div className={`h-px my-2 mx-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
                    <button onClick={logout} className={`w-full flex items-center gap-3 p-3 text-red-500 rounded-2xl transition-all group ${isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}>
                      <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      <span className="text-xs font-bold uppercase tracking-wider">Sign Out System</span>
                    </button>
                  </div>
                 </>
               ) : (
                 <div className="p-4">
                   <button onClick={() => setShowSettingsView(false)} className={`flex items-center gap-2 mb-4 text-xs font-bold ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-black'}`}>
                      <ArrowLeft className="w-4 h-4" /> Back
                   </button>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Theme Mode</h4>
                   <div className={`flex p-1 rounded-xl mb-6 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                      <button onClick={() => setIsDarkMode(false)} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${!isDarkMode ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}>
                        <Sun className="w-4 h-4" /> Light
                      </button>
                      <button onClick={() => setIsDarkMode(true)} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400'}`}>
                        <Moon className="w-4 h-4" /> Dark
                      </button>
                   </div>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Accent Color</h4>
                   <div className="flex gap-2 justify-between mb-2">
                     {THEME_COLORS.map(color => (
                       <div key={color.name} onClick={() => setPrimaryColor(color.value)} className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-all hover:scale-110 shadow-md" style={{ backgroundColor: color.value, border: primaryColor === color.value ? '2px solid white' : 'none', outline: primaryColor === color.value ? `2px solid ${color.value}` : 'none' }}>
                         {primaryColor === color.value && <Check className="w-4 h-4 text-white" />}
                       </div>
                     ))}
                   </div>
                 </div>
               )}
             </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;