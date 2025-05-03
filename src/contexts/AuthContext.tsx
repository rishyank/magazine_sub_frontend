import React, { createContext, useState, useEffect, useContext } from "react";
import {
  User,
  login as apiLogin,
  register as apiRegister,
  getToken,
  clearAuth,
  getCurrentUser,
  fetchCurrentUser,
} from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { get } from "http";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user && !!getToken(); // passed to context provider

  useEffect(() => {
    const verifyToken = async () => {
      const token = getToken();

      if (token) {
        try {
          const userData = await fetchCurrentUser();

          setUser(userData);
        } catch (error) {
          clearAuth();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin({ username, password });
      setUser(response.user);
      toast.success(`Welcome back, ${username}!`);
      navigate("/magazines"); // Redirect to the magazines page after login
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage, {
        style: {
          backgroundColor: "#fef2f2", // light red
          color: "#b91c1c", // dark red text
          border: "1px solid #fca5a5",
        },
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      await apiRegister({ username, email, password });
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(errorMessage, {
        style: {
          backgroundColor: "#fef2f2", // light red
          color: "#b91c1c", // dark red text
          border: "1px solid #fca5a5",
        },
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    toast.info("You have been logged out");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
