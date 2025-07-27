"use client";

import { useState, useEffect } from "react";
import { DataAnalyticsType, DataAnalyticsCategory } from "@/types";
import { useDataAnalytics } from "@/hooks/useDataAnalytics";
import { DataAnalytics } from "@/types";
import { DataAnalyticsHeader } from "./components/DataAnalyticsHeader";
import { DataAnalyticsStats } from "./components/DataAnalyticsStats";
import { DataAnalyticsFilters } from "./components/DataAnalyticsFilters";
import { DataAnalyticsGrid } from "./components/DataAnalyticsGrid";
import { DataAnalyticsModals } from "./components/DataAnalyticsModals";

const typeColors = {
  BUSINESS_INTELLIGENCE: "bg-blue-500",
  DATA_PROCESSING: "bg-green-500",
  MACHINE_LEARNING: "bg-purple-500",
  DATA_VISUALIZATION: "bg-orange-500",
  ETL_ELT: "bg-red-500",
  CLOUD_ANALYTICS: "bg-indigo-500",
};

const typeLabels = {
  BUSINESS_INTELLIGENCE: "Business Intelligence",
  DATA_PROCESSING: "Data Processing",
  MACHINE_LEARNING: "Machine Learning",
  DATA_VISUALIZATION: "Data Visualization",
  ETL_ELT: "ETL/ELT",
  CLOUD_ANALYTICS: "Cloud Analytics",
};

const categoryLabels = {
  DASHBOARDS: "Dashboards",
  SELF_SERVICE_BI: "Self-Service BI",
  CLOUD_ANALYTICS: "Cloud Analytics",
  DATA_LAKES: "Data Lakes",
  ETL_ELT: "ETL/ELT",
  ML_PLATFORMS: "ML Platforms",
  AUTOML: "AutoML",
  MLOPS: "MLOps",
  ADVANCED_VIZ: "Advanced Viz",
  STATISTICAL: "Statistical",
};

const categoryColors = {
  DASHBOARDS: "bg-indigo-500",
  SELF_SERVICE_BI: "bg-green-600",
  CLOUD_ANALYTICS: "bg-yellow-500",
  DATA_LAKES: "bg-blue-600",
  ETL_ELT: "bg-purple-600",
  ML_PLATFORMS: "bg-red-600",
  AUTOML: "bg-teal-600",
  MLOPS: "bg-pink-600",
  ADVANCED_VIZ: "bg-orange-600",
  STATISTICAL: "bg-cyan-600",
};

export function DataAnalyticsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isDataAnalyticsModalOpen, setIsDataAnalyticsModalOpen] =
    useState(false);
  const [editingDataAnalytics, setEditingDataAnalytics] =
    useState<DataAnalytics | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newDataAnalytics, setNewDataAnalytics] = useState({
    title: "",
    description: "",
    url: "",
    type: "BUSINESS_INTELLIGENCE" as DataAnalyticsType,
    category: "DASHBOARDS" as DataAnalyticsCategory,
    tags: [] as string[],
  });
  const [tempTagsInput, setTempTagsInput] = useState("");
  const [editingTagsInput, setEditingTagsInput] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const {
    dataAnalytics,
    createDataAnalytics,
    updateDataAnalytics,
    deleteDataAnalytics,
  } = useDataAnalytics();

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".data-analytics-menu-button")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filteredDataAnalytics = dataAnalytics.filter((item) => {
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
    total: dataAnalytics.length,
    byCategory: Object.keys(categoryLabels).reduce((acc, cat) => {
      acc[cat] = dataAnalytics.filter((d) => d.category === cat).length;
      return acc;
    }, {} as Record<string, number>),
  };

  const handleCreateDataAnalytics = async () => {
    try {
      setIsCreating(true);
      await createDataAnalytics(newDataAnalytics);
      setIsDataAnalyticsModalOpen(false);
      setNewDataAnalytics({
        title: "",
        description: "",
        url: "",
        type: "BUSINESS_INTELLIGENCE" as DataAnalyticsType,
        category: "DASHBOARDS" as DataAnalyticsCategory,
        tags: [],
      });
      setTempTagsInput("");
    } catch (error) {
      console.error("Error al crear data analytics:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditDataAnalytics = (item: DataAnalytics) => {
    setEditingDataAnalytics(item);
    setEditingTagsInput(item.tags.join(", "));
    setIsEditModalOpen(true);
  };

  const handleUpdateDataAnalytics = async () => {
    if (!editingDataAnalytics) return;

    try {
      setIsUpdating(true);
      await updateDataAnalytics(editingDataAnalytics.id, {
        title: editingDataAnalytics.title,
        description: editingDataAnalytics.description || "",
        url: editingDataAnalytics.url,
        type: editingDataAnalytics.type,
        category: editingDataAnalytics.category,
        tags: editingDataAnalytics.tags,
      });
      setIsEditModalOpen(false);
      setEditingDataAnalytics(null);
    } catch (error) {
      console.error("Error al actualizar data analytics:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteDataAnalytics = async (itemId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este elemento?"))
      return;

    try {
      setIsDeleting(itemId);
      await deleteDataAnalytics(itemId);
    } catch (error) {
      console.error("Error al eliminar data analytics:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleNewDataAnalyticsChange = (newDataAnalytics: {
    title: string;
    description: string;
    url: string;
    type: DataAnalyticsType;
    category: DataAnalyticsCategory;
    tags: string[];
  }) => {
    setNewDataAnalytics(newDataAnalytics);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DataAnalyticsHeader
        onAddDataAnalytics={() => setIsDataAnalyticsModalOpen(true)}
      />

      {/* Stats */}
      <DataAnalyticsStats stats={stats} />

      {/* Filters */}
      <DataAnalyticsFilters
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

      {/* Data Analytics Grid */}
      <DataAnalyticsGrid
        dataAnalytics={filteredDataAnalytics}
        onEditDataAnalytics={handleEditDataAnalytics}
        onDeleteDataAnalytics={handleDeleteDataAnalytics}
        openMenuId={openMenuId}
        onOpenMenuChange={setOpenMenuId}
        isDeleting={isDeleting}
        typeColors={typeColors}
        typeLabels={typeLabels}
        categoryColors={categoryColors}
        categoryLabels={categoryLabels}
      />

      {/* Modals */}
      <DataAnalyticsModals
        isDataAnalyticsModalOpen={isDataAnalyticsModalOpen}
        isEditModalOpen={isEditModalOpen}
        editingDataAnalytics={editingDataAnalytics}
        newDataAnalytics={newDataAnalytics}
        tempTagsInput={tempTagsInput}
        editingTagsInput={editingTagsInput}
        isCreating={isCreating}
        isUpdating={isUpdating}
        onCloseDataAnalyticsModal={() => setIsDataAnalyticsModalOpen(false)}
        onCloseEditModal={() => {
          setIsEditModalOpen(false);
          setEditingDataAnalytics(null);
          setEditingTagsInput("");
        }}
        onCreateDataAnalytics={handleCreateDataAnalytics}
        onUpdateDataAnalytics={handleUpdateDataAnalytics}
        onNewDataAnalyticsChange={handleNewDataAnalyticsChange}
        onEditingDataAnalyticsChange={setEditingDataAnalytics}
        onTempTagsInputChange={setTempTagsInput}
        onEditingTagsInputChange={setEditingTagsInput}
      />
    </div>
  );
}
