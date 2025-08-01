"use client";

import { useState, useMemo } from "react";
import { Subscription } from "@/types";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import {
  SubscriptionsHeader,
  SubscriptionsStats,
  SubscriptionsFilters,
  SubscriptionsGrid,
  SubscriptionsModals,
} from "./components";

export default function SubscriptionsView() {
  const {
    subscriptions,
    loading,
    error,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions();

  // Estados para modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBillingCycle, setSelectedBillingCycle] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Filtrar suscripciones
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((subscription) => {
      const matchesSearch =
        subscription.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        subscription.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesType = !selectedType || subscription.type === selectedType;
      const matchesCategory =
        !selectedCategory || subscription.category === selectedCategory;
      const matchesBillingCycle =
        !selectedBillingCycle ||
        subscription.billingCycle === selectedBillingCycle;
      const matchesStatus =
        !selectedStatus ||
        (selectedStatus === "active" && subscription.isActive) ||
        (selectedStatus === "inactive" && !subscription.isActive);

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesBillingCycle &&
        matchesStatus
      );
    });
  }, [
    subscriptions,
    searchTerm,
    selectedType,
    selectedCategory,
    selectedBillingCycle,
    selectedStatus,
  ]);

  // Handlers para modales
  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta suscripción?")
    ) {
      try {
        await deleteSubscription(id);
      } catch (error) {
        console.error("Error deleting subscription:", error);
      }
    }
  };

  const handleAddSubscription = async (
    subscription: Omit<
      Subscription,
      "id" | "userId" | "createdAt" | "updatedAt"
    >
  ) => {
    try {
      await createSubscription(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  };

  const handleUpdateSubscription = async (
    id: string,
    subscription: Partial<Subscription>
  ) => {
    try {
      await updateSubscription(id, subscription);
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando suscripciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">Error</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SubscriptionsHeader onAddNew={handleAddNew} />

      <SubscriptionsStats subscriptions={subscriptions} />

      <SubscriptionsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedBillingCycle={selectedBillingCycle}
        onBillingCycleChange={setSelectedBillingCycle}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <SubscriptionsGrid
        subscriptions={filteredSubscriptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SubscriptionsModals
        isAddModalOpen={isAddModalOpen}
        isEditModalOpen={isEditModalOpen}
        editingSubscription={editingSubscription}
        onCloseAddModal={() => setIsAddModalOpen(false)}
        onCloseEditModal={() => {
          setIsEditModalOpen(false);
          setEditingSubscription(null);
        }}
        onAddSubscription={handleAddSubscription}
        onUpdateSubscription={handleUpdateSubscription}
      />
    </div>
  );
}
