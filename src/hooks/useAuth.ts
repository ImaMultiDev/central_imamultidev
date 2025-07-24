"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token válido en localStorage
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    // Esta función ya no se usa directamente, el login se maneja en la página
    console.log("Login function called - should use API route instead");
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    // Usar window.location para forzar la navegación
    window.location.href = "/login";
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAuthHeader,
  };
}
