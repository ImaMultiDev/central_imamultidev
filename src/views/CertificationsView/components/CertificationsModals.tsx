"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Certification, CertificationType, CertificationLevel } from "@/types";
import { Loader2 } from "lucide-react";

interface NewCertification {
  title: string;
  description: string;
  type: CertificationType;
  level: CertificationLevel;
  startDate: Date;
  endDate?: Date;
  certificateUrl: string;
  docsUrl: string;
  logoImage: string;
  badgeImage: string;
  notes: string;
  tags: string[];
  tagsInput: string;
}

interface CertificationsModalsProps {
  isCertificationModalOpen: boolean;
  onCertificationModalClose: () => void;
  isEditModalOpen: boolean;
  onEditModalClose: () => void;
  newCertification: NewCertification;
  onNewCertificationChange: (certification: NewCertification) => void;
  editingCertification: Certification | null;
  onEditingCertificationChange: (certification: Certification) => void;
  isCreating: boolean;
  isUpdating: boolean;
  onCreateCertification: () => void;
  onUpdateCertification: () => void;
}

export function CertificationsModals({
  isCertificationModalOpen,
  onCertificationModalClose,
  isEditModalOpen,
  onEditModalClose,
  newCertification,
  onNewCertificationChange,
  editingCertification,
  onEditingCertificationChange,
  isCreating,
  isUpdating,
  onCreateCertification,
  onUpdateCertification,
}: CertificationsModalsProps) {
  // Helper function para formatear fecha para input
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Manejo de tags para nueva certificación
  const handleAddTag = (certification: NewCertification, tagsInput: string) => {
    if (tagsInput.trim()) {
      const newTags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag && !certification.tags.includes(tag));

      return {
        ...certification,
        tags: [...certification.tags, ...newTags],
        tagsInput: "",
      };
    }
    return certification;
  };

  // Manejo de tags para certificación en edición
  const handleAddTagToEdit = (
    certification: Certification,
    tagsInput: string
  ) => {
    if (tagsInput.trim()) {
      const newTags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag && !certification.tags.includes(tag));

      return {
        ...certification,
        tags: [...certification.tags, ...newTags],
      };
    }
    return certification;
  };

  // Validación de campos obligatorios
  const validateForm = (data: {
    title: string;
    type: string;
    level: string;
    startDate: Date | null;
  }) => {
    if (!data.title.trim()) {
      alert("El título es obligatorio");
      return false;
    }
    if (!data.type) {
      alert("El tipo es obligatorio");
      return false;
    }
    if (!data.level) {
      alert("El nivel es obligatorio");
      return false;
    }
    if (!data.startDate) {
      alert("La fecha de inicio es obligatoria");
      return false;
    }
    return true;
  };

  const handleCreateCertification = () => {
    if (
      validateForm({
        title: newCertification.title,
        type: newCertification.type,
        level: newCertification.level,
        startDate: newCertification.startDate,
      })
    ) {
      onCreateCertification();
    }
  };

  const handleUpdateCertification = () => {
    if (
      editingCertification &&
      validateForm({
        title: editingCertification.title,
        type: editingCertification.type,
        level: editingCertification.level,
        startDate: editingCertification.startDate,
      })
    ) {
      onUpdateCertification();
    }
  };

  return (
    <>
      {/* Modal de Nueva Certificación */}
      <Modal
        isOpen={isCertificationModalOpen}
        onClose={onCertificationModalClose}
        title="Añadir Nueva Certificación"
        className="max-w-2xl max-h-[calc(90vh-120px)] overflow-y-auto"
      >
        <form
          className="space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateCertification();
          }}
        >
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Título *
            </label>
            <Input
              placeholder="Nombre de la certificación o título"
              value={newCertification.title}
              onChange={(e) =>
                onNewCertificationChange({
                  ...newCertification,
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
              placeholder="Descripción de la certificación (opcional)"
              value={newCertification.description}
              onChange={(e) =>
                onNewCertificationChange({
                  ...newCertification,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Tipo *
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                value={newCertification.type}
                onChange={(e) =>
                  onNewCertificationChange({
                    ...newCertification,
                    type: e.target.value as CertificationType,
                  })
                }
              >
                <option value="">Seleccionar tipo</option>
                <option value={CertificationType.CERTIFICADO}>
                  Certificado
                </option>
                <option value={CertificationType.TITULO}>Título</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Nivel *
              </label>
              <select
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                value={newCertification.level}
                onChange={(e) =>
                  onNewCertificationChange({
                    ...newCertification,
                    level: e.target.value as CertificationLevel,
                  })
                }
              >
                <option value="">Seleccionar nivel</option>
                <option value={CertificationLevel.FPGS}>FPGS</option>
                <option value={CertificationLevel.FPGM}>FPGM</option>
                <option value={CertificationLevel.CERTIFICADO_NIVEL_3}>
                  Certificado Nivel 3
                </option>
                <option value={CertificationLevel.CERTIFICADO_NIVEL_2}>
                  Certificado Nivel 2
                </option>
                <option value={CertificationLevel.CERTIFICADO_NIVEL_1}>
                  Certificado Nivel 1
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Fecha de inicio *
              </label>
              <Input
                id="startDate"
                type="date"
                className="w-full"
                value={formatDateForInput(newCertification.startDate)}
                onChange={(e) => {
                  const [year, month, day] = e.target.value
                    .split("-")
                    .map(Number);
                  const date = new Date(year, month - 1, day);
                  onNewCertificationChange({
                    ...newCertification,
                    startDate: date,
                  });
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Fecha de fin
              </label>
              <Input
                id="endDate"
                type="date"
                className="w-full"
                value={
                  newCertification.endDate
                    ? formatDateForInput(newCertification.endDate)
                    : ""
                }
                onChange={(e) => {
                  if (e.target.value) {
                    const [year, month, day] = e.target.value
                      .split("-")
                      .map(Number);
                    const date = new Date(year, month - 1, day);
                    onNewCertificationChange({
                      ...newCertification,
                      endDate: date,
                    });
                  } else {
                    onNewCertificationChange({
                      ...newCertification,
                      endDate: undefined,
                    });
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                URL del Certificado/Título
              </label>
              <Input
                placeholder="Enlace al documento (Google Drive)"
                value={newCertification.certificateUrl}
                onChange={(e) =>
                  onNewCertificationChange({
                    ...newCertification,
                    certificateUrl: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                URL de Documentos Adicionales
              </label>
              <Input
                placeholder="Enlace a notas, insignias, etc."
                value={newCertification.docsUrl}
                onChange={(e) =>
                  onNewCertificationChange({
                    ...newCertification,
                    docsUrl: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Imagen de Logo (Universidad/Centro)
              </label>
              <Input
                placeholder="/images/logos/universidad.png"
                value={newCertification.logoImage}
                onChange={(e) =>
                  onNewCertificationChange({
                    ...newCertification,
                    logoImage: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Imagen de Insignia (Credly, etc.)
              </label>
              <Input
                placeholder="/images/badges/certificado.png"
                value={newCertification.badgeImage}
                onChange={(e) =>
                  onNewCertificationChange({
                    ...newCertification,
                    badgeImage: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Notas
            </label>
            <textarea
              className="w-full h-20 px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm resize-none"
              placeholder="Notas adicionales sobre la certificación..."
              value={newCertification.notes}
              onChange={(e) =>
                onNewCertificationChange({
                  ...newCertification,
                  notes: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {newCertification.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded cursor-pointer"
                  onClick={() =>
                    onNewCertificationChange({
                      ...newCertification,
                      tags: newCertification.tags.filter((_, i) => i !== index),
                    })
                  }
                >
                  {tag} ×
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Añadir tags (separados por comas)"
                value={newCertification.tagsInput}
                onChange={(e) =>
                  onNewCertificationChange({
                    ...newCertification,
                    tagsInput: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onNewCertificationChange(
                      handleAddTag(newCertification, newCertification.tagsInput)
                    );
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="text-gray-400"
                onClick={() =>
                  onNewCertificationChange(
                    handleAddTag(newCertification, newCertification.tagsInput)
                  )
                }
              >
                Añadir
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="text-gray-400"
              onClick={onCertificationModalClose}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="hover:bg-blue-500 transition-colors duration-300"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Certificación"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Editar Certificación */}
      {editingCertification && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
          title="Editar Certificación"
          className="max-w-2xl max-h-[calc(90vh-120px)] overflow-y-auto"
        >
          <form
            className="space-y-4 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateCertification();
            }}
          >
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título *
              </label>
              <Input
                placeholder="Nombre de la certificación o título"
                value={editingCertification.title}
                onChange={(e) =>
                  onEditingCertificationChange({
                    ...editingCertification,
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
                placeholder="Descripción de la certificación (opcional)"
                value={editingCertification.description || ""}
                onChange={(e) =>
                  onEditingCertificationChange({
                    ...editingCertification,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Tipo *
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={editingCertification.type}
                  onChange={(e) =>
                    onEditingCertificationChange({
                      ...editingCertification,
                      type: e.target.value as CertificationType,
                    })
                  }
                >
                  <option value={CertificationType.CERTIFICADO}>
                    Certificado
                  </option>
                  <option value={CertificationType.TITULO}>Título</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Nivel *
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={editingCertification.level}
                  onChange={(e) =>
                    onEditingCertificationChange({
                      ...editingCertification,
                      level: e.target.value as CertificationLevel,
                    })
                  }
                >
                  <option value={CertificationLevel.FPGS}>FPGS</option>
                  <option value={CertificationLevel.FPGM}>FPGM</option>
                  <option value={CertificationLevel.CERTIFICADO_NIVEL_3}>
                    Certificado Nivel 3
                  </option>
                  <option value={CertificationLevel.CERTIFICADO_NIVEL_2}>
                    Certificado Nivel 2
                  </option>
                  <option value={CertificationLevel.CERTIFICADO_NIVEL_1}>
                    Certificado Nivel 1
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Fecha de inicio *
                </label>
                <Input
                  id="editStartDate"
                  type="date"
                  className="w-full"
                  value={formatDateForInput(editingCertification.startDate)}
                  onChange={(e) => {
                    const [year, month, day] = e.target.value
                      .split("-")
                      .map(Number);
                    const date = new Date(year, month - 1, day);
                    onEditingCertificationChange({
                      ...editingCertification,
                      startDate: date,
                    });
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Fecha de fin
                </label>
                <Input
                  id="editEndDate"
                  type="date"
                  className="w-full"
                  value={
                    editingCertification.endDate
                      ? formatDateForInput(editingCertification.endDate)
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      const [year, month, day] = e.target.value
                        .split("-")
                        .map(Number);
                      const date = new Date(year, month - 1, day);
                      onEditingCertificationChange({
                        ...editingCertification,
                        endDate: date,
                      });
                    } else {
                      onEditingCertificationChange({
                        ...editingCertification,
                        endDate: undefined,
                      });
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  URL del Certificado/Título
                </label>
                <Input
                  placeholder="Enlace al documento (Google Drive)"
                  value={editingCertification.certificateUrl || ""}
                  onChange={(e) =>
                    onEditingCertificationChange({
                      ...editingCertification,
                      certificateUrl: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  URL de Documentos Adicionales
                </label>
                <Input
                  placeholder="Enlace a notas, insignias, etc."
                  value={editingCertification.docsUrl || ""}
                  onChange={(e) =>
                    onEditingCertificationChange({
                      ...editingCertification,
                      docsUrl: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Imagen de Logo (Universidad/Centro)
                </label>
                <Input
                  placeholder="/images/logos/universidad.png"
                  value={editingCertification.logoImage || ""}
                  onChange={(e) =>
                    onEditingCertificationChange({
                      ...editingCertification,
                      logoImage: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Imagen de Insignia (Credly, etc.)
                </label>
                <Input
                  placeholder="/images/badges/certificado.png"
                  value={editingCertification.badgeImage || ""}
                  onChange={(e) =>
                    onEditingCertificationChange({
                      ...editingCertification,
                      badgeImage: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Notas
              </label>
              <textarea
                className="w-full h-20 px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm resize-none"
                placeholder="Notas adicionales sobre la certificación..."
                value={editingCertification.notes || ""}
                onChange={(e) =>
                  onEditingCertificationChange({
                    ...editingCertification,
                    notes: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-1 mb-2">
                {editingCertification.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded cursor-pointer"
                    onClick={() =>
                      onEditingCertificationChange({
                        ...editingCertification,
                        tags: editingCertification.tags.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Añadir tags (separados por comas)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      onEditingCertificationChange(
                        handleAddTagToEdit(editingCertification, input.value)
                      );
                      input.value = "";
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="text-gray-400"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    onEditingCertificationChange(
                      handleAddTagToEdit(editingCertification, input.value)
                    );
                    input.value = "";
                  }}
                >
                  Añadir
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="text-gray-400"
                onClick={onEditModalClose}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="hover:bg-blue-500 transition-colors duration-300"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Certificación"
                )}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
