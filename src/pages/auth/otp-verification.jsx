import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../components/shared/input";
import Button from "../../components/shared/button";
import { Alert, AlertDescription } from "../../components/shared/alert";
import axiosInstance from "../../api/config/axios";

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { otpToken } = location.state || {};
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        otp,
        otpToken,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "Invalid OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the OTP sent to your email
          </p>
        </div>

        {alert.message && (
          <Alert variant={alert.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              name="otp"
              label="Enter OTP"
              value={otp}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;