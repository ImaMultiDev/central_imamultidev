"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { DataAnalyticsType, DataAnalyticsCategory } from "@/types";
import { DataAnalytics } from "@/types";

interface DataAnalyticsModalsProps {
  isDataAnalyticsModalOpen: boolean;
  isEditModalOpen: boolean;
  editingDataAnalytics: DataAnalytics | null;
  newDataAnalytics: {
    title: string;
    description: string;
    url: string;
    type: DataAnalyticsType;
    category: DataAnalyticsCategory;
    tags: string[];
  };
  tempTagsInput: string;
  editingTagsInput: string;
  isCreating: boolean;
  isUpdating: boolean;
  onCloseDataAnalyticsModal: () => void;
  onCloseEditModal: () => void;
  onCreateDataAnalytics: () => void;
  onUpdateDataAnalytics: () => void;
  onNewDataAnalyticsChange: (doc: {
    title: string;
    description: string;
    url: string;
    type: DataAnalyticsType;
    category: DataAnalyticsCategory;
    tags: string[];
  }) => void;
  onEditingDataAnalyticsChange: (doc: DataAnalytics | null) => void;
  onTempTagsInputChange: (input: string) => void;
  onEditingTagsInputChange: (input: string) => void;
}

export function DataAnalyticsModals({
  isDataAnalyticsModalOpen,
  isEditModalOpen,
  editingDataAnalytics,
  newDataAnalytics,
  tempTagsInput,
  editingTagsInput,
  isCreating,
  isUpdating,
  onCloseDataAnalyticsModal,
  onCloseEditModal,
  onCreateDataAnalytics,
  onUpdateDataAnalytics,
  onNewDataAnalyticsChange,
  onEditingDataAnalyticsChange,
  onTempTagsInputChange,
  onEditingTagsInputChange,
}: DataAnalyticsModalsProps) {
  return (
    <>
      {/* Data Analytics Modal */}
      <Modal
        isOpen={isDataAnalyticsModalOpen}
        onClose={onCloseDataAnalyticsModal}
        title="Añadir Nueva Herramienta de Data Analytics"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onCreateDataAnalytics();
          }}
        >
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Título
            </label>
            <Input
              placeholder="Título de la herramienta"
              value={newDataAnalytics.title}
              onChange={(e) =>
                onNewDataAnalyticsChange({
                  ...newDataAnalytics,
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
              value={newDataAnalytics.description}
              onChange={(e) =>
                onNewDataAnalyticsChange({
                  ...newDataAnalytics,
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
              value={newDataAnalytics.url}
              onChange={(e) =>
                onNewDataAnalyticsChange({
                  ...newDataAnalytics,
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
                value={newDataAnalytics.type}
                onChange={(e) =>
                  onNewDataAnalyticsChange({
                    ...newDataAnalytics,
                    type: e.target.value as DataAnalyticsType,
                  })
                }
              >
                <option value="BUSINESS_INTELLIGENCE">
                  Business Intelligence
                </option>
                <option value="DATA_PROCESSING">Data Processing</option>
                <option value="MACHINE_LEARNING">Machine Learning</option>
                <option value="DATA_VISUALIZATION">Data Visualization</option>
                <option value="ETL_ELT">ETL/ELT</option>
                <option value="CLOUD_ANALYTICS">Cloud Analytics</option>
              </select>
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-foreground block mb-2">
                Categoría
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                value={newDataAnalytics.category}
                onChange={(e) =>
                  onNewDataAnalyticsChange({
                    ...newDataAnalytics,
                    category: e.target.value as DataAnalyticsCategory,
                  })
                }
              >
                <option value="DASHBOARDS">Dashboards</option>
                <option value="SELF_SERVICE_BI">Self-Service BI</option>
                <option value="CLOUD_ANALYTICS">Cloud Analytics</option>
                <option value="DATA_LAKES">Data Lakes</option>
                <option value="ETL_ELT">ETL/ELT</option>
                <option value="ML_PLATFORMS">ML Platforms</option>
                <option value="AUTOML">AutoML</option>
                <option value="MLOPS">MLOps</option>
                <option value="ADVANCED_VIZ">Advanced Viz</option>
                <option value="STATISTICAL">Statistical</option>
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
                          !newDataAnalytics.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onNewDataAnalyticsChange({
                        ...newDataAnalytics,
                        tags: [...newDataAnalytics.tags, ...tags],
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
                        !newDataAnalytics.tags
                          .map((t) => t.toLowerCase())
                          .includes(tag)
                    );

                  if (tags.length > 0) {
                    onNewDataAnalyticsChange({
                      ...newDataAnalytics,
                      tags: [...newDataAnalytics.tags, ...tags],
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
            {newDataAnalytics.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {newDataAnalytics.tags.map((tag, index) => (
                  <span
                    key={`new-tag-${index}-${tag}`}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        onNewDataAnalyticsChange({
                          ...newDataAnalytics,
                          tags: newDataAnalytics.tags.filter(
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
              onClick={onCloseDataAnalyticsModal}
              className="text-white hover:text-red-500 transition-colors duration-300"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Data Analytics Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        title="Editar Herramienta de Data Analytics"
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        {editingDataAnalytics && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateDataAnalytics();
            }}
          >
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título
              </label>
              <Input
                placeholder="Título de la herramienta"
                value={editingDataAnalytics.title}
                onChange={(e) =>
                  onEditingDataAnalyticsChange({
                    ...editingDataAnalytics,
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
                value={editingDataAnalytics.description || ""}
                onChange={(e) =>
                  onEditingDataAnalyticsChange({
                    ...editingDataAnalytics,
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
                value={editingDataAnalytics.url}
                onChange={(e) =>
                  onEditingDataAnalyticsChange({
                    ...editingDataAnalytics,
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
                  value={editingDataAnalytics.type}
                  onChange={(e) =>
                    onEditingDataAnalyticsChange({
                      ...editingDataAnalytics,
                      type: e.target.value as DataAnalyticsType,
                    })
                  }
                >
                  <option value="BUSINESS_INTELLIGENCE">
                    Business Intelligence
                  </option>
                  <option value="DATA_PROCESSING">Data Processing</option>
                  <option value="MACHINE_LEARNING">Machine Learning</option>
                  <option value="DATA_VISUALIZATION">Data Visualization</option>
                  <option value="ETL_ELT">ETL/ELT</option>
                  <option value="CLOUD_ANALYTICS">Cloud Analytics</option>
                </select>
              </div>
              <div className="relative">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Categoría
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={editingDataAnalytics.category}
                  onChange={(e) =>
                    onEditingDataAnalyticsChange({
                      ...editingDataAnalytics,
                      category: e.target.value as DataAnalyticsCategory,
                    })
                  }
                >
                  <option value="DASHBOARDS">Dashboards</option>
                  <option value="SELF_SERVICE_BI">Self-Service BI</option>
                  <option value="CLOUD_ANALYTICS">Cloud Analytics</option>
                  <option value="DATA_LAKES">Data Lakes</option>
                  <option value="ETL_ELT">ETL/ELT</option>
                  <option value="ML_PLATFORMS">ML Platforms</option>
                  <option value="AUTOML">AutoML</option>
                  <option value="MLOPS">MLOps</option>
                  <option value="ADVANCED_VIZ">Advanced Viz</option>
                  <option value="STATISTICAL">Statistical</option>
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
                            !editingDataAnalytics.tags
                              .map((t) => t.toLowerCase())
                              .includes(tag)
                        );

                      if (tags.length > 0) {
                        onEditingDataAnalyticsChange({
                          ...editingDataAnalytics,
                          tags: [...editingDataAnalytics.tags, ...tags],
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
                          !editingDataAnalytics.tags
                            .map((t) => t.toLowerCase())
                            .includes(tag)
                      );

                    if (tags.length > 0) {
                      onEditingDataAnalyticsChange({
                        ...editingDataAnalytics,
                        tags: [...editingDataAnalytics.tags, ...tags],
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
              {editingDataAnalytics.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {editingDataAnalytics.tags.map((tag, index) => (
                    <span
                      key={`edit-tag-${index}-${tag}`}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          onEditingDataAnalyticsChange({
                            ...editingDataAnalytics,
                            tags: editingDataAnalytics.tags.filter(
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
