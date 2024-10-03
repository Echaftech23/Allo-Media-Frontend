import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/shared/input";
import Button from "../../components/shared/button";
import { validateField, validateForm } from "../../utils/validation";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value, formData);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTouchedFields(Object.keys(formData).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {}));
      return;
    }

    setIsLoading(true);
    try {
      // Your API call here
      console.log("Registration submitted:", formData);
      
      // Example API call:
      // await registerUser(formData);
      // navigate("/login");
      
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors(prev => ({
        ...prev,
        submit: "Registration failed. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touchedFields.name ? errors.name : ""}
              required
            />

            <Input
              type="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touchedFields.email ? errors.email : ""}
              required
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

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touchedFields.confirmPassword ? errors.confirmPassword : ""}
              required
            />

            <Input
              type="tel"
              name="phone"
              label="Phone Number (optional)"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touchedFields.phone ? errors.phone : ""}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            // disabled={Object.keys(errors).length > 0}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;