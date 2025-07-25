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
  tags: string[];
  tagsInput: string;
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
  isCreating: boolean;
  isUpdating: boolean;
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
  isCreating,
  isUpdating,
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
        className="max-w-md max-h-[90vh] overflow-y-auto"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-sm font-medium text-foreground block mb-2">
                Plataforma
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
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
            <div className="relative">
              <label className="text-sm font-medium text-foreground block mb-2">
                Estado
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
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

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Tags
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="react, javascript, tutorial (separados por comas)"
                value={newCourse.tagsInput || ""}
                onChange={(e) =>
                  onNewCourseChange({
                    ...newCourse,
                    tagsInput: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const inputValue = newCourse.tagsInput || "";
                    const tags = inputValue
                      .split(",")
                      .map((tag: string) => tag.trim().toLowerCase())
                      .filter((tag: string) => tag.length > 0)
                      .filter(
                        (tag: string) =>
                          !newCourse.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onNewCourseChange({
                        ...newCourse,
                        tags: [...newCourse.tags, ...tags],
                        tagsInput: "",
                      });
                    } else {
                      onNewCourseChange({
                        ...newCourse,
                        tagsInput: "",
                      });
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="hover:bg-blue-500 text-white transition-colors duration-300"
                size="sm"
                onClick={() => {
                  const inputValue = newCourse.tagsInput || "";
                  const tags = inputValue
                    .split(",")
                    .map((tag: string) => tag.trim().toLowerCase())
                    .filter((tag: string) => tag.length > 0)
                    .filter(
                      (tag: string) =>
                        !newCourse.tags
                          .map((t) => t.toLowerCase())
                          .includes(tag)
                    );

                  if (tags.length > 0) {
                    onNewCourseChange({
                      ...newCourse,
                      tags: [...newCourse.tags, ...tags],
                      tagsInput: "",
                    });
                  } else {
                    onNewCourseChange({
                      ...newCourse,
                      tagsInput: "",
                    });
                  }
                }}
              >
                Añadir
              </Button>
            </div>
            {newCourse.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {newCourse.tags.map((tag, index) => (
                  <span
                    key={`new-tag-${index}-${tag}`}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        onNewCourseChange({
                          ...newCourse,
                          tags: newCourse.tags.filter((_, i) => i !== index),
                        });
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Escribe los tags y presiona Enter o el botón Añadir. Los tags
              duplicados se ignorarán.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="submit"
              disabled={isCreating}
              className="flex-1 hover:bg-blue-500 hover:text-white transition-colors duration-300"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                "Añadir Curso"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isCreating}
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
        className="max-w-md max-h-[90vh] overflow-y-auto"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Plataforma
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
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
              <div className="relative">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Estado
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
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

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Tags
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="react, javascript, tutorial (separados por comas)"
                  value={editingCourse.tagsInput || ""}
                  onChange={(e) =>
                    onEditingCourseChange({
                      ...editingCourse,
                      tagsInput: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const inputValue = editingCourse.tagsInput || "";
                      const tags = inputValue
                        .split(",")
                        .map((tag: string) => tag.trim().toLowerCase())
                        .filter((tag: string) => tag.length > 0)
                        .filter(
                          (tag: string) =>
                            !editingCourse.tags
                              .map((t) => t.toLowerCase())
                              .includes(tag)
                        );

                      if (tags.length > 0) {
                        onEditingCourseChange({
                          ...editingCourse,
                          tags: [...editingCourse.tags, ...tags],
                          tagsInput: "",
                        });
                      } else {
                        onEditingCourseChange({
                          ...editingCourse,
                          tagsInput: "",
                        });
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  className="flex hover:bg-blue-500 hover:text-white transition-colors duration-300"
                  onClick={() => {
                    const inputValue = editingCourse.tagsInput || "";
                    const tags = inputValue
                      .split(",")
                      .map((tag: string) => tag.trim().toLowerCase())
                      .filter((tag: string) => tag.length > 0)
                      .filter(
                        (tag: string) =>
                          !editingCourse.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onEditingCourseChange({
                        ...editingCourse,
                        tags: [...editingCourse.tags, ...tags],
                        tagsInput: "",
                      });
                    } else {
                      onEditingCourseChange({
                        ...editingCourse,
                        tagsInput: "",
                      });
                    }
                  }}
                >
                  Añadir
                </Button>
              </div>
              {editingCourse.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {editingCourse.tags.map((tag, index) => (
                    <span
                      key={`edit-tag-${index}-${tag}`}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          onEditingCourseChange({
                            ...editingCourse,
                            tags: editingCourse.tags.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Escribe los tags y presiona Enter o el botón Añadir. Los tags
                duplicados se ignorarán.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="submit"
                disabled={isUpdating}
                className="flex-1 hover:bg-green-500 hover:text-white transition-colors duration-300"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Curso"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isUpdating}
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
