import React from "react";
import { Routes, Route } from "react-router-dom";

import Register from "../pages/auth/register";
import Login from "../pages/auth/login";
import OtpVerification from "../pages/auth/otp-verification";

const Router = () => {
  return (
    <Routes>
      {/*Auth Routes */}
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="otp-verification" element={<OtpVerification />} />
    </Routes>
  );
};

export default Router;
