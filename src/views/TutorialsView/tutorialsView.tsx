"use client";

import { useState, useEffect } from "react";
import { Tutorial, TutorialStatus } from "@/types";
import { useTutorials } from "@/hooks/useTutorials";
import {
  TutorialsHeader,
  TutorialsStats,
  TutorialsFilters,
  TutorialsGrid,
  TutorialsModals,
} from "./components";

export function TutorialsView() {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState<string | null>(null);
  const [newTutorial, setNewTutorial] = useState({
    title: "",
    description: "",
    platform: "",
    url: "",
    docsUrl: "",
    notes: "",
    tags: [] as string[],
    tagsInput: "",
    status: "POR_COMENZAR" as TutorialStatus,
  });

  const {
    tutorials,
    createTutorial,
    updateTutorialStatus,
    updateTutorial,
    deleteTutorial,
  } = useTutorials();

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesStatus =
      selectedStatus === "ALL" || tutorial.status === selectedStatus;
    const matchesPlatform =
      selectedPlatform === "ALL" || tutorial.platform === selectedPlatform;
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tutorial.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );

    return matchesStatus && matchesPlatform && matchesSearch;
  });

  const handleCreateTutorial = async () => {
    try {
      setIsCreating(true);
      await createTutorial(newTutorial);
      setIsTutorialModalOpen(false);
      setNewTutorial({
        title: "",
        description: "",
        platform: "",
        url: "",
        docsUrl: "",
        notes: "",
        tags: [],
        tagsInput: "",
        status: "POR_COMENZAR" as TutorialStatus,
      });
    } catch (error) {
      console.error("Error al crear tutorial:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusChange = async (
    tutorialId: string,
    newStatus: TutorialStatus
  ) => {
    try {
      setIsStatusUpdating(tutorialId);
      await updateTutorialStatus(tutorialId, newStatus);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    } finally {
      setIsStatusUpdating(null);
    }
  };

  const handleEditTutorial = (tutorial: Tutorial) => {
    setEditingTutorial({
      ...tutorial,
      tagsInput: "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateTutorial = async () => {
    if (!editingTutorial) return;

    try {
      setIsUpdating(true);
      await updateTutorial(editingTutorial.id, {
        title: editingTutorial.title,
        description: editingTutorial.description || "",
        platform: editingTutorial.platform,
        url: editingTutorial.url || "",
        docsUrl: editingTutorial.docsUrl || "",
        notes: editingTutorial.notes || "",
        tags: editingTutorial.tags || [],
        status: editingTutorial.status,
      });
      setIsEditModalOpen(false);
      setEditingTutorial(null);
    } catch (error) {
      console.error("Error al actualizar tutorial:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTutorial = async (tutorialId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este tutorial?"))
      return;

    try {
      setIsDeleting(tutorialId);
      await deleteTutorial(tutorialId);
    } catch (error) {
      console.error("Error al eliminar tutorial:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".tutorial-menu-button")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const stats = {
    total: tutorials.length,
    inProgress: tutorials.filter((t) => t.status === "EN_PROGRESO").length,
    completed: tutorials.filter((t) => t.status === "COMPLETADO").length,
    notStarted: tutorials.filter((t) => t.status === "POR_COMENZAR").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <TutorialsHeader
        onAddTutorial={() => setIsTutorialModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Stats */}
      <TutorialsStats stats={stats} />

      {/* Filters */}
      <TutorialsFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
      />

      {/* Grid */}
      <TutorialsGrid
        tutorials={filteredTutorials}
        onStatusChange={handleStatusChange}
        onEditTutorial={handleEditTutorial}
        onDeleteTutorial={handleDeleteTutorial}
        openMenuId={openMenuId}
        onOpenMenuChange={setOpenMenuId}
        isDeleting={isDeleting}
        isStatusUpdating={isStatusUpdating}
        onAddTutorial={() => setIsTutorialModalOpen(true)}
      />

      {/* Modals */}
      <TutorialsModals
        isTutorialModalOpen={isTutorialModalOpen}
        onTutorialModalClose={() => setIsTutorialModalOpen(false)}
        isEditModalOpen={isEditModalOpen}
        onEditModalClose={() => setIsEditModalOpen(false)}
        newTutorial={newTutorial}
        onNewTutorialChange={setNewTutorial}
        editingTutorial={editingTutorial}
        onEditingTutorialChange={setEditingTutorial}
        isCreating={isCreating}
        isUpdating={isUpdating}
        onCreateTutorial={handleCreateTutorial}
        onUpdateTutorial={handleUpdateTutorial}
      />
    </div>
  );
}
