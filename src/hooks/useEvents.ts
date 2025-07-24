import { useState, useEffect } from "react";
import { Event, EventCategory } from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar eventos
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/events");
      const data = await handleApiResponse<Event[]>(response);
      setEvents(data);
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

      const newEvent = await handleApiResponse<Event>(response);
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
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

      const updatedEvent = await handleApiResponse<Event>(response);
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? updatedEvent : event))
      );
      return updatedEvent;
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
