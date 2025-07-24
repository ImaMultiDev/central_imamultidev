"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Event as CalendarEvent, EventCategory } from "@/types";

interface EventModalsProps {
  isEventModalOpen: boolean;
  isEditEventModalOpen: boolean;
  editingEvent: CalendarEvent | null;
  newEvent: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date | null;
    category: EventCategory;
    isAllDay: boolean;
  };
  onCloseEventModal: () => void;
  onCloseEditModal: () => void;
  onCreateEvent: () => void;
  onUpdateEvent: () => void;
  onNewEventChange: (event: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date | null;
    category: EventCategory;
    isAllDay: boolean;
  }) => void;
  onEditingEventChange: (event: CalendarEvent) => void;
  formatDateForInput: (date: Date | string, isAllDay: boolean) => string;
}

export function EventModals({
  isEventModalOpen,
  isEditEventModalOpen,
  editingEvent,
  newEvent,
  onCloseEventModal,
  onCloseEditModal,
  onCreateEvent,
  onUpdateEvent,
  onNewEventChange,
  onEditingEventChange,
  formatDateForInput,
}: EventModalsProps) {
  return (
    <>
      {/* Event Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={onCloseEventModal}
        title="Crear Nuevo Evento"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onCreateEvent();
          }}
        >
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Título
            </label>
            <Input
              placeholder="Título del evento"
              value={newEvent.title}
              onChange={(e) =>
                onNewEventChange({ ...newEvent, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Descripción
            </label>
            <Input
              placeholder="Descripción (opcional)"
              value={newEvent.description}
              onChange={(e) =>
                onNewEventChange({ ...newEvent, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAllDay"
              checked={newEvent.isAllDay}
              onChange={(e) => {
                const isAllDay = e.target.checked;
                onNewEventChange({
                  ...newEvent,
                  isAllDay,
                  endDate: isAllDay ? null : newEvent.endDate,
                });
              }}
              className="rounded border-input"
            />
            <label htmlFor="isAllDay" className="text-sm text-foreground">
              Todo el día
            </label>
          </div>

          <div
            className={
              newEvent.isAllDay
                ? "grid grid-cols-1 gap-4"
                : "grid grid-cols-1 lg:grid-cols-2 gap-4"
            }
          >
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Fecha de inicio
              </label>
              <div className="relative">
                <Input
                  type={newEvent.isAllDay ? "date" : "datetime-local"}
                  value={formatDateForInput(
                    newEvent.startDate,
                    newEvent.isAllDay
                  )}
                  onChange={(e) => {
                    let date: Date;
                    if (newEvent.isAllDay) {
                      const [year, month, day] = e.target.value
                        .split("-")
                        .map(Number);
                      date = new Date(year, month - 1, day);
                    } else {
                      date = new Date(e.target.value);
                    }
                    onNewEventChange({ ...newEvent, startDate: date });
                  }}
                  className="w-full pr-10"
                />
              </div>
            </div>
            {!newEvent.isAllDay && (
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Fecha de fin (opcional)
                </label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    value={
                      newEvent.endDate
                        ? formatDateForInput(newEvent.endDate, false)
                        : ""
                    }
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      onNewEventChange({ ...newEvent, endDate: date });
                    }}
                    className="w-full pr-10"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Categoría
            </label>
            <select
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer relative"
              value={newEvent.category}
              onChange={(e) =>
                onNewEventChange({
                  ...newEvent,
                  category: e.target.value as EventCategory,
                })
              }
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="TRABAJO">Trabajo</option>
              <option value="PERSONAL">Personal</option>
              <option value="ESTUDIO">Estudio</option>
              <option value="SALUD">Salud</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 hover:bg-green-500 hover:text-white transition-colors duration-300"
            >
              Crear Evento
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCloseEventModal}
              className="text-white hover:text-red-500 transition-colors duration-300"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={isEditEventModalOpen}
        onClose={onCloseEditModal}
        title="Editar Evento"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        {editingEvent && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateEvent();
            }}
          >
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título
              </label>
              <Input
                placeholder="Título del evento"
                value={editingEvent.title}
                onChange={(e) =>
                  onEditingEventChange({
                    ...editingEvent,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Descripción
              </label>
              <Input
                placeholder="Descripción (opcional)"
                value={editingEvent.description || ""}
                onChange={(e) =>
                  onEditingEventChange({
                    ...editingEvent,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editIsAllDay"
                checked={editingEvent.isAllDay}
                onChange={(e) => {
                  const isAllDay = e.target.checked;
                  onEditingEventChange({
                    ...editingEvent,
                    isAllDay,
                    endDate: isAllDay ? undefined : editingEvent.endDate,
                  });
                }}
                className="rounded border-input"
              />
              <label htmlFor="editIsAllDay" className="text-sm text-foreground">
                Todo el día
              </label>
            </div>

            <div
              className={
                editingEvent.isAllDay
                  ? "grid grid-cols-1 gap-4"
                  : "grid grid-cols-1 lg:grid-cols-2 gap-4"
              }
            >
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Fecha de inicio
                </label>
                <div className="relative">
                  <Input
                    type={editingEvent.isAllDay ? "date" : "datetime-local"}
                    value={formatDateForInput(
                      editingEvent.startDate,
                      editingEvent.isAllDay
                    )}
                    onChange={(e) => {
                      let date: Date;
                      if (editingEvent.isAllDay) {
                        const [year, month, day] = e.target.value
                          .split("-")
                          .map(Number);
                        date = new Date(year, month - 1, day);
                      } else {
                        date = new Date(e.target.value);
                      }
                      onEditingEventChange({
                        ...editingEvent,
                        startDate: date,
                      });
                    }}
                    className="w-full pr-10"
                  />
                </div>
              </div>
              {!editingEvent.isAllDay && (
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Fecha de fin (opcional)
                  </label>
                  <div className="relative">
                    <Input
                      type="datetime-local"
                      value={
                        editingEvent.endDate
                          ? formatDateForInput(editingEvent.endDate, false)
                          : ""
                      }
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        onEditingEventChange({
                          ...editingEvent,
                          endDate: date,
                        });
                      }}
                      className="w-full pr-10"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Categoría
              </label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer relative"
                value={editingEvent.category}
                onChange={(e) =>
                  onEditingEventChange({
                    ...editingEvent,
                    category: e.target.value as EventCategory,
                  })
                }
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="TRABAJO">Trabajo</option>
                <option value="PERSONAL">Personal</option>
                <option value="ESTUDIO">Estudio</option>
                <option value="SALUD">Salud</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 hover:bg-green-500 hover:text-white transition-colors duration-300"
              >
                Actualizar Evento
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCloseEditModal}
                className="text-white hover:text-red-500 transition-colors duration-300"
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
