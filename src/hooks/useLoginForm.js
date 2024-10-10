import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContext';
import { validateField, validateForm } from '../utils/validation';
import { ERROR_MESSAGES } from '../constants';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
 
  const from = location.state?.from?.pathname || "/";
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [alert, setAlert] = useState({ variant: "", message: "" });

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value}));

      // Clear errors when field value changes
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));

      // Clear alert when user starts typing
      if (alert.message) setAlert({ variant: "", message: "" });
    },
    [errors, alert.message]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouchedFields((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name, value, formData);
      if (error) setErrors((prev) => ({ ...prev, [name]: error}));
    },
    [formData]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTouchedFields({ email: true, password: true });
      return;
    }

    // Check login attempts
    if (loginAttempts >= 5) {
      setAlert({
        variant: "destructive",
        message: ERROR_MESSAGES.tooManyAttempts
      });
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        if (result.data.require2FA) {
          setAlert({ variant: "success", message: result.success });

          setTimeout(() => { 
            navigate("/otp-verification", {
              state: {
                otpToken: result.otpToken,
                email: formData.email
              },
              replace: true // Use replace to prevent going back to login
            });
          }, 1500);

          return;
        }

        setAlert({
          variant: "success",
          message: "Login successful. Redirecting ...",
        });
       
        setLoginAttempts(0);        
        setFormData({ email: "", password: "" });

        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);

      } else throw new Error(result.error);
      
    } catch (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      setAlert({
        variant: "destructive",
        message: newAttempts >= 5 
          ? ERROR_MESSAGES.tooManyAttempts
          : error.message
      });

      setFormData(prev => ({ ...prev, password: "", }));
      setTouchedFields(prev => ({ ...prev, password: true }));
    }
  };

  return {
    formData,
    errors,
    isLoading,
    touchedFields,
    loginAttempts,
    alert,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm: useCallback(() => {
      setFormData({ email: "", password: "" });
      setErrors({});
      setTouchedFields({});
      setAlert({ variant: "", message: "" });
    }, [])
  };
};