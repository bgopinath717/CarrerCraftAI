import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    storageService.initialize();
    const existingUser = storageService.getUser();
    if (existingUser) {
      setUser(existingUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const loginDemoUser = () => {
    const demoUser = {
      id: "usr-gopinath-1",
      name: "B. Gopinath",
      email: "gopinath.mern@example.com",
      role: "MERN Stack Developer"
    };
    storageService.setUser(demoUser);
    storageService.setToken("demo-jwt-token-gopinath");
    setUser(demoUser);
    setIsAuthenticated(true);
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await apiService.register(name, email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storageService.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      loginDemoUser,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      loading: false,
      isAuthenticated: false,
      login: async () => {},
      loginDemoUser: () => {},
      register: async () => {},
      logout: () => {}
    };
  }
  return context;
};
