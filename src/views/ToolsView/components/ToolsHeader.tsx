import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";

interface ToolsHeaderProps {
  onAddTool: () => void;
}

export function ToolsHeader({ onAddTool }: ToolsHeaderProps) {
  const { isAdmin } = useUser();

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 text-center lg:text-left items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Herramientas
        </h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Gestiona tus herramientas de desarrollo, diseño y productividad"
            : "Explora las herramientas de desarrollo, diseño y productividad disponibles"}
        </p>
      </div>
      {isAdmin && (
        <Button onClick={onAddTool} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Añadir Herramienta
        </Button>
      )}
    </div>
  );
}
