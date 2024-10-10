import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../../api/config/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const register = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('auth/register', credentials);
      const data = await response.data;
      setIsLoading(false);
      return { success: data.success };
    } catch (error) {
      setIsLoading(false);
      return { error: error.response.data.error };
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('auth/login', credentials);
      const data = await response.data;    
      
      if(data.require2FA) localStorage.setItem('authToken', data.otpToken);
      else{
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); 
        setUser(response.data.user);       
      }

      setIsLoading(false);
      return { data, success: data.success };
    } catch (error) {
      console.log('error', error); 
      setIsLoading(false);
      const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
      return { error: errorMessage };
    }
  };

  const logout = async () => {
    try {      
      await axiosInstance.get('auth/logout');
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  const verifyOTP = async (otp) => {
    try {
      setIsLoading(true);
      const otpToken = localStorage.getItem('authToken');
      const response = await axiosInstance.post('auth/verify-otp', { otp, otpToken });

      setUser(response.data.user);
      setIsLoading(false);
      return { success: response.data.success };
    } catch (error) {
      setIsLoading(false);
      console.log("error ouccured", error);
      return { error: error.response.data.error };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axiosInstance.post('auth/forgot-password', { email });
      return { success: response.data.success };
    } catch (error) { 
      return { error: error.response?.data?.error || 'An error occurred' };
    }
  };

    const resetPassword = async (token, formData) => {
    try {
      const response = await axiosInstance.post(`auth/reset-password/${token}`, formData);
      return { success: response.data.success };
    } catch (error) {
      return { error: error.response?.data?.error || 'An error occurred' };
    }
  };

  const verifyResetToken = async (token) => {
    try {
      const response = await axiosInstance.get(`auth/reset-password/verify?token=${token}`);
      const data = await response.data;
      localStorage.setItem('resetToken', data.token);
      return true;
    } catch (error) {
      return false;
    }
  };

  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
    verifyOTP,
    forgotPassword,
    resetPassword,
    verifyResetToken,
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