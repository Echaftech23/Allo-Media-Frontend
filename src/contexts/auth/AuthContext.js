import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/config/axios';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'No token found' });
      return;
    }

    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await axiosInstance.get('/auth/me');
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      localStorage.removeItem('authToken');
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await axiosInstance.post('/auth/login', credentials);
      
      localStorage.setItem('authToken', response.data.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
      navigate('/dashboard');
      
      return { success: response.data.success };
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.response?.data?.error });
      return { error: error.response?.data?.error };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await axiosInstance.post('/auth/register', userData);
      
      localStorage.setItem('authToken', response.data.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
      
      return { success: response.data.success };
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.response?.data?.error });
      return { error: error.response?.data?.error };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      dispatch({ type: 'LOGOUT' });
      navigate('/');
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout
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