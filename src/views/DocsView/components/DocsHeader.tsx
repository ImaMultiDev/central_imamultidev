"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocsHeaderProps {
  onAddDocument: () => void;
}

export function DocsHeader({ onAddDocument }: DocsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Centro de Documentación
        </h1>
        <p className="text-muted-foreground">
          Organiza y encuentra fácilmente todos tus recursos de desarrollo
        </p>
      </div>
      <Button onClick={onAddDocument}>
        <Plus className="mr-2 h-4 w-4" />
        Añadir Documento
      </Button>
    </div>
  );
}
