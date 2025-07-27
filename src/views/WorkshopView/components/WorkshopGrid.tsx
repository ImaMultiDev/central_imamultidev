"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, ExternalLink, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workshop } from "@/types";

interface WorkshopGridProps {
  workshops: Workshop[];
  onEditWorkshop: (item: Workshop) => void;
  onDeleteWorkshop: (itemId: string) => void;
  isDeleting: string | null;
}

export function WorkshopGrid({
  workshops,
  onEditWorkshop,
  onDeleteWorkshop,
  isDeleting,
}: WorkshopGridProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const typeColors = {
    IMAGES: "bg-blue-500",
    VIDEO: "bg-green-500",
    AUDIO: "bg-purple-500",
    FILES: "bg-orange-500",
    GENERATORS: "bg-red-500",
    TESTING: "bg-indigo-500",
    ANALYSIS: "bg-pink-500",
  };

  const typeLabels = {
    IMAGES: "Imágenes",
    VIDEO: "Video",
    AUDIO: "Audio",
    FILES: "Archivos",
    GENERATORS: "Generadores",
    TESTING: "Testing",
    ANALYSIS: "Análisis",
  };

  const categoryLabels = {
    MULTIMEDIA_EDITING: "Edición Multimedia",
    MULTIMEDIA_CONVERSION: "Conversión Multimedia",
    UTILITIES: "Utilidades",
  };

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".workshop-menu-button")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (workshops.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No hay herramientas de Taller
            </h3>
            <p className="text-sm text-muted-foreground">
              Comienza añadiendo tu primera herramienta de Taller.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workshops.map((item) => (
        <Card key={item.id} className="relative group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold truncate">
                  {item.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${
                      typeColors[
                        item.type as unknown as keyof typeof typeColors
                      ] || "bg-gray-500"
                    }`}
                  >
                    {typeLabels[
                      item.type as unknown as keyof typeof typeLabels
                    ] || item.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {categoryLabels[
                      item.category as unknown as keyof typeof categoryLabels
                    ] || item.category}
                  </span>
                </div>
              </div>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 workshop-menu-button text-white"
                  onClick={() =>
                    setOpenMenuId(openMenuId === item.id ? null : item.id)
                  }
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                {openMenuId === item.id && (
                  <div className="absolute right-0 top-8 z-10 w-32 bg-background border rounded-md shadow-lg py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2 h-auto"
                      onClick={() => {
                        window.open(item.url, "_blank");
                        setOpenMenuId(null);
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2 h-auto"
                      onClick={() => {
                        onEditWorkshop(item);
                        setOpenMenuId(null);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2 h-auto text-destructive hover:text-destructive"
                      onClick={() => {
                        onDeleteWorkshop(item.id);
                        setOpenMenuId(null);
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
            {item.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {item.description}
              </p>
            )}
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
