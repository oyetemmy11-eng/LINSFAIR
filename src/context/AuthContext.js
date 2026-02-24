import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = useCallback(async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
  }, []);

  const register = useCallback(async (username, password) => {
    await api.post('/auth/register', { username, password });
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    login,
    register,
    logout
  }), [user, token, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};