import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CloudStorageHeaderProps {
  onAddCloudStorage: () => void;
}

export function CloudStorageHeader({
  onAddCloudStorage,
}: CloudStorageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 text-center lg:text-left items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Cloud & Storage
        </h1>
        <p className="text-muted-foreground">
          Herramientas de almacenamiento en la nube, sincronización e
          infraestructura de desarrollo
        </p>
      </div>
      <Button onClick={onAddCloudStorage}>
        <Plus className="mr-2 h-4 w-4" />
        Añadir Herramienta
      </Button>
    </div>
  );
}
