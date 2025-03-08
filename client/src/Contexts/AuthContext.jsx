import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";
const api = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodedToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post(`${api}/auth/login`, credentials, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        const { accessToken } = response.data;
        const decodedUser = decodedToken(accessToken);
        setAccessToken(accessToken);
        setUser(decodedUser);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        navigate(`${decodedUser.role}/dashboard`);
      }
      return response;
    } catch (error) {
     // console.error("Login failed. Please try again.", error);
      return error;
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    setLoading(true);
    try {
      await axios.get(`${api}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setAccessToken(null);
      navigate("/auth/login");
      setLoading(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post(`${api}/auth/refreshtoken`, {
        refreshToken,
      });

      if (response.data) {
        const { newAccessToken } = response.data;
        setAccessToken(newAccessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return newAccessToken;
      }
    } catch (error) {
      // console.error("Failed to refresh access token:", error);
    }
  };
  // ask for new accesss Token

  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = Cookies.get("refreshToken");
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (newAccessToken) {
        const decodedUser = decodedToken(newAccessToken);
        setUser(decodedUser);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, handleLogin, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
