import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../API/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Always try to verify token via API (cookie will be sent automatically)
        const response = await api.get('/auth/verify');
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          // Token invalid or not present
          setUser(null);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        // Token invalid or not present
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    // Token is stored in httpOnly cookie by backend, no need to store in localStorage
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear cookie
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};