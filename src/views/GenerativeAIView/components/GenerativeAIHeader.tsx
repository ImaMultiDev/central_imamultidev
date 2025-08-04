"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";

interface GenerativeAIHeaderProps {
  onAddGenerativeAI: () => void;
}

export function GenerativeAIHeader({
  onAddGenerativeAI,
}: GenerativeAIHeaderProps) {
  const { isAdmin } = useUser();

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 text-center lg:text-left items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Generative AI
        </h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Herramientas de IA Generativa para texto, código, imágenes, audio y video"
            : "Explora las herramientas de IA Generativa para texto, código, imágenes, audio y video"}
        </p>
      </div>
      {isAdmin && (
        <Button onClick={onAddGenerativeAI}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Herramienta
        </Button>
      )}
    </div>
  );
}
