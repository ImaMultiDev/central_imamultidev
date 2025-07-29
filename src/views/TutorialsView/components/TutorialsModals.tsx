"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Tutorial, TutorialStatus } from "@/types";

interface NewTutorial {
  title: string;
  description: string;
  platform: string;
  url: string;
  docsUrl: string;
  notes: string;
  tags: string[];
  tagsInput: string;
  status: TutorialStatus;
}

interface TutorialsModalsProps {
  isTutorialModalOpen: boolean;
  onTutorialModalClose: () => void;
  isEditModalOpen: boolean;
  onEditModalClose: () => void;
  newTutorial: NewTutorial;
  onNewTutorialChange: (tutorial: NewTutorial) => void;
  editingTutorial: Tutorial | null;
  onEditingTutorialChange: (tutorial: Tutorial | null) => void;
  isCreating: boolean;
  isUpdating: boolean;
  onCreateTutorial: () => void;
  onUpdateTutorial: () => void;
}

export function TutorialsModals({
  isTutorialModalOpen,
  onTutorialModalClose,
  isEditModalOpen,
  onEditModalClose,
  newTutorial,
  onNewTutorialChange,
  editingTutorial,
  onEditingTutorialChange,
  isCreating,
  isUpdating,
  onCreateTutorial,
  onUpdateTutorial,
}: TutorialsModalsProps) {
  return (
    <>
      {/* Tutorial Modal */}
      <Modal
        isOpen={isTutorialModalOpen}
        onClose={onTutorialModalClose}
        title="Añadir Nuevo Tutorial"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onCreateTutorial();
          }}
        >
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Título
            </label>
            <Input
              placeholder="Título del tutorial"
              value={newTutorial.title}
              onChange={(e) =>
                onNewTutorialChange({ ...newTutorial, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Descripción
            </label>
            <Input
              placeholder="Descripción del tutorial"
              value={newTutorial.description}
              onChange={(e) =>
                onNewTutorialChange({
                  ...newTutorial,
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
                value={newTutorial.platform}
                onChange={(e) =>
                  onNewTutorialChange({
                    ...newTutorial,
                    platform: e.target.value,
                  })
                }
              >
                <option value="">Seleccionar plataforma</option>
                <option value="YOUTUBE">YouTube</option>
                <option value="UDEMY">Udemy</option>
                <option value="COURSERA">Coursera</option>
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
                value={newTutorial.status}
                onChange={(e) =>
                  onNewTutorialChange({
                    ...newTutorial,
                    status: e.target.value as TutorialStatus,
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
              URL del tutorial
            </label>
            <Input
              placeholder="https://..."
              type="url"
              value={newTutorial.url}
              onChange={(e) =>
                onNewTutorialChange({ ...newTutorial, url: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              URL de documentación (opcional)
            </label>
            <Input
              placeholder="https://drive.google.com/..."
              type="url"
              value={newTutorial.docsUrl}
              onChange={(e) =>
                onNewTutorialChange({ ...newTutorial, docsUrl: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Notas
            </label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground"
              placeholder="Notas sobre el tutorial..."
              value={newTutorial.notes}
              onChange={(e) =>
                onNewTutorialChange({ ...newTutorial, notes: e.target.value })
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
                value={newTutorial.tagsInput || ""}
                onChange={(e) =>
                  onNewTutorialChange({
                    ...newTutorial,
                    tagsInput: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const inputValue = newTutorial.tagsInput || "";
                    const tags = inputValue
                      .split(",")
                      .map((tag: string) => tag.trim().toLowerCase())
                      .filter((tag: string) => tag.length > 0)
                      .filter(
                        (tag: string) =>
                          !newTutorial.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onNewTutorialChange({
                        ...newTutorial,
                        tags: [...newTutorial.tags, ...tags],
                        tagsInput: "",
                      });
                    } else {
                      onNewTutorialChange({
                        ...newTutorial,
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
                  const inputValue = newTutorial.tagsInput || "";
                  const tags = inputValue
                    .split(",")
                    .map((tag: string) => tag.trim().toLowerCase())
                    .filter((tag: string) => tag.length > 0)
                    .filter(
                      (tag: string) =>
                        !newTutorial.tags
                          .map((t) => t.toLowerCase())
                          .includes(tag)
                    );

                  if (tags.length > 0) {
                    onNewTutorialChange({
                      ...newTutorial,
                      tags: [...newTutorial.tags, ...tags],
                      tagsInput: "",
                    });
                  } else {
                    onNewTutorialChange({
                      ...newTutorial,
                      tagsInput: "",
                    });
                  }
                }}
              >
                Añadir
              </Button>
            </div>
            {newTutorial.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {newTutorial.tags.map((tag, index) => (
                  <span
                    key={`new-tag-${index}-${tag}`}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        onNewTutorialChange({
                          ...newTutorial,
                          tags: newTutorial.tags.filter((_, i) => i !== index),
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
                "Añadir Tutorial"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isCreating}
              onClick={onTutorialModalClose}
              className="text-white hover:text-red-500 transition-colors duration-300"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Tutorial Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        title="Editar Tutorial"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        {editingTutorial && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateTutorial();
            }}
          >
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título
              </label>
              <Input
                placeholder="Título del tutorial"
                value={editingTutorial.title}
                onChange={(e) =>
                  onEditingTutorialChange({
                    ...editingTutorial,
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
                placeholder="Descripción del tutorial"
                value={editingTutorial.description || ""}
                onChange={(e) =>
                  onEditingTutorialChange({
                    ...editingTutorial,
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
                  value={editingTutorial.platform}
                  onChange={(e) =>
                    onEditingTutorialChange({
                      ...editingTutorial,
                      platform: e.target.value,
                    })
                  }
                >
                  <option value="YOUTUBE">YouTube</option>
                  <option value="UDEMY">Udemy</option>
                  <option value="COURSERA">Coursera</option>
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
                  value={editingTutorial.status}
                  onChange={(e) =>
                    onEditingTutorialChange({
                      ...editingTutorial,
                      status: e.target.value as TutorialStatus,
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
                URL del tutorial
              </label>
              <Input
                placeholder="https://..."
                type="url"
                value={editingTutorial.url || ""}
                onChange={(e) =>
                  onEditingTutorialChange({
                    ...editingTutorial,
                    url: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                URL de documentación (opcional)
              </label>
              <Input
                placeholder="https://drive.google.com/..."
                type="url"
                value={editingTutorial.docsUrl || ""}
                onChange={(e) =>
                  onEditingTutorialChange({
                    ...editingTutorial,
                    docsUrl: e.target.value,
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
                placeholder="Notas sobre el tutorial..."
                value={editingTutorial.notes || ""}
                onChange={(e) =>
                  onEditingTutorialChange({
                    ...editingTutorial,
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
                  value={editingTutorial.tagsInput || ""}
                  onChange={(e) =>
                    onEditingTutorialChange({
                      ...editingTutorial,
                      tagsInput: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const inputValue = editingTutorial.tagsInput || "";
                      const tags = inputValue
                        .split(",")
                        .map((tag: string) => tag.trim().toLowerCase())
                        .filter((tag: string) => tag.length > 0)
                        .filter(
                          (tag: string) =>
                            !editingTutorial.tags
                              .map((t) => t.toLowerCase())
                              .includes(tag)
                        );

                      if (tags.length > 0) {
                        onEditingTutorialChange({
                          ...editingTutorial,
                          tags: [...editingTutorial.tags, ...tags],
                          tagsInput: "",
                        });
                      } else {
                        onEditingTutorialChange({
                          ...editingTutorial,
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
                    const inputValue = editingTutorial.tagsInput || "";
                    const tags = inputValue
                      .split(",")
                      .map((tag: string) => tag.trim().toLowerCase())
                      .filter((tag: string) => tag.length > 0)
                      .filter(
                        (tag: string) =>
                          !editingTutorial.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onEditingTutorialChange({
                        ...editingTutorial,
                        tags: [...editingTutorial.tags, ...tags],
                        tagsInput: "",
                      });
                    } else {
                      onEditingTutorialChange({
                        ...editingTutorial,
                        tagsInput: "",
                      });
                    }
                  }}
                >
                  Añadir
                </Button>
              </div>
              {editingTutorial.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {editingTutorial.tags.map((tag, index) => (
                    <span
                      key={`edit-tag-${index}-${tag}`}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          onEditingTutorialChange({
                            ...editingTutorial,
                            tags: editingTutorial.tags.filter(
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
                  "Actualizar Tutorial"
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
