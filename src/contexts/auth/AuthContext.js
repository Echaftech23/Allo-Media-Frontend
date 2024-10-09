import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialState, authReducer } from './authReducer';
import { checkAuthStatus, login, register, logout, verifyOTP } from './authActions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus(dispatch);
  }, []);

  const value = {
    ...state,
    login: (credentials) => login(dispatch, credentials, navigate),
    register: (userData) => register(dispatch, userData),
    logout: () => logout(dispatch, navigate),
    verifyOTP: (otp) => verifyOTP(dispatch, state, otp)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};