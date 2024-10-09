import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PinInput from "react-pin-input";
import Button from "../../components/shared/button";
import { Alert, AlertDescription } from "../../components/shared/alert";
import { useAuth } from "../../contexts/auth/AuthContext";

const OtpVerification = () => {
  const navigate = useNavigate();
  const { verifyOTP, isLoading } = useAuth();
  const [otp, setOtp] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (value) => {
    setOtp(value);
  };

  const handleComplete = (value) => {
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const result = await verifyOTP(otp);
      if (result.success) {
        setAlert({type: "success", message: result.success});
        setTimeout(() => { navigate("/dashboard");}, 2000);
      }
      else {
        setAlert({type: "error", message: result.error});
      }
    } catch (error) {
      setAlert({type: "error", message: error.message });
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
          <Alert variant={alert.type === "error" ? "destructive" : "success"}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <PinInput
              length={6}
              initialValue=""
              onChange={handleChange}
              onComplete={handleComplete}
              type="numeric"
              inputMode="number"
              style={{ padding: '10px'}}
              inputStyle={{ borderColor: 'gray', borderWidth: '1px' , borderRadius: '8px' }}
              inputFocusStyle={{ borderColor: '#333', borderWidth: '2px' }}
              autoSelect={true}
              regexCriteria={/^[0-9]*$/}
              allowPaste
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