import { MoreHorizontal, ExternalLink, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataAnalytics } from "@/types";

interface DataAnalyticsGridProps {
  dataAnalytics: DataAnalytics[];
  onEditDataAnalytics: (item: DataAnalytics) => void;
  onDeleteDataAnalytics: (id: string) => void;
  openMenuId: string | null;
  onOpenMenuChange: (id: string | null) => void;
  isDeleting: string | null;
  typeColors: Record<string, string>;
  typeLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
}

export function DataAnalyticsGrid({
  dataAnalytics,
  onEditDataAnalytics,
  onDeleteDataAnalytics,
  openMenuId,
  onOpenMenuChange,
  isDeleting,
  typeColors,
  typeLabels,
  categoryColors,
  categoryLabels,
}: DataAnalyticsGridProps) {
  if (dataAnalytics.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No hay herramientas de Data & Analytics
            </h3>
            <p className="text-sm text-muted-foreground">
              Añade tu primera herramienta para comenzar
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {dataAnalytics.map((item) => (
        <Card key={item.id} className="relative group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold truncate">
                  {item.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="data-analytics-menu-button text-white transition-opacity"
                  onClick={() =>
                    onOpenMenuChange(openMenuId === item.id ? null : item.id)
                  }
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                {openMenuId === item.id && (
                  <div className="absolute right-0 top-8 z-10 bg-background border rounded-md shadow-lg py-1 min-w-[120px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2"
                      onClick={() => {
                        onEditDataAnalytics(item);
                        onOpenMenuChange(null);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2 text-destructive hover:text-destructive"
                      onClick={() => {
                        onDeleteDataAnalytics(item.id);
                        onOpenMenuChange(null);
                      }}
                      disabled={isDeleting === item.id}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting === item.id ? "Eliminando..." : "Eliminar"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${
                  typeColors[item.type]
                }`}
              >
                {typeLabels[item.type]}
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${
                  categoryColors[item.category]
                }`}
              >
                {categoryLabels[item.category]}
              </span>
            </div>
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>
            )}
            {/* Actions */}
            <div className="flex gap-2 pt-2 flex-wrap justify-center">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() =>
                  window.open(item.url, "_blank", "noopener,noreferrer")
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
