import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import SignalAnalytics from './pages/SignalAnalytics';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';

import { NotificationProvider } from './lib/NotificationContext';
import { ThemeProvider, useTheme } from './lib/ThemeContext';
import { DataProvider } from './lib/DataContext'; 
import { AuthProvider, useAuth } from './lib/AuthContext'; 

const AppContent = () => {
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const { isDarkMode } = useTheme(); 
  const { authUser } = useAuth(); 

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 relative ${isDarkMode ? 'bg-[#0F172A]' : 'bg-slate-50'}`}>
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {authUser && <Sidebar />}

      <div className="flex-1 flex flex-col w-full z-10 overflow-hidden">
        {authUser && <Header selectedRoutes={selectedRoutes} setSelectedRoutes={setSelectedRoutes} />} 

        <main className={`flex-1 overflow-y-auto custom-scrollbar ${authUser ? 'p-6 md:p-8' : 'p-0'}`}>
          <Routes>
            <Route path="/login" element={
              !authUser ? <Login /> : <Navigate to="/dashboard" replace />
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'USER']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'USER']}>
                <SignalAnalytics selectedRoutes={selectedRoutes} />
              </ProtectedRoute>
            } />

            <Route path="/user-management" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<Navigate to={authUser ? "/dashboard" : "/login"} replace />} />

            <Route path="*" element={
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <h2 className="text-2xl font-bold uppercase tracking-widest">404 - System Route Not Found</h2>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider> 
        <DataProvider>
          <NotificationProvider>
            <Router>
              <AppContent />
            </Router>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;