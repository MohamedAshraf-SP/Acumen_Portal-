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
        if (!accessToken) {
          throw new Error("No access token received");
        }
        const decodedUser = decodedToken(accessToken);
        if (!decodedUser) {
          throw new Error("Invalid token received");
        }
        setAccessToken(accessToken);
        setUser(decodedUser);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        if (decodedUser?.role) {
          navigate(`/${decodedUser.role}/dashboard`, { replace: true });
          window.history.replaceState(
            null,
            "",
            `/${decodedUser.role}/dashboard`
          );
        }
      }
      return response;
    } catch (error) {
      if (error.response) {
        // Handle specific HTTP errors
        if (error.response.status === 401) {
          console.error("Unauthorized: Invalid credentials");
        } else {
          console.error("Server error:", error.response.status);
        }
      } else if (error.request) {
        // Handle network errors (no response from server)
        console.error("Network error: No response received");
      } else {
        // Handle other errors (e.g., invalid token decoding)
        console.error("Error:", error.message);
      }
      throw error; // Rethrow the error for the caller to handle
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.get(`${api}/auth/logout`, { withCredentials: true });
      setUser(null);
      setAccessToken(null);
      Cookies.remove("refreshToken"); // Ensure refresh token is removed
      delete axios.defaults.headers.common["Authorization"];
      navigate("/auth/login", { replace: true });
      window.history.replaceState(null, "", "/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) return null; // No token available, skip refresh

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
      console.error("Failed to refresh access token:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          const decodedUser = decodedToken(newAccessToken);
          setUser(decodedUser);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setLoading(false);
      }
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
