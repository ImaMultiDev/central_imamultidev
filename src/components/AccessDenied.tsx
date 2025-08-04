"use client";

import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface AccessDeniedProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

export function AccessDenied({
  title = "Acceso Denegado",
  message = "Solo el administrador puede acceder a esta ruta.",
  showBackButton = true,
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-red-600 dark:text-red-400">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{message}</p>
          <p className="text-sm text-muted-foreground">
            Esta sección requiere permisos de administrador para acceder.
          </p>
          {showBackButton && (
            <div className="pt-4 space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  // Si hay historial, volver; si no, ir al login
                  if (window.history.length > 1) {
                    router.back();
                  } else {
                    router.push("/login");
                  }
                }}
                className="gap-2 w-full"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push("/certifications")}
                className="w-full"
              >
                Ver como Usuario Público
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
