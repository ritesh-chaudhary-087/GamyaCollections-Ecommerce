"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { BASEURL } from "./../Comman/CommanConstans";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  // Initialize auth state from cookie-based session
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${BASEURL}/api/auth/me`, {
          timeout: 10000,
        });
        if (response.data && response.data.user) {
          const userData = response.data.user;
          setIsAuthenticated(true);
          setUserRole(userData.role);
          setUserId(userData._id);
          setUser(userData);
          setProfileImage(userData.profileImage || "");
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${BASEURL}/api/auth/logout`);
    } catch {}
    // Clear state
    setIsAuthenticated(false);
    setUserRole(null);
    setUserToken(null);
    setUserId(null);
    setUser(null);
    setProfileImage(null);

    // Dispatch a custom event to notify other components
    window.dispatchEvent(new Event("auth-changed"));
  };

  const login = async (userData) => {
    setIsAuthenticated(true);
    setUserRole(userData.role);
    setUserId(userData.id || userData._id);
    setUser(userData);
    setProfileImage(userData.profileImage || "");
    window.dispatchEvent(new Event("auth-changed"));
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    return userRole === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        login,
        logout: handleLogout,
        userToken,
        userId,
        hasRole,
        loading,
        user,
        profileImage,
        setProfileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
