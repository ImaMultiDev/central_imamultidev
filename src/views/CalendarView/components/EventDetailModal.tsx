"use client";

import { Clock, Calendar, Tag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Event as CalendarEvent } from "@/types";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
  getEventTimeStatus: (eventDate: Date | string) => string;
}

export function EventDetailModal({
  isOpen,
  onClose,
  event,
  onEdit,
  onDelete,
  categoryColors,
  categoryLabels,
  getEventTimeStatus,
}: EventDetailModalProps) {
  if (!event) return null;

  const timeStatus = getEventTimeStatus(event.startDate);
  const eventDate = new Date(event.startDate);

  const formatEventTime = (date: Date) => {
    if (event.isAllDay) {
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getStatusColor = () => {
    switch (timeStatus) {
      case "past":
        return "text-muted-foreground";
      case "today":
        return "text-blue-500";
      case "future":
        return "text-green-500";
      default:
        return "text-foreground";
    }
  };

  const getStatusText = () => {
    switch (timeStatus) {
      case "past":
        return "Evento pasado";
      case "today":
        return "Evento de hoy";
      case "future":
        return "Evento próximo";
      default:
        return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Evento"
      className="max-w-md"
    >
      <div className="space-y-4">
        {/* Header con título y acciones */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {event.title}
            </h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  categoryColors[event.category as keyof typeof categoryColors]
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {categoryLabels[event.category as keyof typeof categoryLabels]}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (
                  confirm("¿Estás seguro de que quieres eliminar este evento?")
                ) {
                  onDelete(event.id);
                  onClose();
                }
              }}
              className="text-red-600 hover:text-red-700"
            >
              Eliminar
            </Button>
          </div>
        </div>

        {/* Estado del evento */}
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>

        {/* Fecha y hora */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Fecha y hora</p>
              <p className="text-sm text-muted-foreground">
                {formatEventTime(eventDate)}
              </p>
              {event.isAllDay && (
                <p className="text-xs text-blue-500 mt-1">Todo el día</p>
              )}
            </div>
          </div>

          {event.endDate && (
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Fecha de fin</p>
                <p className="text-sm text-muted-foreground">
                  {formatEventTime(new Date(event.endDate))}
                </p>
              </div>
            </div>
          )}

          {/* Categoría */}
          <div className="flex items-start gap-3">
            <Tag className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Categoría</p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-3 h-3 rounded-full ${
                    categoryColors[
                      event.category as keyof typeof categoryColors
                    ]
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {
                    categoryLabels[
                      event.category as keyof typeof categoryLabels
                    ]
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {event.description && (
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Descripción</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {event.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cerrar
          </Button>
          <Button onClick={() => onEdit(event)} className="flex-1">
            Editar Evento
          </Button>
        </div>
      </div>
    </Modal>
  );
}
