import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check existing session on application launch
  useEffect(() => {
    storageService.initialize();
    const token = storageService.getToken();
    const savedUser = storageService.getUser();

    if (token) {
      if (savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }
      // Re-verify session with backend
      apiService
        .getMe()
        .then((res) => {
          if (res?.success && res?.user) {
            setUser(res.user);
            setIsAuthenticated(true);
          } else {
            // Invalid session
            storageService.clearAuth();
            setUser(null);
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          // If offline but savedUser exists, keep temporary session
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, rememberMe = true) => {
    setLoading(true);
    try {
      const data = await apiService.login(email, password, rememberMe);
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Network error during login' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await apiService.register(name, email, password);
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Network error during registration' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch {
      // ignore
    } finally {
      storageService.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const forgotPassword = async (email) => {
    return apiService.forgotPassword(email);
  };

  const resetPassword = async (token, newPassword) => {
    return apiService.resetPassword(token, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
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
      register: async () => {},
      logout: () => {},
      forgotPassword: async () => {},
      resetPassword: async () => {},
    };
  }
  return context;
};
