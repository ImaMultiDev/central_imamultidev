"use client";

import { useState, useEffect } from "react";
import { DocumentationType, DocumentationCategory } from "@/types";
import { useDocumentation } from "@/hooks/useDocumentation";
import { Documentation } from "@/types";
import { DocsHeader } from "./components/DocsHeader";
import { DocsStats } from "./components/DocsStats";
import { DocsFilters } from "./components/DocsFilters";
import { DocsGrid } from "./components/DocsGrid";
import { DocsModals } from "./components/DocsModals";

const typeColors = {
  DOCUMENTACION_OFICIAL: "bg-blue-500",
  TUTORIAL: "bg-green-500",
  CHEAT_SHEET: "bg-purple-500",
  ARTICULO: "bg-orange-500",
  VIDEO: "bg-red-500",
};

const typeLabels = {
  DOCUMENTACION_OFICIAL: "Documentación",
  TUTORIAL: "Tutorial",
  CHEAT_SHEET: "Cheat Sheet",
  ARTICULO: "Artículo",
  VIDEO: "Video",
};

const categoryLabels = {
  MULTIPLATAFORMA: "Multiplataforma",
  BACKEND: "Backend",
  BASES_DATOS: "Bases de Datos",
  FRONTEND: "Frontend",
  CIENCIA_DATOS: "Ciencia de Datos",
  LENGUAJES: "Lenguajes",
};

const categoryColors = {
  MULTIPLATAFORMA: "bg-indigo-500",
  BACKEND: "bg-green-600",
  BASES_DATOS: "bg-yellow-500",
  FRONTEND: "bg-blue-600",
  CIENCIA_DATOS: "bg-purple-600",
  LENGUAJES: "bg-red-600",
};

export function DocsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Documentation | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    url: "",
    type: "DOCUMENTACION_OFICIAL" as DocumentationType,
    category: "FRONTEND" as DocumentationCategory,
    tags: [] as string[],
  });
  const [tempTagsInput, setTempTagsInput] = useState("");
  const [editingTagsInput, setEditingTagsInput] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const {
    documentation,
    createDocumentation,
    updateDocumentation,
    deleteDocumentation,
  } = useDocumentation();

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".doc-menu-button")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filteredDocuments = documentation.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType = selectedType === "ALL" || doc.type === selectedType;
    const matchesCategory =
      selectedCategory === "ALL" || doc.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const stats = {
    total: documentation.length,
    byCategory: Object.keys(categoryLabels).reduce((acc, cat) => {
      acc[cat] = documentation.filter((d) => d.category === cat).length;
      return acc;
    }, {} as Record<string, number>),
  };

  const handleCreateDocument = async () => {
    try {
      await createDocumentation(newDocument);
      setIsDocModalOpen(false);
      setNewDocument({
        title: "",
        description: "",
        url: "",
        type: "DOCUMENTACION_OFICIAL" as DocumentationType,
        category: "FRONTEND" as DocumentationCategory,
        tags: [],
      });
      setTempTagsInput("");
    } catch (error) {
      console.error("Error al crear documento:", error);
    }
  };

  const handleEditDocument = (doc: Documentation) => {
    setEditingDoc(doc);
    setEditingTagsInput(doc.tags.join(", "));
    setIsEditModalOpen(true);
  };

  const handleUpdateDocument = async () => {
    if (!editingDoc) return;

    try {
      await updateDocumentation(editingDoc.id, {
        title: editingDoc.title,
        description: editingDoc.description || "",
        url: editingDoc.url,
        type: editingDoc.type,
        category: editingDoc.category,
        tags: editingDoc.tags,
      });
      setIsEditModalOpen(false);
      setEditingDoc(null);
    } catch (error) {
      console.error("Error al actualizar documento:", error);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este documento?"))
      return;

    try {
      await deleteDocumentation(docId);
    } catch (error) {
      console.error("Error al eliminar documento:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DocsHeader onAddDocument={() => setIsDocModalOpen(true)} />

      {/* Stats */}
      <DocsStats stats={stats} />

      {/* Filters */}
      <DocsFilters
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

      {/* Documents Grid */}
      <DocsGrid
        documents={filteredDocuments}
        onEditDocument={handleEditDocument}
        onDeleteDocument={handleDeleteDocument}
        openMenuId={openMenuId}
        onOpenMenuChange={setOpenMenuId}
        typeColors={typeColors}
        typeLabels={typeLabels}
        categoryColors={categoryColors}
        categoryLabels={categoryLabels}
      />

      {/* Modals */}
      <DocsModals
        isDocModalOpen={isDocModalOpen}
        isEditModalOpen={isEditModalOpen}
        editingDoc={editingDoc}
        newDocument={newDocument}
        tempTagsInput={tempTagsInput}
        editingTagsInput={editingTagsInput}
        onCloseDocModal={() => setIsDocModalOpen(false)}
        onCloseEditModal={() => {
          setIsEditModalOpen(false);
          setEditingDoc(null);
          setEditingTagsInput("");
        }}
        onCreateDocument={handleCreateDocument}
        onUpdateDocument={handleUpdateDocument}
        onNewDocumentChange={setNewDocument}
        onEditingDocChange={setEditingDoc}
        onTempTagsInputChange={setTempTagsInput}
        onEditingTagsInputChange={setEditingTagsInput}
      />
    </div>
  );
}
