"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token válido en localStorage
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    console.log("useAuth - Token:", token ? "Presente" : "Ausente");
    console.log("useAuth - User:", user ? "Presente" : "Ausente");

    if (token && user) {
      console.log("useAuth - Usuario autenticado");
      setIsAuthenticated(true);
    } else {
      console.log("useAuth - Usuario no autenticado");
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
    // Redirigir a una ruta pública en lugar de login para permitir acceso público
    window.location.href = "/certifications";
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
