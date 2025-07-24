import { useState, useEffect, useCallback } from "react";
import {
  Documentation,
  DocumentationType,
  DocumentationCategory,
} from "@/types";

export function useDocumentation() {
  const [documentation, setDocumentation] = useState<Documentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para convertir fechas de string a Date
  const parseDates = (doc: Record<string, unknown>): Documentation =>
    ({
      ...doc,
      createdAt: new Date(doc.createdAt as string),
      updatedAt: new Date(doc.updatedAt as string),
    } as Documentation);

  // Cargar documentación
  const fetchDocumentation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/documentation");
      if (!response.ok) {
        throw new Error("Error al cargar documentación");
      }
      const data = await response.json();
      // Convertir fechas de string a Date
      const parsedData = data.map(parseDates);
      setDocumentation(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear documentación
  const createDocumentation = async (docData: {
    title: string;
    description?: string;
    url: string;
    type: DocumentationType;
    category: DocumentationCategory;
    tags: string[];
  }) => {
    try {
      const response = await fetch("/api/documentation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(docData),
      });

      if (!response.ok) {
        throw new Error("Error al crear documentación");
      }

      const newDoc = await response.json();
      // Convertir fechas del nuevo documento
      const parsedNewDoc = parseDates(newDoc);
      setDocumentation((prev) => [...prev, parsedNewDoc]);
      return parsedNewDoc;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Actualizar documentación
  const updateDocumentation = async (
    id: string,
    docData: {
      title: string;
      description?: string;
      url: string;
      type: DocumentationType;
      category: DocumentationCategory;
      tags: string[];
    }
  ) => {
    try {
      const response = await fetch(`/api/documentation/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(docData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar documentación");
      }

      const updatedDoc = await response.json();
      // Convertir fechas del documento actualizado
      const parsedUpdatedDoc = parseDates(updatedDoc);
      setDocumentation((prev) =>
        prev.map((doc) => (doc.id === id ? parsedUpdatedDoc : doc))
      );
      return parsedUpdatedDoc;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Eliminar documentación
  const deleteDocumentation = async (id: string) => {
    try {
      const response = await fetch(`/api/documentation/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar documentación");
      }

      setDocumentation((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Cargar documentación al montar el componente
  useEffect(() => {
    fetchDocumentation();
  }, [fetchDocumentation]);

  return {
    documentation,
    loading,
    error,
    createDocumentation,
    updateDocumentation,
    deleteDocumentation,
    refetch: fetchDocumentation,
  };
}
