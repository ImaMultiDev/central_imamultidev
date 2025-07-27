"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerativeAIHeaderProps {
  onAddGenerativeAI: () => void;
}

export function GenerativeAIHeader({
  onAddGenerativeAI,
}: GenerativeAIHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 text-center lg:text-left items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Generative AI
        </h1>
        <p className="text-muted-foreground">
          Herramientas de IA Generativa para texto, código, imágenes, audio y
          video
        </p>
      </div>
      <Button onClick={onAddGenerativeAI}>
        <Plus className="mr-2 h-4 w-4" />
        Añadir Curso
      </Button>
    </div>
  );
}
