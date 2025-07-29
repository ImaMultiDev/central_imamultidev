"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkshopHeaderProps {
  onAddWorkshop: () => void;
}

export function WorkshopHeader({ onAddWorkshop }: WorkshopHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 text-center lg:text-left items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Taller</h1>
        <p className="text-muted-foreground">
          Talleres de desarrollo para aprender y mejorar tus habilidades
        </p>
      </div>
      <Button onClick={onAddWorkshop}>
        <Plus className="mr-2 h-4 w-4" />
        Añadir Herramienta
      </Button>
    </div>
  );
}
