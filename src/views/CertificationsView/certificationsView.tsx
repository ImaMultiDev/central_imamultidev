"use client";

import { useState, useEffect } from "react";
import { Certification, CertificationType, CertificationLevel } from "@/types";
import { useCertifications } from "@/hooks/useCertifications";
import {
  CertificationsHeader,
  CertificationsStats,
  CertificationsFilters,
  CertificationsGrid,
  CertificationsModals,
} from "./components";

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

export function CertificationsView() {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCertificationModalOpen, setIsCertificationModalOpen] =
    useState(false);
  const [editingCertification, setEditingCertification] =
    useState<Certification | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [newCertification, setNewCertification] = useState<NewCertification>({
    title: "",
    description: "",
    type: "" as CertificationType,
    level: "" as CertificationLevel,
    startDate: new Date(),
    endDate: undefined,
    certificateUrl: "",
    docsUrl: "",
    logoImage: "",
    badgeImage: "",
    notes: "",
    tags: [],
    tagsInput: "",
  });

  const {
    certifications,
    createCertification,
    updateCertification,
    deleteCertification,
  } = useCertifications();

  const filteredCertifications = certifications.filter((certification) => {
    const matchesType =
      selectedType === "ALL" || certification.type === selectedType;
    const matchesLevel =
      selectedLevel === "ALL" || certification.level === selectedLevel;
    const matchesSearch =
      certification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (certification.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      certification.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesType && matchesLevel && matchesSearch;
  });

  const handleCreateCertification = async () => {
    try {
      setIsCreating(true);
      await createCertification({
        title: newCertification.title,
        description: newCertification.description || undefined,
        type: newCertification.type,
        level: newCertification.level,
        startDate: newCertification.startDate.toISOString(),
        endDate: newCertification.endDate?.toISOString(),
        certificateUrl: newCertification.certificateUrl || undefined,
        docsUrl: newCertification.docsUrl || undefined,
        logoImage: newCertification.logoImage || undefined,
        badgeImage: newCertification.badgeImage || undefined,
        notes: newCertification.notes || undefined,
        tags: newCertification.tags,
      });
      setIsCertificationModalOpen(false);
      setNewCertification({
        title: "",
        description: "",
        type: "" as CertificationType,
        level: "" as CertificationLevel,
        startDate: new Date(),
        endDate: undefined,
        certificateUrl: "",
        docsUrl: "",
        logoImage: "",
        badgeImage: "",
        notes: "",
        tags: [],
        tagsInput: "",
      });
    } catch (error) {
      console.error("Error creating certification:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCertification = async () => {
    if (!editingCertification) return;

    try {
      setIsUpdating(true);
      await updateCertification(editingCertification.id, {
        title: editingCertification.title,
        description: editingCertification.description || undefined,
        type: editingCertification.type,
        level: editingCertification.level,
        startDate: editingCertification.startDate.toISOString(),
        endDate: editingCertification.endDate?.toISOString(),
        certificateUrl: editingCertification.certificateUrl || undefined,
        docsUrl: editingCertification.docsUrl || undefined,
        logoImage: editingCertification.logoImage || undefined,
        badgeImage: editingCertification.badgeImage || undefined,
        notes: editingCertification.notes || undefined,
        tags: editingCertification.tags,
      });
      setIsEditModalOpen(false);
      setEditingCertification(null);
    } catch (error) {
      console.error("Error updating certification:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCertification = async (certificationId: string) => {
    try {
      setIsDeleting(certificationId);
      await deleteCertification(certificationId);
    } catch (error) {
      console.error("Error deleting certification:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditCertification = (certification: Certification) => {
    setEditingCertification(certification);
    setIsEditModalOpen(true);
  };

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".certification-menu-button")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <CertificationsHeader
        onAddCertification={() => setIsCertificationModalOpen(true)}
      />

      <CertificationsStats certifications={certifications} />

      <CertificationsFilters
        searchQuery={searchQuery}
        selectedType={selectedType}
        selectedLevel={selectedLevel}
        onSearchChange={setSearchQuery}
        onTypeChange={setSelectedType}
        onLevelChange={setSelectedLevel}
      />

      <CertificationsGrid
        certifications={filteredCertifications}
        onEditCertification={handleEditCertification}
        onDeleteCertification={handleDeleteCertification}
        openMenuId={openMenuId}
        onOpenMenuChange={setOpenMenuId}
        isDeleting={isDeleting}
        onAddCertification={() => setIsCertificationModalOpen(true)}
      />

      <CertificationsModals
        isCertificationModalOpen={isCertificationModalOpen}
        onCertificationModalClose={() => setIsCertificationModalOpen(false)}
        isEditModalOpen={isEditModalOpen}
        onEditModalClose={() => setIsEditModalOpen(false)}
        newCertification={newCertification}
        onNewCertificationChange={setNewCertification}
        editingCertification={editingCertification}
        onEditingCertificationChange={setEditingCertification}
        isCreating={isCreating}
        isUpdating={isUpdating}
        onCreateCertification={handleCreateCertification}
        onUpdateCertification={handleUpdateCertification}
      />
    </div>
  );
}
