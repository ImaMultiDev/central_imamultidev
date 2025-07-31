"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { GenerativeAIType, GenerativeAICategory } from "@/types";
import { GenerativeAI } from "@/types";

interface GenerativeAIModalsProps {
  isGenerativeAIModalOpen: boolean;
  isEditModalOpen: boolean;
  editingGenerativeAI: GenerativeAI | null;
  newGenerativeAI: {
    title: string;
    description: string;
    url: string;
    type: GenerativeAIType;
    category: GenerativeAICategory;
    tags: string[];
  };
  tempTagsInput: string;
  editingTagsInput: string;
  isCreating: boolean;
  isUpdating: boolean;
  onCloseGenerativeAIModal: () => void;
  onCloseEditModal: () => void;
  onCreateGenerativeAI: () => void;
  onUpdateGenerativeAI: () => void;
  onNewGenerativeAIChange: (doc: {
    title: string;
    description: string;
    url: string;
    type: GenerativeAIType;
    category: GenerativeAICategory;
    tags: string[];
  }) => void;
  onEditingGenerativeAIChange: (doc: GenerativeAI | null) => void;
  onTempTagsInputChange: (input: string) => void;
  onEditingTagsInputChange: (input: string) => void;
}

export function GenerativeAIModals({
  isGenerativeAIModalOpen,
  isEditModalOpen,
  editingGenerativeAI,
  newGenerativeAI,
  tempTagsInput,
  editingTagsInput,
  isCreating,
  isUpdating,
  onCloseGenerativeAIModal,
  onCloseEditModal,
  onCreateGenerativeAI,
  onUpdateGenerativeAI,
  onNewGenerativeAIChange,
  onEditingGenerativeAIChange,
  onTempTagsInputChange,
  onEditingTagsInputChange,
}: GenerativeAIModalsProps) {
  return (
    <>
      {/* Generative AI Modal */}
      <Modal
        isOpen={isGenerativeAIModalOpen}
        onClose={onCloseGenerativeAIModal}
        title="Añadir Nueva Herramienta de IA Generativa"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onCreateGenerativeAI();
          }}
        >
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Título
            </label>
            <Input
              placeholder="Título de la herramienta"
              value={newGenerativeAI.title}
              onChange={(e) =>
                onNewGenerativeAIChange({
                  ...newGenerativeAI,
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
              value={newGenerativeAI.description}
              onChange={(e) =>
                onNewGenerativeAIChange({
                  ...newGenerativeAI,
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
              value={newGenerativeAI.url}
              onChange={(e) =>
                onNewGenerativeAIChange({
                  ...newGenerativeAI,
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
                value={newGenerativeAI.type}
                onChange={(e) =>
                  onNewGenerativeAIChange({
                    ...newGenerativeAI,
                    type: e.target.value as GenerativeAIType,
                  })
                }
              >
                <option value="TEXT">Texto</option>
                <option value="CODE">Código</option>
                <option value="IMAGE">Imagen</option>
                <option value="AUDIO">Audio</option>
                <option value="VIDEO">Video</option>
                <option value="PRODUCTIVITY">Productividad</option>
              </select>
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-foreground block mb-2">
                Categoría
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                value={newGenerativeAI.category}
                onChange={(e) =>
                  onNewGenerativeAIChange({
                    ...newGenerativeAI,
                    category: e.target.value as GenerativeAICategory,
                  })
                }
              >
                <option value="TEXT_GENERATION">Generación de Texto</option>
                <option value="CODE_GENERATION">Generación de Código</option>
                <option value="IMAGE_GENERATION">Generación de Imágenes</option>
                <option value="AUDIO_GENERATION">Generación de Audio</option>
                <option value="VIDEO_GENERATION">Generación de Video</option>
                <option value="PRODUCTIVITY_AI">IA Productividad</option>
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
                          !newGenerativeAI.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onNewGenerativeAIChange({
                        ...newGenerativeAI,
                        tags: [...newGenerativeAI.tags, ...tags],
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
                        !newGenerativeAI.tags
                          .map((t) => t.toLowerCase())
                          .includes(tag)
                    );

                  if (tags.length > 0) {
                    onNewGenerativeAIChange({
                      ...newGenerativeAI,
                      tags: [...newGenerativeAI.tags, ...tags],
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
            {newGenerativeAI.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {newGenerativeAI.tags.map((tag, index) => (
                  <span
                    key={`new-tag-${index}-${tag}`}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        onNewGenerativeAIChange({
                          ...newGenerativeAI,
                          tags: newGenerativeAI.tags.filter(
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
              onClick={onCloseGenerativeAIModal}
              className="text-white hover:text-red-500 transition-colors duration-300"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Generative AI Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        title="Editar Herramienta de IA Generativa"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        {editingGenerativeAI && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateGenerativeAI();
            }}
          >
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título
              </label>
              <Input
                placeholder="Título de la herramienta"
                value={editingGenerativeAI.title}
                onChange={(e) =>
                  onEditingGenerativeAIChange({
                    ...editingGenerativeAI,
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
                value={editingGenerativeAI.description || ""}
                onChange={(e) =>
                  onEditingGenerativeAIChange({
                    ...editingGenerativeAI,
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
                value={editingGenerativeAI.url}
                onChange={(e) =>
                  onEditingGenerativeAIChange({
                    ...editingGenerativeAI,
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
                  value={editingGenerativeAI.type}
                  onChange={(e) =>
                    onEditingGenerativeAIChange({
                      ...editingGenerativeAI,
                      type: e.target.value as GenerativeAIType,
                    })
                  }
                >
                  <option value="TEXT">Texto</option>
                  <option value="CODE">Código</option>
                  <option value="IMAGE">Imagen</option>
                  <option value="AUDIO">Audio</option>
                  <option value="VIDEO">Video</option>
                  <option value="PRODUCTIVITY">Productividad</option>
                </select>
              </div>
              <div className="relative">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Categoría
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={editingGenerativeAI.category}
                  onChange={(e) =>
                    onEditingGenerativeAIChange({
                      ...editingGenerativeAI,
                      category: e.target.value as GenerativeAICategory,
                    })
                  }
                >
                  <option value="TEXT_GENERATION">Generación de Texto</option>
                  <option value="CODE_GENERATION">Generación de Código</option>
                  <option value="IMAGE_GENERATION">
                    Generación de Imágenes
                  </option>
                  <option value="AUDIO_GENERATION">Generación de Audio</option>
                  <option value="VIDEO_GENERATION">Generación de Video</option>
                  <option value="PRODUCTIVITY_AI">IA Productividad</option>
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
                            !editingGenerativeAI.tags
                              .map((t) => t.toLowerCase())
                              .includes(tag)
                        );

                      if (tags.length > 0) {
                        onEditingGenerativeAIChange({
                          ...editingGenerativeAI,
                          tags: [...editingGenerativeAI.tags, ...tags],
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
                          !editingGenerativeAI.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onEditingGenerativeAIChange({
                        ...editingGenerativeAI,
                        tags: [...editingGenerativeAI.tags, ...tags],
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
              {editingGenerativeAI.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {editingGenerativeAI.tags.map((tag, index) => (
                    <span
                      key={`edit-tag-${index}-${tag}`}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          onEditingGenerativeAIChange({
                            ...editingGenerativeAI,
                            tags: editingGenerativeAI.tags.filter(
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
