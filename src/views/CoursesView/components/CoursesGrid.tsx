"use client";

import { useState, useMemo, useEffect } from "react";
import { BookOpen, Plus, ExternalLink, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Course, CourseStatus } from "@/types";
import { useUser } from "@/contexts/UserContext";

const platformColors = {
  UDEMY: "bg-purple-500",
  COURSERA: "bg-blue-500",
  YOUTUBE: "bg-red-500",
  PLATZI: "bg-green-500",
  OTRA: "bg-gray-500",
};

const platformLabels = {
  UDEMY: "Udemy",
  COURSERA: "Coursera",
  YOUTUBE: "YouTube",
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

interface CoursesGridProps {
  courses: Course[];
  onStatusChange: (courseId: string, newStatus: CourseStatus) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  openMenuId: string | null;
  onOpenMenuChange: (menuId: string | null) => void;
  isDeleting: string | null;
  isStatusUpdating: string | null;
  onAddCourse: () => void;
}

// Skeleton component for loading state
function CourseCardSkeleton() {
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

export function CoursesGrid({
  courses,
  onStatusChange,
  onEditCourse,
  onDeleteCourse,
  openMenuId,
  onOpenMenuChange,
  isDeleting,
  isStatusUpdating,
  onAddCourse,
}: CoursesGridProps) {
  const { isAdmin } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const itemsPerPage = 6;

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return courses.slice(startIndex, endIndex);
  }, [courses, currentPage]);

  const totalPages = Math.ceil(courses.length / itemsPerPage);

  // Reset to page 1 when courses change
  useEffect(() => {
    setCurrentPage(1);
  }, [courses.length]);

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
              <CourseCardSkeleton key={`skeleton-${index}`} />
            ))
          : paginatedCourses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </div>
                    {isAdmin && (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 course-menu-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenMenuChange(
                              openMenuId === course.id ? null : course.id
                            );
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {openMenuId === course.id && (
                          <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border bg-background shadow-lg">
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditCourse(course);
                                  onOpenMenuChange(null);
                                }}
                                className="block w-full px-4 py-2 text-left text-sm hover:bg-accent"
                              >
                                Editar
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteCourse(course.id);
                                  onOpenMenuChange(null);
                                }}
                                disabled={isDeleting === course.id}
                                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDeleting === course.id ? (
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
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                        platformColors[
                          course.platform as keyof typeof platformColors
                        ]
                      }`}
                    >
                      {
                        platformLabels[
                          course.platform as keyof typeof platformLabels
                        ]
                      }
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                        statusColors[course.status as keyof typeof statusColors]
                      }`}
                    >
                      {statusLabels[course.status as keyof typeof statusLabels]}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Status Change Buttons - Solo para admin */}
                  {isAdmin && (
                    <div className="flex gap-2 mb-3 flex-wrap ">
                      <Button
                        size="sm"
                        variant={
                          course.status === "POR_COMENZAR"
                            ? "default"
                            : "outline"
                        }
                        disabled={isStatusUpdating === course.id}
                        onClick={() =>
                          onStatusChange(course.id, CourseStatus.POR_COMENZAR)
                        }
                        className="text-xs w-full sm:w-auto"
                      >
                        {isStatusUpdating === course.id ? (
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
                          course.status === "EN_PROGRESO"
                            ? "default"
                            : "outline"
                        }
                        disabled={isStatusUpdating === course.id}
                        onClick={() =>
                          onStatusChange(course.id, CourseStatus.EN_PROGRESO)
                        }
                        className="text-xs w-full sm:w-auto"
                      >
                        {isStatusUpdating === course.id ? (
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
                          course.status === "COMPLETADO" ? "default" : "outline"
                        }
                        disabled={isStatusUpdating === course.id}
                        onClick={() =>
                          onStatusChange(course.id, CourseStatus.COMPLETADO)
                        }
                        className="text-xs w-full sm:w-auto"
                      >
                        {isStatusUpdating === course.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                            ...
                          </>
                        ) : (
                          "Completado"
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Notes */}
                  {course.notes && (
                    <div className="text-sm">
                      <span className="font-medium">Notas: </span>
                      <span className="text-muted-foreground line-clamp-2">
                        {course.notes}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {course.tags.length > 3 && (
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                        +{course.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="text-sm text-muted-foreground">
                    Añadido:{" "}
                    {new Date(course.createdAt).toLocaleDateString("es-ES")}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {course.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          window.open(
                            course.url,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver Curso
                      </Button>
                    )}
                    {course.docsUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          window.open(
                            course.docsUrl,
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

        {!isPageLoading && courses.length === 0 && (
          <Card className="lg:col-span-3">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">
                    No se encontraron cursos
                  </h3>
                  <p className="text-muted-foreground">
                    Ajusta los filtros o añade tu primer curso
                  </p>
                </div>
                <Button onClick={onAddCourse}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Curso
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {courses.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
            {Math.min(currentPage * itemsPerPage, courses.length)} de{" "}
            {courses.length} cursos
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
