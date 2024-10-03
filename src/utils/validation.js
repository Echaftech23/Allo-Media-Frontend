export const REGEX = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
  NAME: /^[a-zA-Z\s]{4,30}$/,
  PHONE: /^\+?[\d\s-]{10,}$/
};

export const ERROR_MESSAGES = {
  required: field => `${field} is required`,
  email: 'Please enter a valid email address',
  password: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
  passwordMatch: 'Passwords do not match',
  name: 'Name must be 2-30 characters long and can only contain letters',
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