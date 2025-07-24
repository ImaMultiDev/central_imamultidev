"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // En desarrollo, verificar localStorage
    const auth = localStorage.getItem("auth");
    if (auth) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    const credentials = btoa(`${username}:${password}`);
    localStorage.setItem("auth", credentials);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
    // Usar window.location para forzar la navegación
    window.location.href = "/login";
  };

  const getAuthHeader = () => {
    const auth = localStorage.getItem("auth");
    return auth ? { Authorization: `Basic ${auth}` } : {};
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAuthHeader,
  };
}
