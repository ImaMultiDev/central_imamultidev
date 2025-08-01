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
import { Select } from "@/components/ui/select";
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
}

export default function SubscriptionsModals({
  isAddModalOpen,
  isEditModalOpen,
  editingSubscription,
  onCloseAddModal,
  onCloseEditModal,
  onAddSubscription,
  onUpdateSubscription,
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
    if (editingSubscription) {
      onUpdateSubscription(editingSubscription.id, editingSubscriptionData);
      setEditTagInput("");
      onCloseEditModal();
    }
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

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  return (
    <>
      {/* Modal Agregar Suscripción */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        title="Agregar Nueva Suscripción"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
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
            <Label htmlFor="description">Descripción</Label>
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
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://..."
              value={newSubscription.url}
              onChange={(e) =>
                setNewSubscription({ ...newSubscription, url: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select
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
                <option value={SubscriptionType.DEVELOPMENT}>Desarrollo</option>
                <option value={SubscriptionType.ENTERTAINMENT}>
                  Entretenimiento
                </option>
                <option value={SubscriptionType.EDUCATION}>Educación</option>
                <option value={SubscriptionType.NEWS}>Noticias</option>
                <option value={SubscriptionType.FITNESS}>Fitness</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={newSubscription.category}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    category: e.target.value as SubscriptionCategory,
                  })
                }
              >
                <option value={SubscriptionCategory.WORK}>Trabajo</option>
                <option value={SubscriptionCategory.PERSONAL}>Personal</option>
                <option value={SubscriptionCategory.ENTERTAINMENT}>
                  Entretenimiento
                </option>
                <option value={SubscriptionCategory.EDUCATION}>
                  Educación
                </option>
                <option value={SubscriptionCategory.HEALTH}>Salud</option>
                <option value={SubscriptionCategory.FINANCE}>Finanzas</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Precio *</Label>
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
              <Label htmlFor="billingCycle">Ciclo de Facturación *</Label>
              <Select
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
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <Input
                id="startDate"
                type="date"
                value={formatDateForInput(newSubscription.startDate)}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    startDate: new Date(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="nextBillingDate">Próximo Pago</Label>
              <Input
                id="nextBillingDate"
                type="date"
                value={formatDateForInput(newSubscription.nextBillingDate)}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    nextBillingDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label>
              <input
                type="checkbox"
                checked={newSubscription.isActive}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    isActive: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Suscripción activa
            </Label>
          </div>

          <div>
            <Label htmlFor="tags">Etiquetas</Label>
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

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCloseAddModal}>
              Cancelar
            </Button>
            <Button onClick={handleAddSubscription}>Agregar Suscripción</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Editar Suscripción */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        title="Editar Suscripción"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Título *</Label>
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
            <Label htmlFor="edit-description">Descripción</Label>
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
            <Label htmlFor="edit-url">URL</Label>
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
              <Label htmlFor="edit-type">Tipo *</Label>
              <Select
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
                <option value={SubscriptionType.DEVELOPMENT}>Desarrollo</option>
                <option value={SubscriptionType.ENTERTAINMENT}>
                  Entretenimiento
                </option>
                <option value={SubscriptionType.EDUCATION}>Educación</option>
                <option value={SubscriptionType.NEWS}>Noticias</option>
                <option value={SubscriptionType.FITNESS}>Fitness</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-category">Categoría *</Label>
              <Select
                value={editingSubscriptionData.category}
                onChange={(e) =>
                  setEditingSubscriptionData({
                    ...editingSubscriptionData,
                    category: e.target.value as SubscriptionCategory,
                  })
                }
              >
                <option value={SubscriptionCategory.WORK}>Trabajo</option>
                <option value={SubscriptionCategory.PERSONAL}>Personal</option>
                <option value={SubscriptionCategory.ENTERTAINMENT}>
                  Entretenimiento
                </option>
                <option value={SubscriptionCategory.EDUCATION}>
                  Educación
                </option>
                <option value={SubscriptionCategory.HEALTH}>Salud</option>
                <option value={SubscriptionCategory.FINANCE}>Finanzas</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-price">Precio *</Label>
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
              <Label htmlFor="edit-billingCycle">Ciclo de Facturación *</Label>
              <Select
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
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-startDate">Fecha de Inicio *</Label>
              <Input
                id="edit-startDate"
                type="date"
                value={formatDateForInput(editingSubscriptionData.startDate)}
                onChange={(e) =>
                  setEditingSubscriptionData({
                    ...editingSubscriptionData,
                    startDate: new Date(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="edit-nextBillingDate">Próximo Pago</Label>
              <Input
                id="edit-nextBillingDate"
                type="date"
                value={formatDateForInput(
                  editingSubscriptionData.nextBillingDate
                )}
                onChange={(e) =>
                  setEditingSubscriptionData({
                    ...editingSubscriptionData,
                    nextBillingDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
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

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCloseEditModal}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateSubscription}>
              Actualizar Suscripción
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
