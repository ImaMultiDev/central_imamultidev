"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event as CalendarEvent } from "@/types";
import { EventDetailModal } from "./EventDetailModal";

interface DayViewProps {
  events: CalendarEvent[];
  selectedCategory: string;
  getEventTimeStatus: (eventDate: Date | string) => string;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  isDeleting: string | null;
}

export function DayView({
  events,
  selectedCategory,
  getEventTimeStatus,
  categoryColors,
  categoryLabels,
  onEditEvent,
  onDeleteEvent,
  isDeleting,
}: DayViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const today = new Date();

  const navigateDay = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.toDateString() === date.toDateString() &&
        (selectedCategory === "ALL" || event.category === selectedCategory)
      );
    });
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const isToday = currentDate.toDateString() === today.toDateString();
  const dayEvents = getEventsForDate(currentDate);

  // Ordenar eventos por hora
  const sortedEvents = dayEvents.sort((a, b) => {
    if (a.isAllDay && !b.isAllDay) return -1;
    if (!a.isAllDay && b.isAllDay) return 1;
    if (a.isAllDay && b.isAllDay) return 0;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  const getEventsForHour = (hour: number) => {
    return sortedEvents.filter((event) => {
      if (event.isAllDay) return false;
      const eventHour = new Date(event.startDate).getHours();
      return eventHour === hour;
    });
  };

  const allDayEvents = sortedEvents.filter((event) => event.isAllDay);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 text-center lg:text-left items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {formatDate(currentDate)}
            {isToday && (
              <span className="text-sm font-normal text-blue-500">(Hoy)</span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDay("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Hoy
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDay("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 max-h-[600px]">
          {/* Eventos de todo el día */}
          {allDayEvents.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Todo el día
              </h3>
              <div className="space-y-2 lg:h-[120px] max-h-[120px] overflow-y-auto border rounded-lg p-3 bg-muted/20">
                {allDayEvents.map((event) => {
                  const timeStatus = getEventTimeStatus(event.startDate);
                  const opacity = timeStatus === "past" ? "opacity-50" : "";

                  return (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg text-white cursor-pointer hover:opacity-80 transition-all ${
                        categoryColors[
                          event.category as keyof typeof categoryColors
                        ]
                      } ${opacity}`}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-sm opacity-90 mt-1">
                          {event.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timeline por horas */}
          <div className="space-y-1">
            <h3 className="hidden lg:block text-sm font-medium text-muted-foreground mb-3">
              Horario
            </h3>
            <div className="lg:h-[400px] max-h-[400px] overflow-y-auto border rounded-lg">
              {getTimeSlots().map((hour) => {
                const hourEvents = getEventsForHour(hour);
                const isCurrentHour = today.getHours() === hour && isToday;

                return (
                  <div
                    key={hour}
                    className={`flex border-l-2 ${
                      isCurrentHour
                        ? "border-blue-500 bg-blue-500/5"
                        : "border-border"
                    }`}
                  >
                    {/* Hora */}
                    <div className="w-16 p-2 text-xs text-muted-foreground font-medium bg-muted/30">
                      {hour.toString().padStart(2, "0")}:00
                    </div>

                    {/* Eventos de esta hora */}
                    <div className="flex-1 p-2 min-h-[60px]">
                      {hourEvents.length === 0 ? (
                        <div className="text-xs text-muted-foreground opacity-50">
                          Sin eventos
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {hourEvents.map((event) => {
                            const timeStatus = getEventTimeStatus(
                              event.startDate
                            );
                            const opacity =
                              timeStatus === "past" ? "opacity-50" : "";
                            const eventDate = new Date(event.startDate);

                            return (
                              <div
                                key={event.id}
                                className={`p-2 rounded-md text-white text-sm cursor-pointer hover:opacity-80 transition-all ${
                                  categoryColors[
                                    event.category as keyof typeof categoryColors
                                  ]
                                } ${opacity}`}
                                onClick={(e) => handleEventClick(event, e)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">
                                    {event.title}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs opacity-90">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatTime(eventDate)}</span>
                                  </div>
                                </div>
                                {event.description && (
                                  <div className="text-xs opacity-90 mt-1">
                                    {event.description}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sin eventos */}
          {sortedEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-10 lg:h-12 w-10 lg:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Sin eventos para este día
              </h3>
              <p className="hidden lg:block text-sm text-muted-foreground">
                No hay eventos programados para el{" "}
                {currentDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={onEditEvent}
        onDelete={onDeleteEvent}
        isDeleting={isDeleting}
        categoryColors={categoryColors}
        categoryLabels={categoryLabels}
        getEventTimeStatus={getEventTimeStatus}
      />
    </Card>
  );
}
