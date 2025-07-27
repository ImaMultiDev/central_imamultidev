import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataAnalyticsHeaderProps {
  onAddDataAnalytics: () => void;
}

export function DataAnalyticsHeader({
  onAddDataAnalytics,
}: DataAnalyticsHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 text-center lg:text-left items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Data & Analytics
        </h1>
        <p className="text-muted-foreground">
          Herramientas de Business Intelligence, Machine Learning y
          Visualización de Datos
        </p>
      </div>
      <Button onClick={onAddDataAnalytics}>
        <Plus className="mr-2 h-4 w-4" />
        Añadir Herramienta
      </Button>
    </div>
  );
}
