import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';
import { Alert, AlertDescription } from "../../components/shared/alert";
import Button from "../../components/shared/button";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [formData, setFormData] = useState({ email: '' });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const result = await forgotPassword(formData.email);
      if (result.success) {
        setAlert({ variant: "success", message: result.success });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setAlert({ variant: "destructive", message: error.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to reset your password
          </p>
        </div>

        {alert && (
          <Alert variant={alert.variant}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleForgotPassword} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;