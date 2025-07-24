import { useState, useEffect } from "react";
import { Tool } from "@/types";

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/tools");
      if (!response.ok) {
        throw new Error("Error al cargar las herramientas");
      }
      const data = await response.json();
      setTools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const addTool = async (
    toolData: Omit<Tool, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toolData),
      });

      if (!response.ok) {
        throw new Error("Error al crear la herramienta");
      }

      const newTool = await response.json();
      setTools((prev) => [newTool, ...prev]);
      return newTool;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const updateTool = async (toolData: Tool) => {
    try {
      const response = await fetch(`/api/tools/${toolData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toolData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la herramienta");
      }

      const updatedTool = await response.json();
      setTools((prev) =>
        prev.map((tool) => (tool.id === updatedTool.id ? updatedTool : tool))
      );
      return updatedTool;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const deleteTool = async (toolId: string) => {
    try {
      const response = await fetch(`/api/tools/${toolId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la herramienta");
      }

      setTools((prev) => prev.filter((tool) => tool.id !== toolId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  return {
    tools,
    loading,
    error,
    addTool,
    updateTool,
    deleteTool,
    refetch: fetchTools,
  };
}
