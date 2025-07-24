"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event as CalendarEvent } from "@/types";
import { EventDetailModal } from "./EventDetailModal";

interface CalendarGridProps {
  events: CalendarEvent[];
  selectedCategory: string;
  getEventTimeStatus: (eventDate: Date | string) => string;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function CalendarGrid({
  events,
  selectedCategory,
  getEventTimeStatus,
  categoryColors,
  categoryLabels,
  onEditEvent,
  onDeleteEvent,
}: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
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

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

  const calendarDays = [];
  const currentDateIter = new Date(startDate);

  while (currentDateIter <= endDate) {
    calendarDays.push(new Date(currentDateIter));
    currentDateIter.setDate(currentDateIter.getDate() + 1);
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {monthNames[month]} {year}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Este Mes
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === today.toDateString();
            const dayEvents = getEventsForDate(date);

            return (
              <div
                key={index}
                className={`
                    h-[120px] p-2 border rounded-lg cursor-pointer transition-all duration-300
                    ${
                      isCurrentMonth
                        ? isToday
                          ? "bg-blue-500/10 border-blue-500/30 shadow-lg"
                          : "bg-card hover:bg-accent/50"
                        : "bg-muted/30 text-muted-foreground"
                    }
                    ${
                      isToday
                        ? "ring-2 ring-blue-500/30"
                        : "border-border hover:border-muted-foreground"
                    }
                  `}
                onClick={() => {
                  // TODO: Implementar selección de fecha
                }}
              >
                <div
                  className={`text-sm font-medium flex items-center justify-center mb-2 ${
                    isToday
                      ? "text-blue-600 font-bold"
                      : isCurrentMonth
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {date.getDate()}
                </div>
                <div className="space-y-1 h-[80px] overflow-y-auto">
                  {dayEvents.length === 0 ? (
                    <div className="text-xs text-muted-foreground opacity-50 text-center py-2">
                      Sin eventos
                    </div>
                  ) : (
                    dayEvents.slice(0, 3).map((event) => {
                      const timeStatus = getEventTimeStatus(event.startDate);
                      const opacity = timeStatus === "past" ? "opacity-50" : "";

                      return (
                        <div
                          key={event.id}
                          className={`text-xs p-1.5 rounded-md text-white truncate transition-all cursor-pointer hover:opacity-80 ${
                            categoryColors[
                              event.category as keyof typeof categoryColors
                            ]
                          } ${opacity}`}
                          onClick={(e) => handleEventClick(event, e)}
                        >
                          {event.title}
                        </div>
                      );
                    })
                  )}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground pt-1 text-center">
                      +{dayEvents.length - 3} más
                    </div>
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
