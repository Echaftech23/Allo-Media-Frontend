import React from "react";
import { Routes, Route } from "react-router-dom";

import Register from "../pages/auth/register";
import Login from "../pages/auth/login";
import OtpVerification from "../pages/auth/otp-verification";
import ForgotPassword from "../pages/auth/forgot-password";
import ResetPassword from "../pages/auth/reset-password";
import NotFound from "../pages/errors/404-error";

import ProtectedRoute from '../components/auth/ProtectedRoute';
import RoleSelection from "../components/auth/RoleSelection";
import PublicRoute from "../components/auth/PublicRoute";
import Dashboard from "../pages/manager";

const Router = () => {
  return (
    <Routes>
      {/*Auth Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/role-selection" element={<PublicRoute><RoleSelection /></PublicRoute>} />
      <Route path="/otp-verification" element={<PublicRoute><OtpVerification /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;