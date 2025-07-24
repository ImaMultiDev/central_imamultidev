"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  Wrench,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Tool } from "@/types";

interface ToolsGridProps {
  tools: Tool[];
  onEditTool: (tool: Tool) => void;
  onDeleteTool: (toolId: string) => void;
  typeColors: Record<string, string>;
  typeLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
}

export function ToolsGrid({
  tools,
  onEditTool,
  onDeleteTool,
  typeColors,
  typeLabels,
  categoryColors,
  categoryLabels,
}: ToolsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const paginatedTools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tools.slice(startIndex, endIndex);
  }, [tools, currentPage]);

  const totalPages = Math.ceil(tools.length / itemsPerPage);

  // Reset to page 1 when tools change
  useEffect(() => {
    setCurrentPage(1);
  }, [tools.length]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {paginatedTools.map((tool) => (
          <Card key={tool.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {tool.description}
                  </CardDescription>
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      // Toggle menu for this specific tool
                      const menuId = `menu-${tool.id}`;
                      const menu = document.getElementById(menuId);
                      if (menu) {
                        menu.classList.toggle("hidden");
                      }
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <div
                    id={`menu-${tool.id}`}
                    className="absolute right-0 top-8 z-10 hidden bg-background border border-border rounded-md shadow-lg min-w-[120px]"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2 rounded-none border-b border-border"
                      onClick={() => onEditTool(tool)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2 rounded-none text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDeleteTool(tool.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                    typeColors[tool.type as keyof typeof typeColors]
                  }`}
                >
                  {typeLabels[tool.type as keyof typeof typeLabels]}
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                    categoryColors[tool.category as keyof typeof categoryColors]
                  }`}
                >
                  {categoryLabels[tool.category as keyof typeof categoryLabels]}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {tool.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {tool.tags.length > 4 && (
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                    +{tool.tags.length - 4}
                  </span>
                )}
              </div>

              {/* Date */}
              <div className="text-sm text-muted-foreground">
                Añadido: {tool.createdAt.toLocaleDateString("es-ES")}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 flex-wrap justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    window.open(tool.url, "_blank", "noopener,noreferrer")
                  }
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {tools.length === 0 && (
          <Card className="lg:col-span-3">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Wrench className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">
                    No se encontraron herramientas
                  </h3>
                  <p className="text-muted-foreground">
                    Ajusta los filtros o añade tu primera herramienta
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {tools.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
            {Math.min(currentPage * itemsPerPage, tools.length)} de{" "}
            {tools.length} herramientas
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
