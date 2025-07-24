"use client";

import { useState, useEffect } from "react";
import { Tool, ToolType, ToolCategory } from "@/types";
import { ToolsHeader } from "./components/ToolsHeader";
import { ToolsFilters } from "./components/ToolsFilters";
import { ToolsGrid } from "./components/ToolsGrid";
import { ToolsStats } from "./components/ToolsStats";
import { ToolsModals } from "./components/ToolsModals";

export function ToolsView() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [newTool, setNewTool] = useState({
    title: "",
    description: "",
    url: "",
    type: "" as ToolType,
    category: "" as ToolCategory,
    tags: [] as string[],
  });
  const [tempTagsInput, setTempTagsInput] = useState("");
  const [editingTagsInput, setEditingTagsInput] = useState("");

  // Colores para tipos de herramientas
  const typeColors: Record<string, string> = {
    DESPLIEGUE: "bg-blue-500",
    DISENO: "bg-purple-500",
    MULTIMEDIA: "bg-pink-500",
    IA_GENERATIVA: "bg-green-500",
    DOCUMENTACION: "bg-orange-500",
    LEGAL: "bg-red-500",
    DESARROLLO: "bg-indigo-500",
    MONITOREO: "bg-teal-500",
    COMUNICACION: "bg-cyan-500",
  };

  const typeLabels: Record<string, string> = {
    DESPLIEGUE: "Despliegue",
    DISENO: "Diseño",
    MULTIMEDIA: "Multimedia",
    IA_GENERATIVA: "IA Generativa",
    DOCUMENTACION: "Documentación",
    LEGAL: "Legal",
    DESARROLLO: "Desarrollo",
    MONITOREO: "Monitoreo",
    COMUNICACION: "Comunicación",
  };

  // Colores para categorías de herramientas
  const categoryColors: Record<string, string> = {
    SERVICIOS_CLOUD: "bg-blue-600",
    HERRAMIENTAS_DISENO: "bg-purple-600",
    EDITORES_MULTIMEDIA: "bg-pink-600",
    IA_ARTE: "bg-green-600",
    IA_TEXTO: "bg-emerald-600",
    IA_CODIGO: "bg-teal-600",
    PLATAFORMAS_DOCS: "bg-orange-600",
    SERVICIOS_LEGALES: "bg-red-600",
    IDES_EDITORES: "bg-indigo-600",
    SERVICIOS_BASE_DATOS: "bg-cyan-600",
    AUTENTICACION: "bg-violet-600",
    ANALITICAS: "bg-slate-600",
    CHAT_COLABORACION: "bg-rose-600",
  };

  const categoryLabels: Record<string, string> = {
    SERVICIOS_CLOUD: "Servicios Cloud",
    HERRAMIENTAS_DISENO: "Herramientas Diseño",
    EDITORES_MULTIMEDIA: "Editores Multimedia",
    IA_ARTE: "IA Arte",
    IA_TEXTO: "IA Texto",
    IA_CODIGO: "IA Código",
    PLATAFORMAS_DOCS: "Plataformas Docs",
    SERVICIOS_LEGALES: "Servicios Legales",
    IDES_EDITORES: "IDEs/Editores",
    SERVICIOS_BASE_DATOS: "Servicios BD",
    AUTENTICACION: "Autenticación",
    ANALITICAS: "Analíticas",
    CHAT_COLABORACION: "Chat/Colaboración",
  };

  // Cargar herramientas
  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tools");
      if (response.ok) {
        const data = await response.json();
        setTools(data);
      }
    } catch (error) {
      console.error("Error fetching tools:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar herramientas
  const filteredTools = tools.filter((tool) => {
    const matchesType = selectedType === "ALL" || tool.type === selectedType;
    const matchesCategory =
      selectedCategory === "ALL" || tool.category === selectedCategory;
    const matchesSearch =
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesType && matchesCategory && matchesSearch;
  });

  // Agregar herramienta
  const handleAddTool = async () => {
    try {
      if (
        !newTool.title ||
        !newTool.url ||
        !newTool.type ||
        !newTool.category
      ) {
        alert("Por favor completa todos los campos obligatorios");
        return;
      }

      const response = await fetch("/api/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newTool,
          userId: "",
        }),
      });

      if (response.ok) {
        const createdTool = await response.json();
        setTools([...tools, createdTool]);
        setIsToolModalOpen(false);
        setNewTool({
          title: "",
          description: "",
          url: "",
          type: "" as ToolType,
          category: "" as ToolCategory,
          tags: [],
        });
        setTempTagsInput("");
      }
    } catch (error) {
      console.error("Error adding tool:", error);
    }
  };

  // Editar herramienta
  const handleEditTool = async (toolData: Tool) => {
    try {
      const response = await fetch(`/api/tools/${toolData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toolData),
      });

      if (response.ok) {
        const updatedTool = await response.json();
        setTools(
          tools.map((tool) => (tool.id === updatedTool.id ? updatedTool : tool))
        );
        setIsEditModalOpen(false);
        setEditingTool(null);
      }
    } catch (error) {
      console.error("Error updating tool:", error);
    }
  };

  // Eliminar herramienta
  const handleDeleteTool = async (toolId: string) => {
    try {
      const response = await fetch(`/api/tools/${toolId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTools(tools.filter((tool) => tool.id !== toolId));
      }
    } catch (error) {
      console.error("Error deleting tool:", error);
    }
  };

  const handleEditClick = (tool: Tool) => {
    setEditingTool(tool);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando herramientas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToolsHeader onAddTool={() => setIsToolModalOpen(true)} />

      <ToolsStats tools={tools} filteredTools={filteredTools} />

      <ToolsFilters
        selectedType={selectedType}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        onTypeChange={setSelectedType}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchTerm}
        typeLabels={typeLabels}
        categoryLabels={categoryLabels}
        typeColors={typeColors}
        categoryColors={categoryColors}
      />

      <ToolsGrid
        tools={filteredTools}
        onEditTool={handleEditClick}
        onDeleteTool={handleDeleteTool}
        typeColors={typeColors}
        typeLabels={typeLabels}
        categoryColors={categoryColors}
        categoryLabels={categoryLabels}
      />

      <ToolsModals
        isToolModalOpen={isToolModalOpen}
        isEditModalOpen={isEditModalOpen}
        editingTool={editingTool}
        newTool={newTool}
        tempTagsInput={tempTagsInput}
        editingTagsInput={editingTagsInput}
        onCloseToolModal={() => setIsToolModalOpen(false)}
        onCloseEditModal={() => {
          setIsEditModalOpen(false);
          setEditingTool(null);
        }}
        onCreateTool={handleAddTool}
        onUpdateTool={() => {
          if (editingTool) {
            handleEditTool(editingTool);
          }
        }}
        onNewToolChange={setNewTool}
        onEditingToolChange={setEditingTool}
        onTempTagsInputChange={setTempTagsInput}
        onEditingTagsInputChange={setEditingTagsInput}
      />
    </div>
  );
}
