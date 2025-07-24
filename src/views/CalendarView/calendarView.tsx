"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Event as CalendarEvent, EventCategory } from "@/types";
import { useEvents } from "@/hooks/useEvents";
import { CalendarGrid } from "./components/CalendarGrid";
import { WeekView } from "./components/WeekView";
import { DayView } from "./components/DayView";
import { UpcomingEvents } from "./components/UpcomingEvents";
import { EventStats } from "./components/EventStats";
import { CategoryFilters } from "./components/CategoryFilters";
import { EventModals } from "./components/EventModals";
import { ViewControls, type CalendarViewType } from "./components/ViewControls";

const categoryColors = {
  TRABAJO: "bg-blue-500",
  PERSONAL: "bg-green-500",
  ESTUDIO: "bg-purple-500",
  SALUD: "bg-red-500",
};

const categoryLabels = {
  TRABAJO: "Trabajo",
  PERSONAL: "Personal",
  ESTUDIO: "Estudio",
  SALUD: "Salud",
};

export function CalendarView() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarViewType>("month");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: null as Date | null,
    category: "TRABAJO" as EventCategory,
    isAllDay: false,
  });

  const { events, createEvent, updateEvent, deleteEvent } = useEvents();

  // Función para formatear fechas correctamente
  const formatDateForInput = (date: Date | string, isAllDay: boolean) => {
    // Asegurar que date sea un objeto Date
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isAllDay) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } else {
      const localDate = new Date(
        dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
      );
      return localDate.toISOString().slice(0, 16);
    }
  };

  // Actualizar la hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Función para clasificar eventos por tiempo
  const getEventTimeStatus = (eventDate: Date | string) => {
    const eventTime = new Date(eventDate).getTime();
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000 - 1;

    if (eventTime < todayStart) return "past";
    if (eventTime >= todayStart && eventTime <= todayEnd) return "today";
    return "future";
  };

  const handleCreateEvent = async () => {
    try {
      await createEvent({
        ...newEvent,
        startDate: newEvent.startDate.toISOString(),
        endDate: newEvent.endDate?.toISOString(),
      });
      setIsEventModalOpen(false);
      setNewEvent({
        title: "",
        description: "",
        startDate: new Date(),
        endDate: null,
        category: "TRABAJO" as EventCategory,
        isAllDay: false,
      });
    } catch (error) {
      console.error("Error al crear evento:", error);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsEditEventModalOpen(true);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    try {
      await updateEvent(editingEvent.id, {
        title: editingEvent.title,
        description: editingEvent.description || "",
        startDate: editingEvent.startDate.toISOString(),
        endDate: editingEvent.endDate?.toISOString(),
        category: editingEvent.category,
        isAllDay: editingEvent.isAllDay,
      });
      setIsEditEventModalOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Error al actualizar evento:", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este evento?")) return;

    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error("Error al eliminar evento:", error);
    }
  };

  const renderCalendarView = () => {
    const commonProps = {
      events,
      selectedCategory,
      getEventTimeStatus,
      categoryColors,
      categoryLabels,
      onEditEvent: handleEditEvent,
      onDeleteEvent: handleDeleteEvent,
    };

    switch (currentView) {
      case "month":
        return <CalendarGrid {...commonProps} />;
      case "week":
        return <WeekView {...commonProps} />;
      case "day":
        return <DayView {...commonProps} />;
      default:
        return <CalendarGrid {...commonProps} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
          <p className="text-muted-foreground">
            Gestiona tus eventos, tareas y recordatorios
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">
                Hoy:{" "}
                {currentTime.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="text-muted-foreground">
              {currentTime.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ViewControls
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          <Button onClick={() => setIsEventModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Evento
          </Button>
        </div>
      </div>

      {/* Stats */}
      <EventStats events={events} getEventTimeStatus={getEventTimeStatus} />

      {/* Filtros */}
      <CategoryFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categoryColors={categoryColors}
        categoryLabels={categoryLabels}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar View */}
        {renderCalendarView()}

        {/* Upcoming Events */}
        <UpcomingEvents
          events={events}
          selectedCategory={selectedCategory}
          getEventTimeStatus={getEventTimeStatus}
          categoryColors={categoryColors}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>

      {/* Modals */}
      <EventModals
        isEventModalOpen={isEventModalOpen}
        isEditEventModalOpen={isEditEventModalOpen}
        editingEvent={editingEvent}
        newEvent={newEvent}
        onCloseEventModal={() => setIsEventModalOpen(false)}
        onCloseEditModal={() => {
          setIsEditEventModalOpen(false);
          setEditingEvent(null);
        }}
        onCreateEvent={handleCreateEvent}
        onUpdateEvent={handleUpdateEvent}
        onNewEventChange={setNewEvent}
        onEditingEventChange={setEditingEvent}
        formatDateForInput={formatDateForInput}
      />
    </div>
  );
}
