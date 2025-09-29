"use client";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../API/api-service";
import { AuthContext } from "../AuthContext/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    }
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await ApiService.login({ email, password });
      const user = res?.data?.data?.user;
      if (user) login(user);

      alert("Login successful ✅");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Welcome back!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-lg border px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-lg border px-4 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Buttons */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full rounded-lg border border-blue-600 px-4 py-2 text-blue-600"
          >
            Create an account
          </button>

          <p
            className="text-sm text-blue-600 text-center cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
};
export default Login;
