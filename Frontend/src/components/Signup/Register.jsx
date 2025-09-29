"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../API/api-service";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // optional phone validation (10-15 digits)
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) {
      alert("Please enter a valid phone number (10-15 digits)");
      return;
    }
    setLoading(true);
    try {
      await ApiService.register(formData);
      alert("Registration successful ✅ Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            className="w-full border rounded px-4 py-2"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full border rounded px-4 py-2"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className="w-full border rounded px-4 py-2"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border rounded px-4 py-2"
            value={formData.password}
            onChange={handleChange}
          />
          <select
            name="role"
            className="w-full border rounded px-4 py-2"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Register;
