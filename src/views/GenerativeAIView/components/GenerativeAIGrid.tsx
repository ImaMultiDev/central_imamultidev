"use client";

import { useState, useMemo, useEffect } from "react";
import {
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { GenerativeAI } from "@/types";
import { useUser } from "@/contexts/UserContext";

interface GenerativeAIGridProps {
  generativeAI: GenerativeAI[];
  onEditGenerativeAI: (item: GenerativeAI) => void;
  onDeleteGenerativeAI: (id: string) => void;
  openMenuId: string | null;
  onOpenMenuChange: (id: string | null) => void;
  isDeleting: string | null;
  typeColors: Record<string, string>;
  typeLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
}

// Skeleton component for loading state
function GenerativeAICardSkeleton() {
  return (
    <Card className="flex flex-col animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full mb-1"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
          <div className="h-8 w-8 bg-muted rounded"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="h-6 bg-muted rounded-full w-20"></div>
            <div className="h-6 bg-muted rounded-full w-24"></div>
          </div>
          <div className="flex gap-1">
            <div className="h-6 bg-muted rounded-full w-16"></div>
            <div className="h-6 bg-muted rounded-full w-20"></div>
            <div className="h-6 bg-muted rounded-full w-14"></div>
          </div>
          <div className="h-9 bg-muted rounded w-full"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function GenerativeAIGrid({
  generativeAI,
  onEditGenerativeAI,
  onDeleteGenerativeAI,
  openMenuId,
  onOpenMenuChange,
  isDeleting,
  typeColors,
  typeLabels,
  categoryColors,
  categoryLabels,
}: GenerativeAIGridProps) {
  const { isAdmin } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const itemsPerPage = 6;

  const paginatedGenerativeAI = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return generativeAI.slice(startIndex, endIndex);
  }, [generativeAI, currentPage]);

  const totalPages = Math.ceil(generativeAI.length / itemsPerPage);

  // Reset to page 1 when generative AI change
  useEffect(() => {
    setCurrentPage(1);
  }, [generativeAI.length]);

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
              <GenerativeAICardSkeleton key={`skeleton-${index}`} />
            ))
          : paginatedGenerativeAI.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </div>
                    {isAdmin && (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="generative-ai-menu-button text-white transition-opacity"
                          onClick={() =>
                            onOpenMenuChange(
                              openMenuId === item.id ? null : item.id
                            )
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
                                onEditGenerativeAI(item);
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
                                onDeleteGenerativeAI(item.id);
                                onOpenMenuChange(null);
                              }}
                              disabled={isDeleting === item.id}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {isDeleting === item.id
                                ? "Eliminando..."
                                : "Eliminar"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap gap-2">
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
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    {item.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-auto"
                        onClick={() =>
                          window.open(item.url, "_blank", "noopener,noreferrer")
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Herramienta
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

        {!isPageLoading && generativeAI.length === 0 && (
          <Card className="lg:col-span-3">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">
                    No se encontraron herramientas de IA Generativa
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
      {generativeAI.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
            {Math.min(currentPage * itemsPerPage, generativeAI.length)} de{" "}
            {generativeAI.length} herramientas
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
