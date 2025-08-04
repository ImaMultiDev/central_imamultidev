"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";

interface CoursesHeaderProps {
  onAddCourse: () => void;
}

export function CoursesHeader({ onAddCourse }: CoursesHeaderProps) {
  const { isAdmin } = useUser();

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 text-center lg:text-left items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Cursos</h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Gestiona tu aprendizaje y seguimiento de cursos"
            : "Explora los cursos disponibles y su estado de progreso"}
        </p>
      </div>
      {isAdmin && (
        <Button onClick={onAddCourse}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Curso
        </Button>
      )}
    </div>
  );
}
