"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { DocumentationType, DocumentationCategory } from "@/types";
import { Documentation } from "@/types";

interface DocsModalsProps {
  isDocModalOpen: boolean;
  isEditModalOpen: boolean;
  editingDoc: Documentation | null;
  newDocument: {
    title: string;
    description: string;
    url: string;
    type: DocumentationType;
    category: DocumentationCategory;
    tags: string[];
  };
  tempTagsInput: string;
  editingTagsInput: string;
  onCloseDocModal: () => void;
  onCloseEditModal: () => void;
  onCreateDocument: () => void;
  onUpdateDocument: () => void;
  onNewDocumentChange: (doc: {
    title: string;
    description: string;
    url: string;
    type: DocumentationType;
    category: DocumentationCategory;
    tags: string[];
  }) => void;
  onEditingDocChange: (doc: Documentation | null) => void;
  onTempTagsInputChange: (input: string) => void;
  onEditingTagsInputChange: (input: string) => void;
}

export function DocsModals({
  isDocModalOpen,
  isEditModalOpen,
  editingDoc,
  newDocument,
  tempTagsInput,
  editingTagsInput,
  onCloseDocModal,
  onCloseEditModal,
  onCreateDocument,
  onUpdateDocument,
  onNewDocumentChange,
  onEditingDocChange,
  onTempTagsInputChange,
  onEditingTagsInputChange,
}: DocsModalsProps) {
  return (
    <>
      {/* Document Modal */}
      <Modal
        isOpen={isDocModalOpen}
        onClose={onCloseDocModal}
        title="Añadir Nuevo Documento"
        className="max-w-md"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onCreateDocument();
          }}
        >
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Título
            </label>
            <Input
              placeholder="Título del documento"
              value={newDocument.title}
              onChange={(e) =>
                onNewDocumentChange({ ...newDocument, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Descripción
            </label>
            <Input
              placeholder="Descripción del recurso"
              value={newDocument.description}
              onChange={(e) =>
                onNewDocumentChange({
                  ...newDocument,
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
              value={newDocument.url}
              onChange={(e) =>
                onNewDocumentChange({ ...newDocument, url: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Tipo
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground"
                value={newDocument.type}
                onChange={(e) =>
                  onNewDocumentChange({
                    ...newDocument,
                    type: e.target.value as DocumentationType,
                  })
                }
              >
                <option value="DOCUMENTACION_OFICIAL">Documentación</option>
                <option value="TUTORIAL">Tutorial</option>
                <option value="CHEAT_SHEET">Cheat Sheet</option>
                <option value="ARTICULO">Artículo</option>
                <option value="VIDEO">Video</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Categoría
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground"
                value={newDocument.category}
                onChange={(e) =>
                  onNewDocumentChange({
                    ...newDocument,
                    category: e.target.value as DocumentationCategory,
                  })
                }
              >
                <option value="FRONTEND">Frontend</option>
                <option value="BACKEND">Backend</option>
                <option value="BASES_DATOS">Bases de Datos</option>
                <option value="MULTIPLATAFORMA">Multiplataforma</option>
                <option value="CIENCIA_DATOS">Ciencia de Datos</option>
                <option value="LENGUAJES">Lenguajes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Tags
            </label>
            <div className="flex gap-2">
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
                      .map((tag: string) => tag.trim())
                      .filter((tag: string) => tag.length > 0);

                    onNewDocumentChange({
                      ...newDocument,
                      tags: [...newDocument.tags, ...tags],
                    });
                    onTempTagsInputChange("");
                  }
                }}
              />
              <Button
                type="submit"
                variant="outline"
                className="hover:bg-blue-500 text-white transition-colors duration-300"
                size="sm"
                onClick={() => {
                  const inputValue = tempTagsInput;
                  const tags = inputValue
                    .split(",")
                    .map((tag: string) => tag.trim())
                    .filter((tag: string) => tag.length > 0);

                  onNewDocumentChange({
                    ...newDocument,
                    tags: [...newDocument.tags, ...tags],
                  });
                  onTempTagsInputChange("");
                }}
              >
                Añadir
              </Button>
            </div>
            {newDocument.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {newDocument.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        onNewDocumentChange({
                          ...newDocument,
                          tags: newDocument.tags.filter((_, i) => i !== index),
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
              Escribe los tags y presiona Enter o el botón Añadir
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 hover:bg-green-500 hover:text-white transition-colors duration-300"
            >
              Añadir Documento
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCloseDocModal}
              className="text-white hover:text-red-500 transition-colors duration-300"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Document Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        title="Editar Documento"
        className="max-w-md"
      >
        {editingDoc && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateDocument();
            }}
          >
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título
              </label>
              <Input
                placeholder="Título del documento"
                value={editingDoc.title}
                onChange={(e) =>
                  onEditingDocChange({ ...editingDoc, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Descripción
              </label>
              <Input
                placeholder="Descripción del recurso"
                value={editingDoc.description || ""}
                onChange={(e) =>
                  onEditingDocChange({
                    ...editingDoc,
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
                value={editingDoc.url}
                onChange={(e) =>
                  onEditingDocChange({ ...editingDoc, url: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Tipo
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground"
                  value={editingDoc.type}
                  onChange={(e) =>
                    onEditingDocChange({
                      ...editingDoc,
                      type: e.target.value as DocumentationType,
                    })
                  }
                >
                  <option value="DOCUMENTACION_OFICIAL">Documentación</option>
                  <option value="TUTORIAL">Tutorial</option>
                  <option value="CHEAT_SHEET">Cheat Sheet</option>
                  <option value="ARTICULO">Artículo</option>
                  <option value="VIDEO">Video</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Categoría
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground"
                  value={editingDoc.category}
                  onChange={(e) =>
                    onEditingDocChange({
                      ...editingDoc,
                      category: e.target.value as DocumentationCategory,
                    })
                  }
                >
                  <option value="FRONTEND">Frontend</option>
                  <option value="BACKEND">Backend</option>
                  <option value="BASES_DATOS">Bases de Datos</option>
                  <option value="MULTIPLATAFORMA">Multiplataforma</option>
                  <option value="CIENCIA_DATOS">Ciencia de Datos</option>
                  <option value="LENGUAJES">Lenguajes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Tags
              </label>
              <div className="flex gap-2">
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
                        .map((tag: string) => tag.trim())
                        .filter((tag: string) => tag.length > 0);

                      onEditingDocChange({
                        ...editingDoc,
                        tags: [...editingDoc.tags, ...tags],
                      });
                      onEditingTagsInputChange("");
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="flex hover:bg-blue-500 hover:text-white transition-colors duration-300"
                  onClick={() => {
                    const inputValue = editingTagsInput;
                    const tags = inputValue
                      .split(",")
                      .map((tag: string) => tag.trim())
                      .filter((tag: string) => tag.length > 0);

                    onEditingDocChange({
                      ...editingDoc,
                      tags: [...editingDoc.tags, ...tags],
                    });
                    onEditingTagsInputChange("");
                  }}
                >
                  Añadir
                </Button>
              </div>
              {editingDoc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {editingDoc.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          onEditingDocChange({
                            ...editingDoc,
                            tags: editingDoc.tags.filter((_, i) => i !== index),
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
                Escribe los tags y presiona Enter o el botón Añadir
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 hover:bg-blue-500 hover:text-white transition-colors duration-300"
              >
                Actualizar Documento
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
