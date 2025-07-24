"use client";

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
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Próximos Eventos</CardTitle>
        <CardDescription>
          Tus eventos y tareas programadas para los próximos días
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
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
          {events.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No tienes eventos próximos programados
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
