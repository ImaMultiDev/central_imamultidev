"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserContextType {
  isAdmin: boolean;
  isReadOnly: boolean;
  isAuthenticated: boolean;
  hasAccess: (route: string) => boolean;
  checkAdminStatus: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Rutas públicas (solo lectura para usuarios no admin)
const PUBLIC_READONLY_ROUTES = [
  "/certifications",
  "/courses",
  "/tutorials",
  "/docs",
  "/tools",
  "/data-analytics",
  "/cloud-storage",
  "/generative-ai",
  "/workshop",
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAdminStatus = () => {
    // Verificar si el usuario está autenticado como admin (sincronizar con useAuth)
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    const isAdminUser = !!(token && user);

    setIsAdmin(isAdminUser);
    setIsAuthenticated(true); // Siempre permitimos acceso, pero diferenciamos roles
  };

  const hasAccess = (route: string): boolean => {
    // Si es admin, tiene acceso a todo
    if (isAdmin) return true;

    // Si no es admin, solo tiene acceso a rutas públicas
    return PUBLIC_READONLY_ROUTES.includes(route);
  };

  const isReadOnly = !isAdmin;

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const value: UserContextType = {
    isAdmin,
    isReadOnly,
    isAuthenticated,
    hasAccess,
    checkAdminStatus,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
