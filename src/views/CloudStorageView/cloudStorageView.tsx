"use client";

import { useState, useEffect } from "react";
import { CloudStorageType, CloudStorageCategory } from "@/types";
import { useCloudStorage } from "@/hooks/useCloudStorage";
import { CloudStorage } from "@/types";
import { CloudStorageHeader } from "./components/CloudStorageHeader";
import { CloudStorageStats } from "./components/CloudStorageStats";
import { CloudStorageFilters } from "./components/CloudStorageFilters";
import { CloudStorageGrid } from "./components/CloudStorageGrid";
import { CloudStorageModals } from "./components/CloudStorageModals";

const typeColors = {
  PERSONAL_STORAGE: "bg-blue-500",
  HIGH_CAPACITY: "bg-green-500",
  COLLABORATION: "bg-purple-500",
  BACKUP: "bg-orange-500",
  FILE_TRANSFER: "bg-red-500",
  NOTE_TAKING: "bg-indigo-500",
  HOSTING: "bg-teal-500",
  CLOUD_PROVIDERS: "bg-pink-500",
  DATABASES: "bg-yellow-500",
  CDN: "bg-cyan-500",
  CI_CD: "bg-violet-500",
  MONITORING: "bg-slate-500",
};

const typeLabels = {
  PERSONAL_STORAGE: "Personal Storage",
  HIGH_CAPACITY: "High Capacity",
  COLLABORATION: "Collaboration",
  BACKUP: "Backup",
  FILE_TRANSFER: "File Transfer",
  NOTE_TAKING: "Note Taking",
  HOSTING: "Hosting",
  CLOUD_PROVIDERS: "Cloud Providers",
  DATABASES: "Databases",
  CDN: "CDN",
  CI_CD: "CI/CD",
  MONITORING: "Monitoring",
};

const categoryLabels = {
  STORAGE_SYNC: "Storage & Sync",
  DEV_INFRASTRUCTURE: "Dev Infrastructure",
};

const categoryColors = {
  STORAGE_SYNC: "bg-indigo-500",
  DEV_INFRASTRUCTURE: "bg-green-600",
};

export function CloudStorageView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isCloudStorageModalOpen, setIsCloudStorageModalOpen] = useState(false);
  const [editingCloudStorage, setEditingCloudStorage] =
    useState<CloudStorage | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newCloudStorage, setNewCloudStorage] = useState({
    title: "",
    description: "",
    url: "",
    type: "PERSONAL_STORAGE" as CloudStorageType,
    category: "STORAGE_SYNC" as CloudStorageCategory,
    tags: [] as string[],
  });
  const [tempTagsInput, setTempTagsInput] = useState("");
  const [editingTagsInput, setEditingTagsInput] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const {
    cloudStorage,
    createCloudStorage,
    updateCloudStorage,
    deleteCloudStorage,
  } = useCloudStorage();

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".cloud-storage-menu-button")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filteredCloudStorage = cloudStorage.filter((item) => {
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
    total: cloudStorage.length,
    byCategory: Object.keys(categoryLabels).reduce((acc, cat) => {
      acc[cat] = cloudStorage.filter((d) => d.category === cat).length;
      return acc;
    }, {} as Record<string, number>),
  };

  const handleCreateCloudStorage = async () => {
    try {
      setIsCreating(true);
      await createCloudStorage(newCloudStorage);
      setIsCloudStorageModalOpen(false);
      setNewCloudStorage({
        title: "",
        description: "",
        url: "",
        type: "PERSONAL_STORAGE" as CloudStorageType,
        category: "STORAGE_SYNC" as CloudStorageCategory,
        tags: [],
      });
      setTempTagsInput("");
    } catch (error) {
      console.error("Error al crear cloud storage:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditCloudStorage = (item: CloudStorage) => {
    setEditingCloudStorage(item);
    setEditingTagsInput(item.tags.join(", "));
    setIsEditModalOpen(true);
  };

  const handleUpdateCloudStorage = async () => {
    if (!editingCloudStorage) return;

    try {
      setIsUpdating(true);
      await updateCloudStorage(editingCloudStorage.id, {
        title: editingCloudStorage.title,
        description: editingCloudStorage.description || "",
        url: editingCloudStorage.url,
        type: editingCloudStorage.type,
        category: editingCloudStorage.category,
        tags: editingCloudStorage.tags,
      });
      setIsEditModalOpen(false);
      setEditingCloudStorage(null);
    } catch (error) {
      console.error("Error al actualizar cloud storage:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCloudStorage = async (itemId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este elemento?"))
      return;

    try {
      setIsDeleting(itemId);
      await deleteCloudStorage(itemId);
    } catch (error) {
      console.error("Error al eliminar cloud storage:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleNewCloudStorageChange = (newCloudStorage: {
    title: string;
    description: string;
    url: string;
    type: CloudStorageType;
    category: CloudStorageCategory;
    tags: string[];
  }) => {
    setNewCloudStorage(newCloudStorage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <CloudStorageHeader
        onAddCloudStorage={() => setIsCloudStorageModalOpen(true)}
      />

      {/* Stats */}
      <CloudStorageStats stats={stats} />

      {/* Filters */}
      <CloudStorageFilters
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

      {/* Cloud Storage Grid */}
      <CloudStorageGrid
        cloudStorage={filteredCloudStorage}
        onEditCloudStorage={handleEditCloudStorage}
        onDeleteCloudStorage={handleDeleteCloudStorage}
        openMenuId={openMenuId}
        onOpenMenuChange={setOpenMenuId}
        isDeleting={isDeleting}
        typeColors={typeColors}
        typeLabels={typeLabels}
        categoryColors={categoryColors}
        categoryLabels={categoryLabels}
      />

      {/* Modals */}
      <CloudStorageModals
        isCloudStorageModalOpen={isCloudStorageModalOpen}
        isEditModalOpen={isEditModalOpen}
        editingCloudStorage={editingCloudStorage}
        newCloudStorage={newCloudStorage}
        tempTagsInput={tempTagsInput}
        editingTagsInput={editingTagsInput}
        isCreating={isCreating}
        isUpdating={isUpdating}
        onCloseCloudStorageModal={() => setIsCloudStorageModalOpen(false)}
        onCloseEditModal={() => {
          setIsEditModalOpen(false);
          setEditingCloudStorage(null);
          setEditingTagsInput("");
        }}
        onCreateCloudStorage={handleCreateCloudStorage}
        onUpdateCloudStorage={handleUpdateCloudStorage}
        onNewCloudStorageChange={handleNewCloudStorageChange}
        onEditingCloudStorageChange={setEditingCloudStorage}
        onTempTagsInputChange={setTempTagsInput}
        onEditingTagsInputChange={setEditingTagsInput}
      />
    </div>
  );
}
