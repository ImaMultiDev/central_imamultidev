import { useState, useEffect } from "react";
import { Event, EventCategory } from "@/types";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar eventos
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Error al cargar eventos");
      }
      const data = await response.json();
      // Convertir las fechas de string a Date
      const eventsWithDates = data.map(
        (
          event: Event & {
            startDate: string;
            endDate?: string;
            createdAt: string;
            updatedAt: string;
          }
        ) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: event.endDate ? new Date(event.endDate) : null,
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
        })
      );
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
    startDate: Date;
    endDate?: Date;
    category: EventCategory;
    isAllDay?: boolean;
  }) => {
    // Convertir fechas a ISO string para evitar problemas de zona horaria
    const eventDataToSend = {
      ...eventData,
      startDate: eventData.startDate.toISOString(),
      endDate: eventData.endDate?.toISOString(),
    };
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDataToSend),
      });

      if (!response.ok) {
        throw new Error("Error al crear evento");
      }

      const newEvent = await response.json();
      // Convertir las fechas del nuevo evento
      const eventWithDates = {
        ...newEvent,
        startDate: new Date(newEvent.startDate),
        endDate: newEvent.endDate ? new Date(newEvent.endDate) : null,
        createdAt: new Date(newEvent.createdAt),
        updatedAt: new Date(newEvent.updatedAt),
      };
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
      startDate: Date;
      endDate?: Date;
      category: EventCategory;
      isAllDay?: boolean;
    }
  ) => {
    // Convertir fechas a ISO string para evitar problemas de zona horaria
    const eventDataToSend = {
      ...eventData,
      startDate: eventData.startDate.toISOString(),
      endDate: eventData.endDate?.toISOString(),
    };
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDataToSend),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar evento");
      }

      const updatedEvent = await response.json();
      // Convertir las fechas del evento actualizado
      const eventWithDates = {
        ...updatedEvent,
        startDate: new Date(updatedEvent.startDate),
        endDate: updatedEvent.endDate ? new Date(updatedEvent.endDate) : null,
        createdAt: new Date(updatedEvent.createdAt),
        updatedAt: new Date(updatedEvent.updatedAt),
      };
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
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar evento");
      }

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
