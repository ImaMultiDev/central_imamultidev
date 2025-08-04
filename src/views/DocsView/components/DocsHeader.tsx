"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";

interface DocsHeaderProps {
  onAddDocument: () => void;
}

export function DocsHeader({ onAddDocument }: DocsHeaderProps) {
  const { isAdmin } = useUser();

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 text-center lg:text-left items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Centro de Documentación
        </h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Organiza y encuentra fácilmente todos tus recursos de desarrollo"
            : "Explora y encuentra fácilmente todos los recursos de desarrollo disponibles"}
        </p>
      </div>
      {isAdmin && (
        <Button onClick={onAddDocument}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Documento
        </Button>
      )}
    </div>
  );
}
