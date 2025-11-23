import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Delay để tránh lỗi khi app mới khởi động
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await api.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        api.setToken(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      if (data.token) {
        api.setToken(data.token);
        setUser(data.user);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    window.location.href = '/sign-in';
  };

  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

