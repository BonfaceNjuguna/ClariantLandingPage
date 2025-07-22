import { useState } from "react";
import logo from "../assets/clariant-logo-small.svg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const handleSendOtp = async () => {
    setError("");
    setSendingOtp(true);
    try {
      if (
        !email.endsWith("@clariant.com") &&
        email !== import.meta.env.VITE_WHITELISTED_EMAIL
      ) {
        setError("Only @clariant.com or whitelisted emails allowed.");
        setSendingOtp(false);
        return;
      }
      await axios.post(`${API_URL}/auth/send-otp`, { email });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
      setUser({
        email: res.data.user.email,
        name: res.data.user.name,
        token: res.data.token,
        provider: "otp",
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md border border-gray-200 p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-20 h-20 mb-6" />
          <h1 className="text-2xl font-bold text-black mb-1">Clariant Apps Landing Page</h1>
          <p className="text-gray-500 mb-6 text-sm">Sign in with your email to continue</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className={`w-full py-2 font-semibold rounded-lg transition ${
              sendingOtp || !email
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:opacity-90"
            }`}
            onClick={handleSendOtp}
            disabled={sendingOtp || !email}
          >
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>

          {otpSent && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                onClick={handleLogin}
                disabled={!otp}
              >
                Login
              </button>
            </>
          )}
        </div>

        {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;