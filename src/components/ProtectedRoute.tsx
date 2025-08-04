"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Rutas que requieren acceso de administrador
const ADMIN_ONLY_ROUTES = [
  "/",
  "/calendar",
  "/courses",
  "/tutorials",
  "/subscriptions",
  "/hardware-test",
];

// Rutas públicas (solo lectura para usuarios no admin)
const PUBLIC_READONLY_ROUTES = [
  "/certifications",
  "/docs",
  "/tools",
  "/data-analytics",
  "/cloud-storage",
  "/generative-ai",
  "/workshop",
];

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Redirigir al login si intenta acceder a ruta de admin sin estar autenticado
  useEffect(() => {
    if (
      !isLoading &&
      !isAuthenticated &&
      ADMIN_ONLY_ROUTES.includes(pathname)
    ) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado y trata de acceder a ruta de admin, mostrar loading mientras redirige
  if (!isAuthenticated && ADMIN_ONLY_ROUTES.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado pero está en ruta pública, permitir acceso (modo lectura)
  if (!isAuthenticated && PUBLIC_READONLY_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  // Si está autenticado (admin), permitir acceso total
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Por defecto, permitir acceso a rutas públicas (fallback para rutas no categorizadas)
  return <>{children}</>;
}
