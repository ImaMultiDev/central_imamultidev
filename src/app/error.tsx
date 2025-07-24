"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4 text-center max-w-md mx-auto p-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Algo salió mal
          </h2>
          <p className="text-sm text-muted-foreground">
            Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Intentar de nuevo
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left w-full">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              Detalles del error (solo desarrollo)
            </summary>
            <pre className="mt-2 text-xs text-muted-foreground bg-muted p-3 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
