"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { WorkshopType, WorkshopCategory } from "@/types";
import { Workshop } from "@/types";

interface WorkshopModalsProps {
  isWorkshopModalOpen: boolean;
  isEditModalOpen: boolean;
  editingWorkshop: Workshop | null;
  newWorkshop: {
    title: string;
    description: string;
    url: string;
    type: WorkshopType;
    category: WorkshopCategory;
    tags: string[];
  };
  tempTagsInput: string;
  editingTagsInput: string;
  isCreating: boolean;
  isUpdating: boolean;
  onCloseWorkshopModal: () => void;
  onCloseEditModal: () => void;
  onCreateWorkshop: () => void;
  onUpdateWorkshop: () => void;
  onNewWorkshopChange: (doc: {
    title: string;
    description: string;
    url: string;
    type: WorkshopType;
    category: WorkshopCategory;
    tags: string[];
  }) => void;
  onEditingWorkshopChange: (doc: Workshop | null) => void;
  onTempTagsInputChange: (input: string) => void;
  onEditingTagsInputChange: (input: string) => void;
}

export function WorkshopModals({
  isWorkshopModalOpen,
  isEditModalOpen,
  editingWorkshop,
  newWorkshop,
  tempTagsInput,
  editingTagsInput,
  isCreating,
  isUpdating,
  onCloseWorkshopModal,
  onCloseEditModal,
  onCreateWorkshop,
  onUpdateWorkshop,
  onNewWorkshopChange,
  onEditingWorkshopChange,
  onTempTagsInputChange,
  onEditingTagsInputChange,
}: WorkshopModalsProps) {
  return (
    <>
      {/* Workshop Modal */}
      <Modal
        isOpen={isWorkshopModalOpen}
        onClose={onCloseWorkshopModal}
        title="Añadir Nueva Herramienta de Taller"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onCreateWorkshop();
          }}
        >
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Título
            </label>
            <Input
              placeholder="Título de la herramienta"
              value={newWorkshop.title}
              onChange={(e) =>
                onNewWorkshopChange({ ...newWorkshop, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Descripción
            </label>
            <Input
              placeholder="Descripción del recurso"
              value={newWorkshop.description}
              onChange={(e) =>
                onNewWorkshopChange({
                  ...newWorkshop,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              URL
            </label>
            <Input
              placeholder="https://..."
              type="url"
              value={newWorkshop.url}
              onChange={(e) =>
                onNewWorkshopChange({ ...newWorkshop, url: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-sm font-medium text-foreground block mb-2">
                Tipo
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                value={newWorkshop.type}
                onChange={(e) =>
                  onNewWorkshopChange({
                    ...newWorkshop,
                    type: e.target.value as WorkshopType,
                  })
                }
              >
                <option value="MULTIMEDIA_EDITING">Edición Multimedia</option>
                <option value="GRAPHIC_DESIGN">Diseño Gráfico</option>
                <option value="VIDEO_EDITING">Edición de Video</option>
                <option value="AUDIO_EDITING">Edición de Audio</option>
                <option value="3D_MODELING">Modelado 3D</option>
                <option value="ANIMATION">Animación</option>
              </select>
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-foreground block mb-2">
                Categoría
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                value={newWorkshop.category}
                onChange={(e) =>
                  onNewWorkshopChange({
                    ...newWorkshop,
                    category: e.target.value as WorkshopCategory,
                  })
                }
              >
                <option value="IMAGES">Imágenes</option>
                <option value="VIDEOS">Videos</option>
                <option value="AUDIO">Audio</option>
                <option value="3D">3D</option>
                <option value="ANIMATION">Animación</option>
                <option value="DESIGN">Diseño</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Tags
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="react, javascript, tutorial (separados por comas)"
                value={tempTagsInput}
                onChange={(e) => onTempTagsInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const inputValue = tempTagsInput;
                    const tags = inputValue
                      .split(",")
                      .map((tag: string) => tag.trim().toLowerCase())
                      .filter((tag: string) => tag.length > 0)
                      .filter(
                        (tag: string) =>
                          !newWorkshop.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onNewWorkshopChange({
                        ...newWorkshop,
                        tags: [...newWorkshop.tags, ...tags],
                      });
                      onTempTagsInputChange("");
                    } else {
                      onTempTagsInputChange("");
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
                  const inputValue = tempTagsInput;
                  const tags = inputValue
                    .split(",")
                    .map((tag: string) => tag.trim().toLowerCase())
                    .filter((tag: string) => tag.length > 0)
                    .filter(
                      (tag: string) =>
                        !newWorkshop.tags
                          .map((t) => t.toLowerCase())
                          .includes(tag)
                    );

                  if (tags.length > 0) {
                    onNewWorkshopChange({
                      ...newWorkshop,
                      tags: [...newWorkshop.tags, ...tags],
                    });
                    onTempTagsInputChange("");
                  } else {
                    onTempTagsInputChange("");
                  }
                }}
              >
                Añadir
              </Button>
            </div>
            {newWorkshop.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {newWorkshop.tags.map((tag, index) => (
                  <span
                    key={`new-tag-${index}-${tag}`}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        onNewWorkshopChange({
                          ...newWorkshop,
                          tags: newWorkshop.tags.filter((_, i) => i !== index),
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
              className="flex-1 hover:bg-green-500 hover:text-white transition-colors duration-300"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                "Añadir Herramienta"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isCreating}
              onClick={onCloseWorkshopModal}
              className="text-white hover:text-red-500 transition-colors duration-300"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Workshop Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        title="Editar Herramienta de Taller"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        {editingWorkshop && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateWorkshop();
            }}
          >
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título
              </label>
              <Input
                placeholder="Título de la herramienta"
                value={editingWorkshop.title}
                onChange={(e) =>
                  onEditingWorkshopChange({
                    ...editingWorkshop,
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
                placeholder="Descripción del recurso"
                value={editingWorkshop.description || ""}
                onChange={(e) =>
                  onEditingWorkshopChange({
                    ...editingWorkshop,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                URL
              </label>
              <Input
                placeholder="https://..."
                type="url"
                value={editingWorkshop.url}
                onChange={(e) =>
                  onEditingWorkshopChange({
                    ...editingWorkshop,
                    url: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Tipo
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={editingWorkshop.type}
                  onChange={(e) =>
                    onEditingWorkshopChange({
                      ...editingWorkshop,
                      type: e.target.value as WorkshopType,
                    })
                  }
                >
                  <option value="MULTIMEDIA_EDITING">Edición Multimedia</option>
                  <option value="GRAPHIC_DESIGN">Diseño Gráfico</option>
                  <option value="VIDEO_EDITING">Edición de Video</option>
                  <option value="AUDIO_EDITING">Edición de Audio</option>
                  <option value="3D_MODELING">Modelado 3D</option>
                  <option value="ANIMATION">Animación</option>
                </select>
              </div>
              <div className="relative">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Categoría
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={editingWorkshop.category}
                  onChange={(e) =>
                    onEditingWorkshopChange({
                      ...editingWorkshop,
                      category: e.target.value as WorkshopCategory,
                    })
                  }
                >
                  <option value="IMAGES">Imágenes</option>
                  <option value="VIDEOS">Videos</option>
                  <option value="AUDIO">Audio</option>
                  <option value="3D">3D</option>
                  <option value="ANIMATION">Animación</option>
                  <option value="DESIGN">Diseño</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Tags
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="react, javascript, tutorial (separados por comas)"
                  value={editingTagsInput}
                  onChange={(e) => onEditingTagsInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const inputValue = editingTagsInput;
                      const tags = inputValue
                        .split(",")
                        .map((tag: string) => tag.trim().toLowerCase())
                        .filter((tag: string) => tag.length > 0)
                        .filter(
                          (tag: string) =>
                            !editingWorkshop.tags
                              .map((t) => t.toLowerCase())
                              .includes(tag)
                        );

                      if (tags.length > 0) {
                        onEditingWorkshopChange({
                          ...editingWorkshop,
                          tags: [...editingWorkshop.tags, ...tags],
                        });
                        onEditingTagsInputChange("");
                      } else {
                        onEditingTagsInputChange("");
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  className="flex hover:bg-blue-500 hover:text-white transition-colors duration-300"
                  onClick={() => {
                    const inputValue = editingTagsInput;
                    const tags = inputValue
                      .split(",")
                      .map((tag: string) => tag.trim().toLowerCase())
                      .filter((tag: string) => tag.length > 0)
                      .filter(
                        (tag: string) =>
                          !editingWorkshop.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onEditingWorkshopChange({
                        ...editingWorkshop,
                        tags: [...editingWorkshop.tags, ...tags],
                      });
                      onEditingTagsInputChange("");
                    } else {
                      onEditingTagsInputChange("");
                    }
                  }}
                >
                  Añadir
                </Button>
              </div>
              {editingWorkshop.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {editingWorkshop.tags.map((tag, index) => (
                    <span
                      key={`edit-tag-${index}-${tag}`}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          onEditingWorkshopChange({
                            ...editingWorkshop,
                            tags: editingWorkshop.tags.filter(
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
                className="flex-1 hover:bg-blue-500 hover:text-white transition-colors duration-300"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Herramienta"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isUpdating}
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
