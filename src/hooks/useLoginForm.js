import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContext';
import { validateField, validateForm } from '../utils/validation';
import { ERROR_MESSAGES } from '../constants';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",

  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [alert, setAlert] = useState({ variant: "", message: "" });

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouchedFields((prev) => ({
        ...prev,
        [name]: true,
      }));

      const error = validateField(name, value, formData);
      if (error) {
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [formData]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTouchedFields({
        email: true,
        password: true,
      });
      return;
    }

    if (loginAttempts >= 5) {
      setAlert({
        variant: "destructive",
        message: ERROR_MESSAGES.tooManyAttempts
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        if (result.requiresOTP) {
          navigate("/otp-verification", {
            state: { 
              otpToken: result.otpToken,
              email: formData.email
            }
          });
          return;
        }

        setAlert({
          variant: "success",
          message: "Login successful! Redirecting..."
        });
        
        setLoginAttempts(0);
        
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } else {
        throw new Error(result.error || ERROR_MESSAGES.generic);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginAttempts((prev) => prev + 1);

      setAlert({
        variant: "destructive",
        message: loginAttempts >= 4
          ? ERROR_MESSAGES.tooManyAttempts
          : error.message || ERROR_MESSAGES.generic
      });

      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    } finally {
      setIsLoading(false);
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
    handleSubmit
  };
};