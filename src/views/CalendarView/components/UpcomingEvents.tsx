"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Event as CalendarEvent } from "@/types";

interface UpcomingEventsProps {
  events: CalendarEvent[];
  selectedCategory: string;
  getEventTimeStatus: (eventDate: Date | string) => string;
  categoryColors: Record<string, string>;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function UpcomingEvents({
  events,
  selectedCategory,
  getEventTimeStatus,
  categoryColors,
  onEditEvent,
  onDeleteEvent,
}: UpcomingEventsProps) {
  const [openEventMenuId, setOpenEventMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const now = useMemo(() => new Date(), []);

  const upcomingEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.startDate);
        return (
          eventDate >= now &&
          (selectedCategory === "ALL" || event.category === selectedCategory)
        );
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  }, [events, selectedCategory, now]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return upcomingEvents.slice(startIndex, endIndex);
  }, [upcomingEvents, currentPage]);

  const totalPages = Math.ceil(upcomingEvents.length / itemsPerPage);

  // Reset to page 1 when events or category change
  useEffect(() => {
    setCurrentPage(1);
  }, [upcomingEvents.length, selectedCategory]);

  // Mostrar indicador de scroll cuando hay más de 5 eventos

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".event-menu-button")) {
        setOpenEventMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Eventos</CardTitle>
        <CardDescription>
          Los siguientes eventos en tu calendario
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 lg:h-160 max-h-160 overflow-y-auto pr-2 pb-2">
            {paginatedEvents.map((event) => {
              const timeStatus = getEventTimeStatus(event.startDate);
              const eventTime = new Date(event.startDate);
              const timeDiff = eventTime.getTime() - now.getTime();
              const isUrgent = timeDiff < 2 * 60 * 60 * 1000; // Menos de 2 horas
              const daysUntil = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));

              return (
                <div
                  key={event.id}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border transition-colors ${
                    timeStatus === "today"
                      ? "border-blue-500 bg-blue-500/5"
                      : isUrgent
                      ? "border-orange-500 bg-orange-500/5"
                      : ""
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full mt-1 ${
                      categoryColors[
                        event.category as keyof typeof categoryColors
                      ]
                    } ${timeStatus === "today" ? "ring-2 ring-blue-500" : ""}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate flex items-center gap-2">
                      {event.title}
                      {timeStatus === "today" && (
                        <span className="text-xs bg-blue-500 text-white px-1 rounded">
                          HOY
                        </span>
                      )}
                      {isUrgent && timeStatus !== "today" && (
                        <span className="text-xs bg-orange-500 text-white px-1 rounded">
                          PRONTO
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {(event.startDate instanceof Date
                        ? event.startDate
                        : new Date(event.startDate)
                      ).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {timeStatus === "future" && daysUntil > 0 && (
                        <span className="text-xs ml-2">
                          (en {daysUntil} día{daysUntil !== 1 ? "s" : ""})
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 event-menu-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenEventMenuId(
                          openEventMenuId === event.id ? null : event.id
                        );
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {openEventMenuId === event.id && (
                      <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border bg-background shadow-lg">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditEvent(event);
                              setOpenEventMenuId(null);
                            }}
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-accent"
                          >
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEvent(event.id);
                              setOpenEventMenuId(null);
                            }}
                            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-accent"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {paginatedEvents.length === 0 && upcomingEvents.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No hay eventos próximos
              </p>
            )}
          </div>

          {/* Pagination */}
          {upcomingEvents.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, upcomingEvents.length)} de{" "}
                {upcomingEvents.length} eventos
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
