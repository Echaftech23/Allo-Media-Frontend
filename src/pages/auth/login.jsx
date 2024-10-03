import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/shared/input";
import Button from "../../components/shared/button";
import {
  validateField,
  validateForm,
  ERROR_MESSAGES,
} from "../../utils/validation";
import { Alert, AlertDescription } from "../../components/shared/alert";
import axiosInstance from "../../api/config/axios";

const Login = () => {
  const navigate = useNavigate();
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
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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
    console.log("Form Errors:", formErrors);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTouchedFields({
        email: true,
        password: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", formData);
    
      if (response.status === 200 && response.data.success) {
        if (response.data.otpToken) {
          setAlert({
            variant: "success",
            message: response.data.success,
          });
          navigate("/otp-verification", { state: { otpToken: response.data.otpToken } });
        } else if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          setAlert({
            variant: "success",
            message: response.data.success,
          });
          setLoginAttempts(0);
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }
      } else {
        setAlert({
          variant: "destructive",
          message: response.data.error || ERROR_MESSAGES.generic,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginAttempts((prev) => prev + 1);
    
      setAlert({
        variant: "destructive",
        message:
          loginAttempts >= 4
            ? ERROR_MESSAGES.tooManyAttempts
            : error.response?.data?.error || ERROR_MESSAGES.generic,
      });
    
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back! Please enter your details
          </p>
        </div>

        {alert.message && (
          <Alert variant={alert.variant}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touchedFields.email ? errors.email : ""}
              required
              autoFocus
            />

            <Input
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touchedFields.password ? errors.password : ""}
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;