"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Event } from "@/types";

interface DashboardEventsProps {
  events: Event[];
}

export function DashboardEvents({ events }: DashboardEventsProps) {
  const now = useMemo(() => new Date(), []);

  const upcomingEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate >= now; // Solo eventos futuros
      })
      .sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA.getTime() - dateB.getTime(); // Ordenar por fecha más próxima
      })
      .slice(0, 5); // Limitar a 5 eventos
  }, [events, now]);

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Próximos Eventos</CardTitle>
        <CardDescription>
          Tus eventos y tareas programadas para los próximos días
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center space-x-4 rounded-lg border p-4"
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {event.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(event.startDate)} a las{" "}
                  {formatTime(event.startDate)}
                </p>
              </div>
              <div className="rounded-full px-2 py-1 text-xs font-medium bg-secondary">
                {event.category}
              </div>
            </div>
          ))}
          {upcomingEvents.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No tienes eventos próximos programados
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
