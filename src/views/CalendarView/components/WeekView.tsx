"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event as CalendarEvent } from "@/types";
import { EventDetailModal } from "./EventDetailModal";

interface WeekViewProps {
  events: CalendarEvent[];
  selectedCategory: string;
  getEventTimeStatus: (eventDate: Date | string) => string;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function WeekView({
  events,
  selectedCategory,
  getEventTimeStatus,
  categoryColors,
  categoryLabels,
  onEditEvent,
  onDeleteEvent,
}: WeekViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const today = new Date();
  const shortDayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Obtener el inicio de la semana (domingo)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Obtener el fin de la semana (sábado)

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
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

  const weekStart = getWeekStart(currentDate);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    weekDays.push(day);
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <Card className="lg:col-span-2 overflow-x-auto lg:overflow-visible">
      <CardHeader>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 text-center lg:text-left items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Semana del {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Esta Semana
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto lg:overflow-visible w-[700px] lg:w-full">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const dayEvents = getEventsForDate(date);

            return (
              <div
                key={index}
                className={`min-h-[200px] lg:min-h-[250px] max-h-[250px] overflow-hidden p-3 lg:p-4 border rounded-lg ${
                  isToday
                    ? "bg-blue-500/10 border-blue-500/30 shadow-lg"
                    : "bg-card border-border"
                }`}
              >
                {/* Header del día */}
                <div className="flex justify-between mb-3">
                  <div className="text-center flex flex-col items-center justify-center gap-1">
                    <div
                      className={`text-xs lg:text-sm font-medium ${
                        isToday
                          ? "text-blue-600 font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {shortDayNames[index]}
                    </div>
                    <div
                      className={`text-lg lg:text-xl font-bold ${
                        isToday ? "text-blue-600" : "text-foreground"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                  {isToday && (
                    <div className="text-xs text-blue-500 font-medium">Hoy</div>
                  )}
                </div>
                {/* Eventos del día */}
                <div className="flex flex-col gap-2 max-h-[120px] lg:max-h-[150px] overflow-y-auto">
                  {dayEvents.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      Sin eventos
                    </div>
                  ) : (
                    dayEvents.map((event) => {
                      const timeStatus = getEventTimeStatus(event.startDate);
                      const opacity = timeStatus === "past" ? "opacity-50" : "";
                      const eventDate = new Date(event.startDate);

                      return (
                        <div
                          key={event.id}
                          className={`p-2 rounded-md text-white text-xs lg:text-sm cursor-pointer hover:opacity-80 transition-all ${
                            categoryColors[
                              event.category as keyof typeof categoryColors
                            ]
                          } ${opacity}`}
                          onClick={(e) => handleEventClick(event, e)}
                        >
                          <div className="font-medium truncate">
                            {event.title}
                          </div>
                          {!event.isAllDay && (
                            <div className="flex items-center gap-1 mt-1 opacity-90">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">
                                {formatTime(eventDate)}
                              </span>
                            </div>
                          )}
                          {event.isAllDay && (
                            <div className="text-xs opacity-90 mt-1">
                              Todo el día
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={onEditEvent}
        onDelete={onDeleteEvent}
        categoryColors={categoryColors}
        categoryLabels={categoryLabels}
        getEventTimeStatus={getEventTimeStatus}
      />
    </Card>
  );
}
