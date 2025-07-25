"use client";

import { useState, useMemo, useEffect } from "react";
import { ExternalLink, MoreHorizontal, Wrench } from "lucide-react";
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
  openMenuId: string | null;
  onOpenMenuChange: (menuId: string | null) => void;
  isDeleting: string | null;
  typeColors: Record<string, string>;
  typeLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
}

// Skeleton component for loading state
function ToolCardSkeleton() {
  return (
    <Card className="flex flex-col animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
          <div className="h-8 w-8 bg-muted rounded"></div>
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-4">
          <div className="h-6 w-16 bg-muted rounded-full"></div>
          <div className="h-6 w-20 bg-muted rounded-full"></div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex flex-wrap gap-1">
          <div className="h-6 w-12 bg-muted rounded"></div>
          <div className="h-6 w-16 bg-muted rounded"></div>
          <div className="h-6 w-14 bg-muted rounded"></div>
        </div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-9 bg-muted rounded"></div>
      </CardContent>
    </Card>
  );
}

export function ToolsGrid({
  tools,
  onEditTool,
  onDeleteTool,
  openMenuId,
  onOpenMenuChange,
  isDeleting,
  typeColors,
  typeLabels,
  categoryColors,
  categoryLabels,
}: ToolsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
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

  const handlePageChange = (newPage: number) => {
    setIsPageLoading(true);
    setCurrentPage(newPage);

    // Simulate loading time for better UX
    setTimeout(() => {
      setIsPageLoading(false);
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {isPageLoading
          ? // Show skeleton loaders while loading
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <ToolCardSkeleton key={`skeleton-${index}`} />
            ))
          : paginatedTools.map((tool) => (
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
                        className="h-8 w-8 tool-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenMenuChange(
                            openMenuId === tool.id ? null : tool.id
                          );
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      {openMenuId === tool.id && (
                        <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border bg-background shadow-lg">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditTool(tool);
                                onOpenMenuChange(null);
                              }}
                              className="block w-full px-4 py-2 text-left text-sm hover:bg-accent"
                            >
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTool(tool.id);
                                onOpenMenuChange(null);
                              }}
                              disabled={isDeleting === tool.id}
                              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isDeleting === tool.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-2 inline"></div>
                                  Eliminando...
                                </>
                              ) : (
                                "Eliminar"
                              )}
                            </button>
                          </div>
                        </div>
                      )}
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
                        categoryColors[
                          tool.category as keyof typeof categoryColors
                        ]
                      }`}
                    >
                      {
                        categoryLabels[
                          tool.category as keyof typeof categoryLabels
                        ]
                      }
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {tool.tags.length > 3 && (
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                        +{tool.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="text-sm text-muted-foreground">
                    Añadido:{" "}
                    {new Date(tool.createdAt).toLocaleDateString("es-ES")}
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

        {!isPageLoading && tools.length === 0 && (
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
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
