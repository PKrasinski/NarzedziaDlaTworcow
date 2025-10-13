import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const setAccessToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("authToken", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
  };

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    isLoading,
    setAccessToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Custom ProtectedRoute component
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return <>{children}</>;
}
