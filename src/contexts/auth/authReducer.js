export const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  otpToken: null,
  pendingLoginData: null
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'LOGIN_SUCCESS_PENDING_OTP':
      return {
        ...state,
        isLoading: false,
        error: null,
        otpToken: action.payload.otpToken,
        pendingLoginData: action.payload.loginData
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
        otpToken: null,
        pendingLoginData: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload,
        otpToken: null,
        pendingLoginData: null
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
        otpToken: null,
        pendingLoginData: null
      };
    default:
      return state;
  }
};