export const REGEX = {
  EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
  NAME: /^[a-zA-Z\u00C0-\u017F]{2,30}(([',. -][a-zA-Z\u00C0-\u017F ])?[a-zA-Z\u00C0-\u017F]*)*$/,
  PHONE: /^\+?[\d\s-]{10,}$/
};

export const ERROR_MESSAGES = {
  required: field => `${field} is required`,
  email: 'Please enter a valid email address',
  password: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
  passwordMatch: 'Passwords do not match',
  name: "Name must be 2-30 characters long and can only contain letters, spaces, and certain special characters (',.-)",
  phone: 'Please enter a valid phone number',
  invalidCredentials: 'Invalid email or password',
  accountLocked: 'Your account has been locked. Please reset your password',
  tooManyAttempts: 'Too many failed attempts. Please try again later',
  generic: 'Something went wrong. Please try again later'
};

export const validateField = (name, value, formData = {}) => {
  if (!value && name !== 'phone') return ERROR_MESSAGES.required(name);

  switch (name) {
    case 'email':
      if (!REGEX.EMAIL.test(value)) return ERROR_MESSAGES.email;
      break;

    case 'password':
      if (!REGEX.PASSWORD.test(value)) return ERROR_MESSAGES.password;
      break;

    case 'confirmPassword':
      if (value !== formData.password) return ERROR_MESSAGES.passwordMatch;
      break;

    case 'name':
      if (!REGEX.NAME.test(value)) return ERROR_MESSAGES.name;
      break;

    case 'phone':
      if (value && !REGEX.PHONE.test(value)) return ERROR_MESSAGES.phone;
      break;

    default:
      break;
  }

  return '';
};

export const validateForm = (formData) => {
  const errors = {};
  Object.keys(formData).forEach(key => {
    const error = validateField(key, formData[key], formData);
    if (error) errors[key] = error;
  });
  return errors;
};