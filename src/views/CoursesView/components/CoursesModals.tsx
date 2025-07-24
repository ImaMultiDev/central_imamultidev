"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Course, CourseStatus } from "@/types";

interface NewCourse {
  title: string;
  description: string;
  platform: string;
  url: string;
  notes: string;
  status: CourseStatus;
}

interface CoursesModalsProps {
  isCourseModalOpen: boolean;
  onCourseModalClose: () => void;
  isEditModalOpen: boolean;
  onEditModalClose: () => void;
  newCourse: NewCourse;
  onNewCourseChange: (course: NewCourse) => void;
  editingCourse: Course | null;
  onEditingCourseChange: (course: Course | null) => void;
  onCreateCourse: () => void;
  onUpdateCourse: () => void;
}

export function CoursesModals({
  isCourseModalOpen,
  onCourseModalClose,
  isEditModalOpen,
  onEditModalClose,
  newCourse,
  onNewCourseChange,
  editingCourse,
  onEditingCourseChange,
  onCreateCourse,
  onUpdateCourse,
}: CoursesModalsProps) {
  return (
    <>
      {/* Course Modal */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={onCourseModalClose}
        title="Añadir Nuevo Curso"
        className="max-w-md"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onCreateCourse();
          }}
        >
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Título
            </label>
            <Input
              placeholder="Título del curso"
              value={newCourse.title}
              onChange={(e) =>
                onNewCourseChange({ ...newCourse, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Descripción
            </label>
            <Input
              placeholder="Descripción del curso"
              value={newCourse.description}
              onChange={(e) =>
                onNewCourseChange({ ...newCourse, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Plataforma
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground"
                value={newCourse.platform}
                onChange={(e) =>
                  onNewCourseChange({ ...newCourse, platform: e.target.value })
                }
              >
                <option value="">Seleccionar plataforma</option>
                <option value="UDEMY">Udemy</option>
                <option value="COURSERA">Coursera</option>
                <option value="YOUTUBE">YouTube</option>
                <option value="PLATZI">Platzi</option>
                <option value="OTRA">Otra</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Estado
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground"
                value={newCourse.status}
                onChange={(e) =>
                  onNewCourseChange({
                    ...newCourse,
                    status: e.target.value as CourseStatus,
                  })
                }
              >
                <option value="POR_COMENZAR">Por Comenzar</option>
                <option value="EN_PROGRESO">En Progreso</option>
                <option value="COMPLETADO">Completado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              URL del curso
            </label>
            <Input
              placeholder="https://..."
              type="url"
              value={newCourse.url}
              onChange={(e) =>
                onNewCourseChange({ ...newCourse, url: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Notas
            </label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground"
              placeholder="Notas sobre el curso..."
              value={newCourse.notes}
              onChange={(e) =>
                onNewCourseChange({ ...newCourse, notes: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 hover:bg-green-500 hover:text-white transition-colors duration-300"
            >
              Añadir Curso
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCourseModalClose}
              className="text-white hover:text-red-500 transition-colors duration-300"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        title="Editar Curso"
        className="max-w-md"
      >
        {editingCourse && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateCourse();
            }}
          >
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título
              </label>
              <Input
                placeholder="Título del curso"
                value={editingCourse.title}
                onChange={(e) =>
                  onEditingCourseChange({
                    ...editingCourse,
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
                placeholder="Descripción del curso"
                value={editingCourse.description || ""}
                onChange={(e) =>
                  onEditingCourseChange({
                    ...editingCourse,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Plataforma
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground"
                  value={editingCourse.platform}
                  onChange={(e) =>
                    onEditingCourseChange({
                      ...editingCourse,
                      platform: e.target.value,
                    })
                  }
                >
                  <option value="UDEMY">Udemy</option>
                  <option value="COURSERA">Coursera</option>
                  <option value="YOUTUBE">YouTube</option>
                  <option value="PLATZI">Platzi</option>
                  <option value="OTRA">Otra</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Estado
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground"
                  value={editingCourse.status}
                  onChange={(e) =>
                    onEditingCourseChange({
                      ...editingCourse,
                      status: e.target.value as CourseStatus,
                    })
                  }
                >
                  <option value="POR_COMENZAR">Por Comenzar</option>
                  <option value="EN_PROGRESO">En Progreso</option>
                  <option value="COMPLETADO">Completado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                URL del curso
              </label>
              <Input
                placeholder="https://..."
                type="url"
                value={editingCourse.url || ""}
                onChange={(e) =>
                  onEditingCourseChange({
                    ...editingCourse,
                    url: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Notas
              </label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground"
                placeholder="Notas sobre el curso..."
                value={editingCourse.notes || ""}
                onChange={(e) =>
                  onEditingCourseChange({
                    ...editingCourse,
                    notes: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 hover:bg-green-500 hover:text-white transition-colors duration-300"
              >
                Actualizar Curso
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onEditModalClose}
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
