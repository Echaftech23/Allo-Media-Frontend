import React from "react";
import { Routes, Route } from "react-router-dom";

import Register from "../pages/auth/register";
import Login from "../pages/auth/login";
import OtpVerification from "../pages/auth/otp-verification";
import Dashboard from "../pages/manager";
import NotFound from "../pages/errors/404-error";

const Router = () => {
  return (
    <Routes>
      {/*Auth Routes */}
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="otp-verification" element={<OtpVerification />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
