"use client";

import { useState } from "react";
import { WorkshopType, WorkshopCategory } from "@/types";
import { useWorkshop } from "@/hooks/useWorkshop";
import { Workshop } from "@/types";
import {
  WorkshopHeader,
  WorkshopStats,
  WorkshopFilters,
  WorkshopGrid,
  WorkshopModals,
} from "./components";

const typeColors = {
  IMAGES: "bg-blue-500",
  VIDEO: "bg-green-500",
  AUDIO: "bg-purple-500",
  FILES: "bg-orange-500",
  GENERATORS: "bg-red-500",
  TESTING: "bg-indigo-500",
  ANALYSIS: "bg-teal-500",
};

const typeLabels = {
  IMAGES: "Imágenes",
  VIDEO: "Video",
  AUDIO: "Audio",
  FILES: "Archivos",
  GENERATORS: "Generadores",
  TESTING: "Testing",
  ANALYSIS: "Análisis",
};

const categoryLabels = {
  MULTIMEDIA_EDITING: "Edición Multimedia",
  MULTIMEDIA_CONVERSION: "Conversión Multimedia",
  UTILITIES: "Utilidades",
};

const categoryColors = {
  MULTIMEDIA_EDITING: "bg-blue-600",
  MULTIMEDIA_CONVERSION: "bg-green-600",
  UTILITIES: "bg-purple-600",
};

export function WorkshopView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newWorkshop, setNewWorkshop] = useState({
    title: "",
    description: "",
    url: "",
    type: "MULTIMEDIA_EDITING" as WorkshopType,
    category: "IMAGES" as WorkshopCategory,
    tags: [] as string[],
  });
  const [tempTagsInput, setTempTagsInput] = useState("");
  const [editingTagsInput, setEditingTagsInput] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { workshop, createWorkshop, updateWorkshop, deleteWorkshop } =
    useWorkshop();

  const filteredWorkshop = workshop.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType = selectedType === "ALL" || item.type === selectedType;
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const stats = {
    total: workshop.length,
    byCategory: workshop.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const handleCreateWorkshop = async () => {
    try {
      setIsCreating(true);
      await createWorkshop(newWorkshop);
      setIsWorkshopModalOpen(false);
      setNewWorkshop({
        title: "",
        description: "",
        url: "",
        type: "IMAGES" as WorkshopType,
        category: "MULTIMEDIA_EDITING" as WorkshopCategory,
        tags: [],
      });
      setTempTagsInput("");
    } catch (error) {
      console.error("Error al crear workshop:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditWorkshop = (item: Workshop) => {
    setEditingWorkshop(item);
    setEditingTagsInput(item.tags.join(", "));
    setIsEditModalOpen(true);
  };

  const handleUpdateWorkshop = async () => {
    if (!editingWorkshop) return;

    try {
      setIsUpdating(true);
      await updateWorkshop(editingWorkshop.id, {
        title: editingWorkshop.title,
        description: editingWorkshop.description || "",
        url: editingWorkshop.url,
        type: editingWorkshop.type,
        category: editingWorkshop.category,
        tags: editingWorkshop.tags,
      });
      setIsEditModalOpen(false);
      setEditingWorkshop(null);
    } catch (error) {
      console.error("Error al actualizar workshop:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteWorkshop = async (itemId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este elemento?"))
      return;

    try {
      setIsDeleting(itemId);
      await deleteWorkshop(itemId);
    } catch (error) {
      console.error("Error al eliminar workshop:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleNewWorkshopChange = (newWorkshop: {
    title: string;
    description: string;
    url: string;
    type: WorkshopType;
    category: WorkshopCategory;
    tags: string[];
  }) => {
    setNewWorkshop(newWorkshop);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <WorkshopHeader onAddWorkshop={() => setIsWorkshopModalOpen(true)} />

      {/* Stats */}
      <WorkshopStats stats={stats} />

      {/* Filters */}
      <WorkshopFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        typeColors={typeColors}
        typeLabels={typeLabels}
        categoryColors={categoryColors}
        categoryLabels={categoryLabels}
      />

      {/* Grid */}
      <WorkshopGrid
        workshop={filteredWorkshop}
        onEditWorkshop={handleEditWorkshop}
        onDeleteWorkshop={handleDeleteWorkshop}
        openMenuId={openMenuId}
        onOpenMenuChange={setOpenMenuId}
        isDeleting={isDeleting}
        typeColors={typeColors}
        typeLabels={typeLabels}
        categoryColors={categoryColors}
        categoryLabels={categoryLabels}
      />

      {/* Modals */}
      <WorkshopModals
        isWorkshopModalOpen={isWorkshopModalOpen}
        isEditModalOpen={isEditModalOpen}
        editingWorkshop={editingWorkshop}
        newWorkshop={newWorkshop}
        tempTagsInput={tempTagsInput}
        editingTagsInput={editingTagsInput}
        isCreating={isCreating}
        isUpdating={isUpdating}
        onCloseWorkshopModal={() => setIsWorkshopModalOpen(false)}
        onCloseEditModal={() => setIsEditModalOpen(false)}
        onCreateWorkshop={handleCreateWorkshop}
        onUpdateWorkshop={handleUpdateWorkshop}
        onNewWorkshopChange={handleNewWorkshopChange}
        onEditingWorkshopChange={setEditingWorkshop}
        onTempTagsInputChange={setTempTagsInput}
        onEditingTagsInputChange={setEditingTagsInput}
      />
    </div>
  );
}
