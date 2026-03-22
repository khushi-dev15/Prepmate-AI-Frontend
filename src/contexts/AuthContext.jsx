import React, { createContext, useState, useEffect } from 'react';
import api from '../API/api';

const AuthContext = createContext();
export default AuthContext;
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/verify');
        if (response.data.success) {
          setUser(response.data.user);
          return;
        }

        // fallback: try localStorage token header explicitly if backend cookie auth isn't available on mobile
        const localToken = localStorage.getItem('token');
        if (localToken) {
          const fallback = await api.get('/auth/verify', {
            headers: { Authorization: `Bearer ${localToken}` }
          });
          if (fallback.data.success) {
            setUser(fallback.data.user);
            return;
          }
        }

        setUser(null);
      } catch (error) {
        console.error('Token verification failed:', error?.response?.data || error.message || error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    // User token may come as response.token and be saved by auth page
    const responseToken = userData?.token || localStorage.getItem('token');
    if (responseToken) {
      localStorage.setItem('token', responseToken);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear cookie
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
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