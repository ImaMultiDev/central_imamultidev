"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Play,
  Plus,
  ExternalLink,
  MoreHorizontal,
  BookOpen,
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
import { Tutorial, TutorialStatus } from "@/types";

const platformColors = {
  YOUTUBE: "bg-red-500",
  UDEMY: "bg-purple-500",
  COURSERA: "bg-blue-500",
  PLATZI: "bg-green-500",
  OTRA: "bg-gray-500",
};

const platformLabels = {
  YOUTUBE: "YouTube",
  UDEMY: "Udemy",
  COURSERA: "Coursera",
  PLATZI: "Platzi",
  OTRA: "Otra",
};

const statusLabels = {
  EN_PROGRESO: "En Progreso",
  COMPLETADO: "Completado",
  POR_COMENZAR: "Por Comenzar",
};

const statusColors = {
  EN_PROGRESO: "bg-yellow-500",
  COMPLETADO: "bg-green-500",
  POR_COMENZAR: "bg-blue-500",
};

interface TutorialsGridProps {
  tutorials: Tutorial[];
  onStatusChange: (tutorialId: string, newStatus: TutorialStatus) => void;
  onEditTutorial: (tutorial: Tutorial) => void;
  onDeleteTutorial: (tutorialId: string) => void;
  openMenuId: string | null;
  onOpenMenuChange: (menuId: string | null) => void;
  isDeleting: string | null;
  isStatusUpdating: string | null;
  onAddTutorial: () => void;
}

// Skeleton component for loading state
function TutorialCardSkeleton() {
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
        <div className="flex items-center gap-2 mt-4">
          <div className="h-6 w-16 bg-muted rounded-full"></div>
          <div className="h-6 w-20 bg-muted rounded-full"></div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex gap-2 mb-3 flex-wrap">
          <div className="h-8 w-24 bg-muted rounded"></div>
          <div className="h-8 w-24 bg-muted rounded"></div>
          <div className="h-8 w-24 bg-muted rounded"></div>
        </div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
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

export function TutorialsGrid({
  tutorials,
  onStatusChange,
  onEditTutorial,
  onDeleteTutorial,
  openMenuId,
  onOpenMenuChange,
  isDeleting,
  isStatusUpdating,
  onAddTutorial,
}: TutorialsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const itemsPerPage = 6;

  const paginatedTutorials = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tutorials.slice(startIndex, endIndex);
  }, [tutorials, currentPage]);

  const totalPages = Math.ceil(tutorials.length / itemsPerPage);

  // Reset to page 1 when tutorials change
  useEffect(() => {
    setCurrentPage(1);
  }, [tutorials.length]);

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
              <TutorialCardSkeleton key={`skeleton-${index}`} />
            ))
          : paginatedTutorials.map((tutorial) => (
              <Card key={tutorial.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {tutorial.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {tutorial.description}
                      </CardDescription>
                    </div>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 tutorial-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenMenuChange(
                            openMenuId === tutorial.id ? null : tutorial.id
                          );
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      {openMenuId === tutorial.id && (
                        <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border bg-background shadow-lg">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditTutorial(tutorial);
                                onOpenMenuChange(null);
                              }}
                              className="block w-full px-4 py-2 text-left text-sm hover:bg-accent"
                            >
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTutorial(tutorial.id);
                                onOpenMenuChange(null);
                              }}
                              disabled={isDeleting === tutorial.id}
                              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isDeleting === tutorial.id ? (
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

                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                        platformColors[
                          tutorial.platform as keyof typeof platformColors
                        ]
                      }`}
                    >
                      {
                        platformLabels[
                          tutorial.platform as keyof typeof platformLabels
                        ]
                      }
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                        statusColors[
                          tutorial.status as keyof typeof statusColors
                        ]
                      }`}
                    >
                      {
                        statusLabels[
                          tutorial.status as keyof typeof statusLabels
                        ]
                      }
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Status Change Buttons */}
                  <div className="flex gap-2 mb-3 flex-wrap ">
                    <Button
                      size="sm"
                      variant={
                        tutorial.status === "POR_COMENZAR"
                          ? "default"
                          : "outline"
                      }
                      disabled={isStatusUpdating === tutorial.id}
                      onClick={() =>
                        onStatusChange(tutorial.id, TutorialStatus.POR_COMENZAR)
                      }
                      className="text-xs w-full sm:w-auto"
                    >
                      {isStatusUpdating === tutorial.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                          ...
                        </>
                      ) : (
                        "Por Comenzar"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        tutorial.status === "EN_PROGRESO"
                          ? "default"
                          : "outline"
                      }
                      disabled={isStatusUpdating === tutorial.id}
                      onClick={() =>
                        onStatusChange(tutorial.id, TutorialStatus.EN_PROGRESO)
                      }
                      className="text-xs w-full sm:w-auto"
                    >
                      {isStatusUpdating === tutorial.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                          ...
                        </>
                      ) : (
                        "En Progreso"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        tutorial.status === "COMPLETADO" ? "default" : "outline"
                      }
                      disabled={isStatusUpdating === tutorial.id}
                      onClick={() =>
                        onStatusChange(tutorial.id, TutorialStatus.COMPLETADO)
                      }
                      className="text-xs w-full sm:w-auto"
                    >
                      {isStatusUpdating === tutorial.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                          ...
                        </>
                      ) : (
                        "Completado"
                      )}
                    </Button>
                  </div>

                  {/* Notes */}
                  {tutorial.notes && (
                    <div className="text-sm">
                      <span className="font-medium">Notas: </span>
                      <span className="text-muted-foreground line-clamp-2">
                        {tutorial.notes}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {tutorial.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {tutorial.tags.length > 3 && (
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                        +{tutorial.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="text-sm text-muted-foreground">
                    Añadido:{" "}
                    {new Date(tutorial.createdAt).toLocaleDateString("es-ES")}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {tutorial.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          window.open(
                            tutorial.url,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver Tutorial
                      </Button>
                    )}
                    {tutorial.docsUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          window.open(
                            tutorial.docsUrl,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Ver Docs
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

        {!isPageLoading && tutorials.length === 0 && (
          <Card className="lg:col-span-3">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Play className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">
                    No se encontraron tutoriales
                  </h3>
                  <p className="text-muted-foreground">
                    Ajusta los filtros o añade tu primer tutorial
                  </p>
                </div>
                <Button onClick={onAddTutorial}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Tutorial
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {tutorials.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
            {Math.min(currentPage * itemsPerPage, tutorials.length)} de{" "}
            {tutorials.length} tutoriales
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
