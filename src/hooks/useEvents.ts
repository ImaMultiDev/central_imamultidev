import { useState, useEffect } from "react";
import { Event, EventCategory } from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

// Tipo para los datos que vienen de la API (con fechas como strings)
type ApiEvent = Omit<
  Event,
  "startDate" | "endDate" | "createdAt" | "updatedAt"
> & {
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};

// Función helper para convertir fechas de string a Date
const parseEventDates = (event: ApiEvent): Event => ({
  ...event,
  startDate: new Date(event.startDate),
  endDate: event.endDate ? new Date(event.endDate) : undefined,
  createdAt: new Date(event.createdAt),
  updatedAt: new Date(event.updatedAt),
});

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar eventos
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/events");
      const data = await handleApiResponse<ApiEvent[]>(response);
      // Convertir fechas de string a Date objects
      const eventsWithDates = data.map(parseEventDates);
      setEvents(eventsWithDates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Crear evento
  const createEvent = async (eventData: {
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    category: EventCategory;
    isAllDay?: boolean;
  }) => {
    try {
      const response = await apiRequest("/api/events", {
        method: "POST",
        body: JSON.stringify(eventData),
      });

      const newEvent = await handleApiResponse<ApiEvent>(response);
      const eventWithDates = parseEventDates(newEvent);
      setEvents((prev) => [...prev, eventWithDates]);
      return eventWithDates;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Actualizar evento
  const updateEvent = async (
    id: string,
    eventData: {
      title: string;
      description?: string;
      startDate: string;
      endDate?: string;
      category: EventCategory;
      isAllDay?: boolean;
    }
  ) => {
    try {
      const response = await apiRequest(`/api/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(eventData),
      });

      const updatedEvent = await handleApiResponse<ApiEvent>(response);
      const eventWithDates = parseEventDates(updatedEvent);
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? eventWithDates : event))
      );
      return eventWithDates;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Eliminar evento
  const deleteEvent = async (id: string) => {
    try {
      const response = await apiRequest(`/api/events/${id}`, {
        method: "DELETE",
      });

      await handleApiResponse(response);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Cargar eventos al montar el componente
  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}
