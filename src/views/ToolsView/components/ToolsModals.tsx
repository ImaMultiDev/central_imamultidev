"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Tool, ToolType, ToolCategory } from "@/types";

interface ToolsModalsProps {
  isToolModalOpen: boolean;
  isEditModalOpen: boolean;
  editingTool: Tool | null;
  newTool: {
    title: string;
    description: string;
    url: string;
    type: ToolType;
    category: ToolCategory;
    tags: string[];
  };
  tempTagsInput: string;
  editingTagsInput: string;
  isCreating: boolean;
  isUpdating: boolean;
  onCloseToolModal: () => void;
  onCloseEditModal: () => void;
  onCreateTool: () => void;
  onUpdateTool: () => void;
  onNewToolChange: (tool: {
    title: string;
    description: string;
    url: string;
    type: ToolType;
    category: ToolCategory;
    tags: string[];
  }) => void;
  onEditingToolChange: (tool: Tool | null) => void;
  onTempTagsInputChange: (input: string) => void;
  onEditingTagsInputChange: (input: string) => void;
}

export function ToolsModals({
  isToolModalOpen,
  isEditModalOpen,
  editingTool,
  newTool,
  tempTagsInput,
  editingTagsInput,
  isCreating,
  isUpdating,
  onCloseToolModal,
  onCloseEditModal,
  onCreateTool,
  onUpdateTool,
  onNewToolChange,
  onEditingToolChange,
  onTempTagsInputChange,
  onEditingTagsInputChange,
}: ToolsModalsProps) {
  return (
    <>
      {/* Tool Modal */}
      <Modal
        isOpen={isToolModalOpen}
        onClose={onCloseToolModal}
        title="Añadir Nueva Herramienta"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onCreateTool();
          }}
        >
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Título
            </label>
            <Input
              placeholder="Título de la herramienta"
              value={newTool.title}
              onChange={(e) =>
                onNewToolChange({ ...newTool, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Descripción
            </label>
            <Input
              placeholder="Descripción de la herramienta"
              value={newTool.description}
              onChange={(e) =>
                onNewToolChange({
                  ...newTool,
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
              value={newTool.url}
              onChange={(e) =>
                onNewToolChange({ ...newTool, url: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Tipo
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground"
                value={newTool.type}
                onChange={(e) =>
                  onNewToolChange({
                    ...newTool,
                    type: e.target.value as ToolType,
                  })
                }
              >
                <option value="">Seleccionar tipo</option>
                <option value="DESPLIEGUE">Despliegue</option>
                <option value="DISENO">Diseño</option>
                <option value="MULTIMEDIA">Multimedia</option>
                <option value="IA_GENERATIVA">IA Generativa</option>
                <option value="DOCUMENTACION">Documentación</option>
                <option value="LEGAL">Legal</option>
                <option value="DESARROLLO">Desarrollo</option>
                <option value="MONITOREO">Monitoreo</option>
                <option value="COMUNICACION">Comunicación</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Categoría
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground"
                value={newTool.category}
                onChange={(e) =>
                  onNewToolChange({
                    ...newTool,
                    category: e.target.value as ToolCategory,
                  })
                }
              >
                <option value="">Seleccionar categoría</option>
                <option value="SERVICIOS_CLOUD">Servicios Cloud</option>
                <option value="HERRAMIENTAS_DISENO">Herramientas Diseño</option>
                <option value="EDITORES_MULTIMEDIA">Editores Multimedia</option>
                <option value="IA_ARTE">IA Arte</option>
                <option value="IA_TEXTO">IA Texto</option>
                <option value="IA_CODIGO">IA Código</option>
                <option value="PLATAFORMAS_DOCS">Plataformas Docs</option>
                <option value="SERVICIOS_LEGALES">Servicios Legales</option>
                <option value="IDES_EDITORES">IDEs/Editores</option>
                <option value="SERVICIOS_BASE_DATOS">Servicios BD</option>
                <option value="AUTENTICACION">Autenticación</option>
                <option value="ANALITICAS">Analíticas</option>
                <option value="CHAT_COLABORACION">Chat/Colaboración</option>
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
                          !newTool.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onNewToolChange({
                        ...newTool,
                        tags: [...newTool.tags, ...tags],
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
                        !newTool.tags.map((t) => t.toLowerCase()).includes(tag)
                    );

                  if (tags.length > 0) {
                    onNewToolChange({
                      ...newTool,
                      tags: [...newTool.tags, ...tags],
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
            {newTool.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {newTool.tags.map((tag, index) => (
                  <span
                    key={`new-tag-${index}-${tag}`}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        onNewToolChange({
                          ...newTool,
                          tags: newTool.tags.filter((_, i) => i !== index),
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
              onClick={onCloseToolModal}
              className="text-white hover:text-red-500 transition-colors duration-300"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Tool Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        title="Editar Herramienta"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        {editingTool && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateTool();
            }}
          >
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título
              </label>
              <Input
                placeholder="Título de la herramienta"
                value={editingTool.title}
                onChange={(e) =>
                  onEditingToolChange({ ...editingTool, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Descripción
              </label>
              <Input
                placeholder="Descripción de la herramienta"
                value={editingTool.description || ""}
                onChange={(e) =>
                  onEditingToolChange({
                    ...editingTool,
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
                value={editingTool.url}
                onChange={(e) =>
                  onEditingToolChange({ ...editingTool, url: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Tipo
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground"
                  value={editingTool.type}
                  onChange={(e) =>
                    onEditingToolChange({
                      ...editingTool,
                      type: e.target.value as ToolType,
                    })
                  }
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="DESPLIEGUE">Despliegue</option>
                  <option value="DISENO">Diseño</option>
                  <option value="MULTIMEDIA">Multimedia</option>
                  <option value="IA_GENERATIVA">IA Generativa</option>
                  <option value="DOCUMENTACION">Documentación</option>
                  <option value="LEGAL">Legal</option>
                  <option value="DESARROLLO">Desarrollo</option>
                  <option value="MONITOREO">Monitoreo</option>
                  <option value="COMUNICACION">Comunicación</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Categoría
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground"
                  value={editingTool.category}
                  onChange={(e) =>
                    onEditingToolChange({
                      ...editingTool,
                      category: e.target.value as ToolCategory,
                    })
                  }
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="SERVICIOS_CLOUD">Servicios Cloud</option>
                  <option value="HERRAMIENTAS_DISENO">
                    Herramientas Diseño
                  </option>
                  <option value="EDITORES_MULTIMEDIA">
                    Editores Multimedia
                  </option>
                  <option value="IA_ARTE">IA Arte</option>
                  <option value="IA_TEXTO">IA Texto</option>
                  <option value="IA_CODIGO">IA Código</option>
                  <option value="PLATAFORMAS_DOCS">Plataformas Docs</option>
                  <option value="SERVICIOS_LEGALES">Servicios Legales</option>
                  <option value="IDES_EDITORES">IDEs/Editores</option>
                  <option value="SERVICIOS_BASE_DATOS">Servicios BD</option>
                  <option value="AUTENTICACION">Autenticación</option>
                  <option value="ANALITICAS">Analíticas</option>
                  <option value="CHAT_COLABORACION">Chat/Colaboración</option>
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
                            !editingTool.tags
                              .map((t) => t.toLowerCase())
                              .includes(tag)
                        );

                      if (tags.length > 0) {
                        onEditingToolChange({
                          ...editingTool,
                          tags: [...editingTool.tags, ...tags],
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
                          !editingTool.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onEditingToolChange({
                        ...editingTool,
                        tags: [...editingTool.tags, ...tags],
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
              {editingTool.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {editingTool.tags.map((tag, index) => (
                    <span
                      key={`edit-tag-${index}-${tag}`}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          onEditingToolChange({
                            ...editingTool,
                            tags: editingTool.tags.filter(
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
