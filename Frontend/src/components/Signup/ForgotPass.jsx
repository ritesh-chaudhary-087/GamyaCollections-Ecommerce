"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../API/api-service";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await ApiService.forgotPassword(email);
      alert("OTP sent to your email ✅");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP ❌");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }
    try {
      // Step 2a: verify OTP to get resetToken if not yet verified
      let token = resetToken;
      if (!token) {
        const verifyRes = await ApiService.verifyOtp({ email, otp });
        token = verifyRes?.data?.resetToken;
        setResetToken(token || "");
      }

      if (!token) {
        alert("Invalid or expired OTP ❌");
        return;
      }

      // Step 2b: reset password using resetToken + newPassword
      await ApiService.resetPassword({ resetToken: token, newPassword });
      alert("Password reset successful ✅");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed ❌");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <h2 className="text-xl font-bold">Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <h2 className="text-xl font-bold">Reset Password</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border rounded px-4 py-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded px-4 py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border rounded px-4 py-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default ForgotPassword;
