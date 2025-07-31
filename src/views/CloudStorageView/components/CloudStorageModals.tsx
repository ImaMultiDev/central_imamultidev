"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { CloudStorageType, CloudStorageCategory } from "@/types";
import { CloudStorage } from "@/types";

interface CloudStorageModalsProps {
  isCloudStorageModalOpen: boolean;
  isEditModalOpen: boolean;
  editingCloudStorage: CloudStorage | null;
  newCloudStorage: {
    title: string;
    description: string;
    url: string;
    type: CloudStorageType;
    category: CloudStorageCategory;
    tags: string[];
  };
  tempTagsInput: string;
  editingTagsInput: string;
  isCreating: boolean;
  isUpdating: boolean;
  onCloseCloudStorageModal: () => void;
  onCloseEditModal: () => void;
  onCreateCloudStorage: () => void;
  onUpdateCloudStorage: () => void;
  onNewCloudStorageChange: (doc: {
    title: string;
    description: string;
    url: string;
    type: CloudStorageType;
    category: CloudStorageCategory;
    tags: string[];
  }) => void;
  onEditingCloudStorageChange: (doc: CloudStorage | null) => void;
  onTempTagsInputChange: (input: string) => void;
  onEditingTagsInputChange: (input: string) => void;
}

export function CloudStorageModals({
  isCloudStorageModalOpen,
  isEditModalOpen,
  editingCloudStorage,
  newCloudStorage,
  tempTagsInput,
  editingTagsInput,
  isCreating,
  isUpdating,
  onCloseCloudStorageModal,
  onCloseEditModal,
  onCreateCloudStorage,
  onUpdateCloudStorage,
  onNewCloudStorageChange,
  onEditingCloudStorageChange,
  onTempTagsInputChange,
  onEditingTagsInputChange,
}: CloudStorageModalsProps) {
  return (
    <>
      {/* Cloud Storage Modal */}
      <Modal
        isOpen={isCloudStorageModalOpen}
        onClose={onCloseCloudStorageModal}
        title="Añadir Nueva Herramienta de Cloud Storage"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onCreateCloudStorage();
          }}
        >
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Título
            </label>
            <Input
              placeholder="Título de la herramienta"
              value={newCloudStorage.title}
              onChange={(e) =>
                onNewCloudStorageChange({
                  ...newCloudStorage,
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
              value={newCloudStorage.description}
              onChange={(e) =>
                onNewCloudStorageChange({
                  ...newCloudStorage,
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
              value={newCloudStorage.url}
              onChange={(e) =>
                onNewCloudStorageChange({
                  ...newCloudStorage,
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
                value={newCloudStorage.type}
                onChange={(e) =>
                  onNewCloudStorageChange({
                    ...newCloudStorage,
                    type: e.target.value as CloudStorageType,
                  })
                }
              >
                <option value="PERSONAL_STORAGE">
                  Almacenamiento Personal
                </option>
                <option value="HIGH_CAPACITY">Alta Capacidad</option>
                <option value="COLLABORATION">Colaboración</option>
                <option value="BACKUP">Backup</option>
                <option value="FILE_TRANSFER">Transferencia de Archivos</option>
                <option value="NOTE_TAKING">Toma de Notas</option>
                <option value="HOSTING">Hosting</option>
                <option value="CLOUD_PROVIDERS">Proveedores Cloud</option>
                <option value="DATABASES">Bases de Datos</option>
                <option value="CDN">CDN</option>
                <option value="CI_CD">CI/CD</option>
                <option value="MONITORING">Monitoreo</option>
              </select>
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-foreground block mb-2">
                Categoría
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                value={newCloudStorage.category}
                onChange={(e) =>
                  onNewCloudStorageChange({
                    ...newCloudStorage,
                    category: e.target.value as CloudStorageCategory,
                  })
                }
              >
                <option value="STORAGE_SYNC">
                  Almacenamiento y Sincronización
                </option>
                <option value="DEV_INFRASTRUCTURE">
                  Infraestructura de Desarrollo
                </option>
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
                          !newCloudStorage.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onNewCloudStorageChange({
                        ...newCloudStorage,
                        tags: [...newCloudStorage.tags, ...tags],
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
                        !newCloudStorage.tags
                          .map((t) => t.toLowerCase())
                          .includes(tag)
                    );

                  if (tags.length > 0) {
                    onNewCloudStorageChange({
                      ...newCloudStorage,
                      tags: [...newCloudStorage.tags, ...tags],
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
            {newCloudStorage.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {newCloudStorage.tags.map((tag, index) => (
                  <span
                    key={`new-tag-${index}-${tag}`}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        onNewCloudStorageChange({
                          ...newCloudStorage,
                          tags: newCloudStorage.tags.filter(
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
              onClick={onCloseCloudStorageModal}
              className="text-white hover:text-red-500 transition-colors duration-300"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Cloud Storage Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        title="Editar Herramienta de Cloud Storage"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        {editingCloudStorage && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateCloudStorage();
            }}
          >
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título
              </label>
              <Input
                placeholder="Título de la herramienta"
                value={editingCloudStorage.title}
                onChange={(e) =>
                  onEditingCloudStorageChange({
                    ...editingCloudStorage,
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
                value={editingCloudStorage.description || ""}
                onChange={(e) =>
                  onEditingCloudStorageChange({
                    ...editingCloudStorage,
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
                value={editingCloudStorage.url}
                onChange={(e) =>
                  onEditingCloudStorageChange({
                    ...editingCloudStorage,
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
                  value={editingCloudStorage.type}
                  onChange={(e) =>
                    onEditingCloudStorageChange({
                      ...editingCloudStorage,
                      type: e.target.value as CloudStorageType,
                    })
                  }
                >
                  <option value="PERSONAL_STORAGE">
                    Almacenamiento Personal
                  </option>
                  <option value="HIGH_CAPACITY">Alta Capacidad</option>
                  <option value="COLLABORATION">Colaboración</option>
                  <option value="BACKUP">Backup</option>
                  <option value="FILE_TRANSFER">
                    Transferencia de Archivos
                  </option>
                  <option value="NOTE_TAKING">Toma de Notas</option>
                  <option value="HOSTING">Hosting</option>
                  <option value="CLOUD_PROVIDERS">Proveedores Cloud</option>
                  <option value="DATABASES">Bases de Datos</option>
                  <option value="CDN">CDN</option>
                  <option value="CI_CD">CI/CD</option>
                  <option value="MONITORING">Monitoreo</option>
                </select>
              </div>
              <div className="relative">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Categoría
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={editingCloudStorage.category}
                  onChange={(e) =>
                    onEditingCloudStorageChange({
                      ...editingCloudStorage,
                      category: e.target.value as CloudStorageCategory,
                    })
                  }
                >
                  <option value="STORAGE_SYNC">
                    Almacenamiento y Sincronización
                  </option>
                  <option value="DEV_INFRASTRUCTURE">
                    Infraestructura de Desarrollo
                  </option>
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
                            !editingCloudStorage.tags
                              .map((t) => t.toLowerCase())
                              .includes(tag)
                        );

                      if (tags.length > 0) {
                        onEditingCloudStorageChange({
                          ...editingCloudStorage,
                          tags: [...editingCloudStorage.tags, ...tags],
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
                          !editingCloudStorage.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onEditingCloudStorageChange({
                        ...editingCloudStorage,
                        tags: [...editingCloudStorage.tags, ...tags],
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
              {editingCloudStorage.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {editingCloudStorage.tags.map((tag, index) => (
                    <span
                      key={`edit-tag-${index}-${tag}`}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          onEditingCloudStorageChange({
                            ...editingCloudStorage,
                            tags: editingCloudStorage.tags.filter(
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
