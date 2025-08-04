"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  FileText,
  HardDrive,
  Wrench,
  Menu,
  X,
  LogOut,
  ShieldUser,
  BarChart3,
  Cloud,
  Bot,
  Hammer,
  Play,
  CreditCard,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/contexts/UserContext";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    adminOnly: true,
  },
  {
    name: "Calendario",
    href: "/calendar",
    icon: Calendar,
    adminOnly: true,
  },
  {
    name: "Suscripciones",
    href: "/subscriptions",
    icon: CreditCard,
    adminOnly: true,
  },
  {
    name: "Certificaciones",
    href: "/certifications",
    icon: Award,
    adminOnly: false,
  },
  {
    name: "Cursos",
    href: "/courses",
    icon: BookOpen,
    adminOnly: false,
  },
  {
    name: "Tutoriales",
    href: "/tutorials",
    icon: Play,
    adminOnly: false,
  },
  {
    name: "Documentación",
    href: "/docs",
    icon: FileText,
    adminOnly: false,
  },
  {
    name: "Herramientas",
    href: "/tools",
    icon: Wrench,
    adminOnly: false,
  },
  {
    name: "Data & Analytics",
    href: "/data-analytics",
    icon: BarChart3,
    adminOnly: false,
  },
  {
    name: "Cloud & Storage",
    href: "/cloud-storage",
    icon: Cloud,
    adminOnly: false,
  },
  {
    name: "IA Generativa",
    href: "/generative-ai",
    icon: Bot,
    adminOnly: false,
  },
  {
    name: "Taller",
    href: "/workshop",
    icon: Hammer,
    adminOnly: false,
  },
  {
    name: "Test Hardware",
    href: "/hardware-test",
    icon: HardDrive,
    adminOnly: true,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { logout, isAuthenticated } = useAuth();
  const { isAdmin } = useUser();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      // Si está autenticado, hacer logout
      logout();
    } else {
      // Si no está autenticado, ir al login
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-background border border-border"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-8 w-8 text-foreground border border-border rounded-full p-1" />
        ) : (
          <Menu className="h-8 w-8 border border-border rounded-full p-1 text-foreground" />
        )}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-background border-r border-border transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex mx-auto lg:mx-0 h-16 items-center justify-between px-4 border-b border-border">
            {!isCollapsed && (
              <h1 className="text-lg font-semibold text-foreground">
                Central IMA
              </h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8 text-foreground"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const isRestricted = item.adminOnly && !isAdmin;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isRestricted
                      ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                    isCollapsed && "justify-center"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                  title={
                    isRestricted
                      ? "Acceso restringido - Solo administrador"
                      : undefined
                  }
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isRestricted && "text-red-500"
                    )}
                  />
                  {!isCollapsed && (
                    <span className={cn(isRestricted && "text-red-500")}>
                      {item.name}
                      {isRestricted && " 🔒"}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4">
            {isCollapsed ? (
              /* Layout colapsado: "I" encima del botón de auth */
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {isAuthenticated ? "I" : "?"}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-foreground hover:text-accent-foreground"
                  title={
                    isAuthenticated
                      ? "Cerrar sesión"
                      : "Iniciar sesión como admin"
                  }
                  onClick={handleAuthAction}
                >
                  {isAuthenticated ? (
                    <LogOut className="h-4 w-4" />
                  ) : (
                    <ShieldUser className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              /* Layout expandido: horizontal con información del usuario */
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {isAuthenticated ? "I" : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {isAuthenticated ? "Imanol MU" : "Usuario Público"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {isAuthenticated ? "imamultidev" : "Solo lectura"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-foreground hover:text-accent-foreground"
                  title={
                    isAuthenticated
                      ? "Cerrar sesión"
                      : "Iniciar sesión como admin"
                  }
                  onClick={handleAuthAction}
                >
                  {isAuthenticated ? (
                    <LogOut className="h-4 w-4" />
                  ) : (
                    <ShieldUser className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
