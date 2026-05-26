import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem('authUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        return { success: false, message: "Invalid Credentials" };
      }

      const data = await res.json();

      const userData = {
        name: data.username,
        role: data.role,
        email: data.username
      };

      setAuthUser(userData);
      setToken(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("authUser", JSON.stringify(userData));

      return { success: true, role: data.role };
    } catch (err) {
      console.error("Login Error:", err);
      return { success: false, message: "Server connection failed" };
    }
  };

  const logout = async () => {
    try {
      const t = localStorage.getItem("token");
      if (t) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${t}`
          }
        });
      }
    } catch (e) {
      console.error("Logout API failed", e);
    }

    setAuthUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);