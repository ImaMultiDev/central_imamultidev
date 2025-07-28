"use client";

import { useState } from "react";
import { GenerativeAIType, GenerativeAICategory } from "@/types";
import { useGenerativeAI } from "@/hooks/useGenerativeAI";
import { GenerativeAI } from "@/types";
import {
  GenerativeAIHeader,
  GenerativeAIStats,
  GenerativeAIFilters,
  GenerativeAIGrid,
  GenerativeAIModals,
} from "./components";

const typeColors = {
  TEXT: "bg-blue-500",
  CODE: "bg-green-500",
  IMAGES: "bg-purple-500",
  AUDIO: "bg-orange-500",
  VIDEO: "bg-red-500",
  PRODUCTIVITY: "bg-indigo-500",
};

const typeLabels = {
  TEXT: "Texto",
  CODE: "Código",
  IMAGES: "Imágenes",
  AUDIO: "Audio",
  VIDEO: "Video",
  PRODUCTIVITY: "Productividad",
};

const categoryLabels = {
  TEXT_GENERATION: "Generación de Texto",
  CODE_GENERATION: "Generación de Código",
  IMAGE_GENERATION: "Generación de Imágenes",
  AUDIO_GENERATION: "Generación de Audio",
  VIDEO_GENERATION: "Generación de Video",
  PRODUCTIVITY_TOOLS: "Herramientas de Productividad",
};

const categoryColors = {
  TEXT_GENERATION: "bg-blue-600",
  CODE_GENERATION: "bg-green-600",
  IMAGE_GENERATION: "bg-purple-600",
  AUDIO_GENERATION: "bg-orange-600",
  VIDEO_GENERATION: "bg-red-600",
  PRODUCTIVITY_TOOLS: "bg-indigo-600",
};

export function GenerativeAIView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isGenerativeAIModalOpen, setIsGenerativeAIModalOpen] = useState(false);
  const [editingGenerativeAI, setEditingGenerativeAI] =
    useState<GenerativeAI | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newGenerativeAI, setNewGenerativeAI] = useState({
    title: "",
    description: "",
    url: "",
    type: "TEXT" as GenerativeAIType,
    category: "TEXT_GENERATION" as GenerativeAICategory,
    tags: [] as string[],
  });
  const [tempTagsInput, setTempTagsInput] = useState("");
  const [editingTagsInput, setEditingTagsInput] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const {
    generativeAI: generativeAIs,
    createGenerativeAI,
    updateGenerativeAI,
    deleteGenerativeAI,
  } = useGenerativeAI();

  const filteredGenerativeAI = generativeAIs.filter((item) => {
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
    total: generativeAIs.length,
    byCategory: generativeAIs.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const handleCreateGenerativeAI = async () => {
    try {
      setIsCreating(true);
      await createGenerativeAI(newGenerativeAI);
      setIsGenerativeAIModalOpen(false);
      setNewGenerativeAI({
        title: "",
        description: "",
        url: "",
        type: "TEXT" as GenerativeAIType,
        category: "TEXT_GENERATION" as GenerativeAICategory,
        tags: [],
      });
      setTempTagsInput("");
    } catch (error) {
      console.error("Error al crear generative AI:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditGenerativeAI = (item: GenerativeAI) => {
    setEditingGenerativeAI(item);
    setEditingTagsInput(item.tags.join(", "));
    setIsEditModalOpen(true);
  };

  const handleUpdateGenerativeAI = async () => {
    if (!editingGenerativeAI) return;

    try {
      setIsUpdating(true);
      await updateGenerativeAI(editingGenerativeAI.id, {
        title: editingGenerativeAI.title,
        description: editingGenerativeAI.description || "",
        url: editingGenerativeAI.url,
        type: editingGenerativeAI.type,
        category: editingGenerativeAI.category,
        tags: editingGenerativeAI.tags,
      });
      setIsEditModalOpen(false);
      setEditingGenerativeAI(null);
    } catch (error) {
      console.error("Error al actualizar generative AI:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteGenerativeAI = async (itemId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este elemento?"))
      return;

    try {
      setIsDeleting(itemId);
      await deleteGenerativeAI(itemId);
    } catch (error) {
      console.error("Error al eliminar generative AI:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleNewGenerativeAIChange = (newGenerativeAI: {
    title: string;
    description: string;
    url: string;
    type: GenerativeAIType;
    category: GenerativeAICategory;
    tags: string[];
  }) => {
    setNewGenerativeAI(newGenerativeAI);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <GenerativeAIHeader
        onAddGenerativeAI={() => setIsGenerativeAIModalOpen(true)}
      />

      {/* Stats */}
      <GenerativeAIStats stats={stats} />

      {/* Filters */}
      <GenerativeAIFilters
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
      <GenerativeAIGrid
        generativeAI={filteredGenerativeAI}
        onEditGenerativeAI={handleEditGenerativeAI}
        onDeleteGenerativeAI={handleDeleteGenerativeAI}
        openMenuId={openMenuId}
        onOpenMenuChange={setOpenMenuId}
        isDeleting={isDeleting}
        typeColors={typeColors}
        typeLabels={typeLabels}
        categoryColors={categoryColors}
        categoryLabels={categoryLabels}
      />

      {/* Modals */}
      <GenerativeAIModals
        isGenerativeAIModalOpen={isGenerativeAIModalOpen}
        isEditModalOpen={isEditModalOpen}
        editingGenerativeAI={editingGenerativeAI}
        newGenerativeAI={newGenerativeAI}
        tempTagsInput={tempTagsInput}
        editingTagsInput={editingTagsInput}
        isCreating={isCreating}
        isUpdating={isUpdating}
        onCloseGenerativeAIModal={() => setIsGenerativeAIModalOpen(false)}
        onCloseEditModal={() => setIsEditModalOpen(false)}
        onCreateGenerativeAI={handleCreateGenerativeAI}
        onUpdateGenerativeAI={handleUpdateGenerativeAI}
        onNewGenerativeAIChange={handleNewGenerativeAIChange}
        onEditingGenerativeAIChange={setEditingGenerativeAI}
        onTempTagsInputChange={setTempTagsInput}
        onEditingTagsInputChange={setEditingTagsInput}
      />
    </div>
  );
}
