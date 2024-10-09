import axiosInstance from '../../api/config/axios';

export const checkAuthStatus = async (dispatch) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.log('No token found');
    dispatch({ type: 'AUTH_FAILURE', payload: 'No token found' });
    return;
  }

  try {
    dispatch({ type: 'AUTH_START' });
    const response = await axiosInstance.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
    console.log('Token verified successfully:', response.data.user);
  } catch (error) {
    console.log('Token verification failed:', error.message);
    dispatch({ type: 'AUTH_FAILURE', payload: error.message });
    localStorage.removeItem('authToken');
  }
};

export const login = async (dispatch, credentials) => {
  try {
    dispatch({ type: 'AUTH_START' });
    const response = await axiosInstance.post('/auth/login', credentials);
    const result = response.data;

    if (result.success) {
      if (result.otpToken) {
        dispatch({
          type: 'LOGIN_SUCCESS_PENDING_OTP',
          payload: {
            otpToken: result.otpToken,
            loginData: result
        }
        });

        return { success: "Please verify your OTP to complete the login process. Redirecting...", requiresOTP: true };
      }

      localStorage.setItem('authToken', result.token);
      dispatch({ type: 'AUTH_SUCCESS', payload: result.user });
      return { success: result.success };
    }

    return { error: 'Login failed' };
  } catch (error) {
    dispatch({ type: 'AUTH_FAILURE', payload: error.response?.data?.error });
    return { error: error.response?.data?.error };
  }
};

export const register = async (dispatch, userData) => {
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

export const logout = async (dispatch, navigate) => {
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

export const verifyOTP = async (dispatch, state, otp) => {
  if (!state.otpToken) {
    return { error: 'Invalid OTP session' };
  }

  try {
    dispatch({ type: 'AUTH_START' });
    
    const response = await axiosInstance.post('/auth/verify-otp', {
      otp,
      otpToken: state.otpToken
    });

    if (response.data.success) {
        console.log('OTP verified successfully:', response.data.user);
      localStorage.setItem('authToken', response.data.token);

      const storedToken = localStorage.getItem('authToken');
      console.log('Stored authToken:', storedToken);

      dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
      
      return { 
        success: true, 
        message: 'OTP verified successfully. Redirecting...'
      };
    }

    return { error: response.data.error || 'OTP verification failed' };
  } catch (error) {
    dispatch({ 
      type: 'AUTH_FAILURE', 
      payload: error.response?.data?.error || 'OTP verification failed' 
    });
    return { 
      error: error.response?.data?.error || 'OTP verification failed'
    };
  }
};