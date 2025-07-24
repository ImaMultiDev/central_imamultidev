"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event as CalendarEvent } from "@/types";

interface EventStatsProps {
  events: CalendarEvent[];
  getEventTimeStatus: (eventDate: Date | string) => string;
}

export function EventStats({ events, getEventTimeStatus }: EventStatsProps) {
  // Estadísticas temporales
  const eventStats = events.reduce((acc, event) => {
    const status = getEventTimeStatus(event.startDate);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Eventos Pasados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground">
            {eventStats.past || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Eventos Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            {eventStats.today || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {eventStats.future || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{events.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}
