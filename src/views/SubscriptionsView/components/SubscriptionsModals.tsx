"use client";

import { useState, useEffect } from "react";
import {
  Subscription,
  SubscriptionType,
  SubscriptionCategory,
  BillingCycle,
} from "@/types";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SubscriptionsModalsProps {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  editingSubscription: Subscription | null;
  onCloseAddModal: () => void;
  onCloseEditModal: () => void;
  onAddSubscription: (
    subscription: Omit<
      Subscription,
      "id" | "userId" | "createdAt" | "updatedAt"
    >
  ) => void;
  onUpdateSubscription: (
    id: string,
    subscription: Partial<Subscription>
  ) => void;
  isCreating: boolean;
  isUpdating: boolean;
}

export default function SubscriptionsModals({
  isAddModalOpen,
  isEditModalOpen,
  editingSubscription,
  onCloseAddModal,
  onCloseEditModal,
  onAddSubscription,
  onUpdateSubscription,
  isCreating,
  isUpdating,
}: SubscriptionsModalsProps) {
  const [newSubscription, setNewSubscription] = useState({
    title: "",
    description: "",
    url: "",
    type: SubscriptionType.SOFTWARE,
    category: SubscriptionCategory.WORK,
    price: 0,
    billingCycle: BillingCycle.MONTHLY,
    startDate: new Date(),
    nextBillingDate: undefined as Date | undefined,
    isActive: true,
    tags: [] as string[],
  });

  const [editingSubscriptionData, setEditingSubscriptionData] = useState({
    title: "",
    description: "",
    url: "",
    type: SubscriptionType.SOFTWARE,
    category: SubscriptionCategory.WORK,
    price: 0,
    billingCycle: BillingCycle.MONTHLY,
    startDate: new Date(),
    nextBillingDate: undefined as Date | undefined,
    isActive: true,
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");
  const [editTagInput, setEditTagInput] = useState("");

  useEffect(() => {
    if (editingSubscription) {
      setEditingSubscriptionData({
        title: editingSubscription.title,
        description: editingSubscription.description || "",
        url: editingSubscription.url || "",
        type: editingSubscription.type,
        category: editingSubscription.category,
        price: editingSubscription.price,
        billingCycle: editingSubscription.billingCycle,
        startDate: new Date(editingSubscription.startDate),
        nextBillingDate: editingSubscription.nextBillingDate
          ? new Date(editingSubscription.nextBillingDate)
          : undefined,
        isActive: editingSubscription.isActive,
        tags: editingSubscription.tags || [],
      });
    }
  }, [editingSubscription]);

  const handleAddSubscription = () => {
    // Validación de campos obligatorios (como en ToolsView)
    if (
      !newSubscription.title ||
      !newSubscription.type ||
      !newSubscription.category ||
      !newSubscription.price ||
      !newSubscription.billingCycle ||
      !newSubscription.startDate
    ) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    onAddSubscription(newSubscription);
    setNewSubscription({
      title: "",
      description: "",
      url: "",
      type: SubscriptionType.SOFTWARE,
      category: SubscriptionCategory.WORK,
      price: 0,
      billingCycle: BillingCycle.MONTHLY,
      startDate: new Date(),
      nextBillingDate: undefined,
      isActive: true,
      tags: [],
    });
    setTagInput("");
    onCloseAddModal();
  };

  const handleUpdateSubscription = () => {
    if (!editingSubscription) return;

    // Validación de campos obligatorios
    if (
      !editingSubscriptionData.title ||
      !editingSubscriptionData.type ||
      !editingSubscriptionData.category ||
      !editingSubscriptionData.price ||
      !editingSubscriptionData.billingCycle ||
      !editingSubscriptionData.startDate
    ) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    onUpdateSubscription(editingSubscription.id, editingSubscriptionData);
    setEditTagInput("");
    onCloseEditModal();
  };

  const addTag = (isEdit = false) => {
    const input = isEdit ? editTagInput : tagInput;
    const setInput = isEdit ? setEditTagInput : setTagInput;
    const tags = isEdit ? editingSubscriptionData.tags : newSubscription.tags;

    if (input.trim() && !tags.includes(input.trim())) {
      if (isEdit) {
        setEditingSubscriptionData((prev) => ({
          ...prev,
          tags: [...prev.tags, input.trim()],
        }));
      } else {
        setNewSubscription((prev) => ({
          ...prev,
          tags: [...prev.tags, input.trim()],
        }));
      }
      setInput("");
    }
  };

  const removeTag = (tagToRemove: string, isEdit = false) => {
    if (isEdit) {
      setEditingSubscriptionData((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== tagToRemove),
      }));
    } else {
      setNewSubscription((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== tagToRemove),
      }));
    }
  };

  // Función para formatear fechas correctamente (copiada de Events)
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return "";

    // Asegurar que date sea un objeto Date
    const dateObj = date instanceof Date ? date : new Date(date);

    // Para campos de solo fecha (sin hora)
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      {/* Modal Agregar Suscripción */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        title="Agregar Nueva Suscripción"
        className="max-w-2xl w-full max-h-[90vh]"
      >
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título *
              </label>
              <Input
                id="title"
                placeholder="Ej: Netflix, Spotify, Adobe Creative..."
                value={newSubscription.title}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Descripción
              </label>
              <Textarea
                id="description"
                placeholder="Descripción de la suscripción..."
                value={newSubscription.description}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
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
                id="url"
                placeholder="https://..."
                value={newSubscription.url}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    url: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Tipo *
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={newSubscription.type}
                  onChange={(e) =>
                    setNewSubscription({
                      ...newSubscription,
                      type: e.target.value as SubscriptionType,
                    })
                  }
                >
                  <option value={SubscriptionType.SOFTWARE}>Software</option>
                  <option value={SubscriptionType.STREAMING}>Streaming</option>
                  <option value={SubscriptionType.CLOUD_SERVICE}>
                    Cloud Service
                  </option>
                  <option value={SubscriptionType.PRODUCTIVITY}>
                    Productividad
                  </option>
                  <option value={SubscriptionType.DESIGN}>Diseño</option>
                  <option value={SubscriptionType.DEVELOPMENT}>
                    Desarrollo
                  </option>
                  <option value={SubscriptionType.ENTERTAINMENT}>
                    Entretenimiento
                  </option>
                  <option value={SubscriptionType.EDUCATION}>Educación</option>
                  <option value={SubscriptionType.NEWS}>Noticias</option>
                  <option value={SubscriptionType.FITNESS}>Fitness</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Categoría *
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={newSubscription.category}
                  onChange={(e) =>
                    setNewSubscription({
                      ...newSubscription,
                      category: e.target.value as SubscriptionCategory,
                    })
                  }
                >
                  <option value={SubscriptionCategory.WORK}>Trabajo</option>
                  <option value={SubscriptionCategory.PERSONAL}>
                    Personal
                  </option>
                  <option value={SubscriptionCategory.ENTERTAINMENT}>
                    Entretenimiento
                  </option>
                  <option value={SubscriptionCategory.EDUCATION}>
                    Educación
                  </option>
                  <option value={SubscriptionCategory.HEALTH}>Salud</option>
                  <option value={SubscriptionCategory.FINANCE}>Finanzas</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Precio *
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newSubscription.price}
                  onChange={(e) =>
                    setNewSubscription({
                      ...newSubscription,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Ciclo de Facturación *
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={newSubscription.billingCycle}
                  onChange={(e) =>
                    setNewSubscription({
                      ...newSubscription,
                      billingCycle: e.target.value as BillingCycle,
                    })
                  }
                >
                  <option value={BillingCycle.MONTHLY}>Mensual</option>
                  <option value={BillingCycle.YEARLY}>Anual</option>
                  <option value={BillingCycle.WEEKLY}>Semanal</option>
                  <option value={BillingCycle.LIFETIME}>Lifetime</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Fecha de Inicio *
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={formatDateForInput(newSubscription.startDate)}
                  onChange={(e) => {
                    // Manejo correcto como en Events
                    const [year, month, day] = e.target.value
                      .split("-")
                      .map(Number);
                    const date = new Date(year, month - 1, day);
                    setNewSubscription({
                      ...newSubscription,
                      startDate: date,
                    });
                  }}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Próximo Pago
                </label>
                <Input
                  id="nextBillingDate"
                  type="date"
                  value={formatDateForInput(newSubscription.nextBillingDate)}
                  onChange={(e) => {
                    // Manejo correcto como en Events
                    if (e.target.value) {
                      const [year, month, day] = e.target.value
                        .split("-")
                        .map(Number);
                      const date = new Date(year, month - 1, day);
                      setNewSubscription({
                        ...newSubscription,
                        nextBillingDate: date,
                      });
                    } else {
                      setNewSubscription({
                        ...newSubscription,
                        nextBillingDate: undefined,
                      });
                    }
                  }}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newSubscription.isActive}
                  onChange={(e) =>
                    setNewSubscription({
                      ...newSubscription,
                      isActive: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                Suscripción activa
              </label>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Etiquetas
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Agregar etiqueta..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button type="button" onClick={() => addTag()}>
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newSubscription.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1 hover:bg-green-500 hover:text-white transition-colors duration-300"
                onClick={handleAddSubscription}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  "Agregar Suscripción"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isCreating}
                onClick={onCloseAddModal}
                className="text-white hover:text-red-500 transition-colors duration-300"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Editar Suscripción */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        title="Editar Suscripción"
        className="max-w-2xl w-full max-h-[90vh]"
      >
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título *
              </label>
              <Input
                id="edit-title"
                placeholder="Ej: Netflix, Spotify, Adobe Creative..."
                value={editingSubscriptionData.title}
                onChange={(e) =>
                  setEditingSubscriptionData({
                    ...editingSubscriptionData,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Descripción
              </label>
              <Textarea
                id="edit-description"
                placeholder="Descripción de la suscripción..."
                value={editingSubscriptionData.description}
                onChange={(e) =>
                  setEditingSubscriptionData({
                    ...editingSubscriptionData,
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
                id="edit-url"
                placeholder="https://..."
                value={editingSubscriptionData.url}
                onChange={(e) =>
                  setEditingSubscriptionData({
                    ...editingSubscriptionData,
                    url: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Tipo *
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={editingSubscriptionData.type}
                  onChange={(e) =>
                    setEditingSubscriptionData({
                      ...editingSubscriptionData,
                      type: e.target.value as SubscriptionType,
                    })
                  }
                >
                  <option value={SubscriptionType.SOFTWARE}>Software</option>
                  <option value={SubscriptionType.STREAMING}>Streaming</option>
                  <option value={SubscriptionType.CLOUD_SERVICE}>
                    Cloud Service
                  </option>
                  <option value={SubscriptionType.PRODUCTIVITY}>
                    Productividad
                  </option>
                  <option value={SubscriptionType.DESIGN}>Diseño</option>
                  <option value={SubscriptionType.DEVELOPMENT}>
                    Desarrollo
                  </option>
                  <option value={SubscriptionType.ENTERTAINMENT}>
                    Entretenimiento
                  </option>
                  <option value={SubscriptionType.EDUCATION}>Educación</option>
                  <option value={SubscriptionType.NEWS}>Noticias</option>
                  <option value={SubscriptionType.FITNESS}>Fitness</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Categoría *
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={editingSubscriptionData.category}
                  onChange={(e) =>
                    setEditingSubscriptionData({
                      ...editingSubscriptionData,
                      category: e.target.value as SubscriptionCategory,
                    })
                  }
                >
                  <option value={SubscriptionCategory.WORK}>Trabajo</option>
                  <option value={SubscriptionCategory.PERSONAL}>
                    Personal
                  </option>
                  <option value={SubscriptionCategory.ENTERTAINMENT}>
                    Entretenimiento
                  </option>
                  <option value={SubscriptionCategory.EDUCATION}>
                    Educación
                  </option>
                  <option value={SubscriptionCategory.HEALTH}>Salud</option>
                  <option value={SubscriptionCategory.FINANCE}>Finanzas</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Precio *
                </label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={editingSubscriptionData.price}
                  onChange={(e) =>
                    setEditingSubscriptionData({
                      ...editingSubscriptionData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Ciclo de Facturación *
                </label>
                <select
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  value={editingSubscriptionData.billingCycle}
                  onChange={(e) =>
                    setEditingSubscriptionData({
                      ...editingSubscriptionData,
                      billingCycle: e.target.value as BillingCycle,
                    })
                  }
                >
                  <option value={BillingCycle.MONTHLY}>Mensual</option>
                  <option value={BillingCycle.YEARLY}>Anual</option>
                  <option value={BillingCycle.WEEKLY}>Semanal</option>
                  <option value={BillingCycle.LIFETIME}>Lifetime</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Fecha de Inicio *
                </label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formatDateForInput(editingSubscriptionData.startDate)}
                  onChange={(e) => {
                    // Manejo correcto como en Events
                    const [year, month, day] = e.target.value
                      .split("-")
                      .map(Number);
                    const date = new Date(year, month - 1, day);
                    setEditingSubscriptionData({
                      ...editingSubscriptionData,
                      startDate: date,
                    });
                  }}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Próximo Pago
                </label>
                <Input
                  id="edit-nextBillingDate"
                  type="date"
                  value={formatDateForInput(
                    editingSubscriptionData.nextBillingDate
                  )}
                  onChange={(e) => {
                    // Manejo correcto como en Events
                    if (e.target.value) {
                      const [year, month, day] = e.target.value
                        .split("-")
                        .map(Number);
                      const date = new Date(year, month - 1, day);
                      setEditingSubscriptionData({
                        ...editingSubscriptionData,
                        nextBillingDate: date,
                      });
                    } else {
                      setEditingSubscriptionData({
                        ...editingSubscriptionData,
                        nextBillingDate: undefined,
                      });
                    }
                  }}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label>
                <input
                  type="checkbox"
                  checked={editingSubscriptionData.isActive}
                  onChange={(e) =>
                    setEditingSubscriptionData({
                      ...editingSubscriptionData,
                      isActive: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                Suscripción activa
              </Label>
            </div>

            <div>
              <Label htmlFor="edit-tags">Etiquetas</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Agregar etiqueta..."
                  value={editTagInput}
                  onChange={(e) => setEditTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag(true)}
                />
                <Button type="button" onClick={() => addTag(true)}>
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editingSubscriptionData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag, true)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="submit"
                disabled={isUpdating}
                className="flex-1 hover:bg-blue-500 hover:text-white transition-colors duration-300"
                onClick={handleUpdateSubscription}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Suscripción"
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
          </div>
        </div>
      </Modal>
    </>
  );
}
