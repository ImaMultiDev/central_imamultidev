import { useState, useEffect, useCallback } from "react";
import {
  Documentation,
  DocumentationType,
  DocumentationCategory,
} from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

// Tipo para la respuesta de la API sin fechas parseadas
type DocumentationResponse = Omit<Documentation, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export function useDocumentation() {
  const [documentation, setDocumentation] = useState<Documentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función helper para parsear fechas
  const parseDates = (doc: DocumentationResponse): Documentation => {
    return {
      ...doc,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    };
  };

  // Cargar documentación
  const fetchDocumentation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/documentation");
      const data = await handleApiResponse<DocumentationResponse[]>(response);
      const docsWithDates = data.map(parseDates);
      setDocumentation(docsWithDates);
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
    tags?: string[];
  }) => {
    try {
      const response = await apiRequest("/api/documentation", {
        method: "POST",
        body: JSON.stringify(docData),
      });

      const newDoc = await handleApiResponse<DocumentationResponse>(response);
      const docWithDates = parseDates(newDoc);
      setDocumentation((prev) => [...prev, docWithDates]);
      return docWithDates;
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
      tags?: string[];
    }
  ) => {
    try {
      const response = await apiRequest(`/api/documentation/${id}`, {
        method: "PUT",
        body: JSON.stringify(docData),
      });

      const updatedDoc = await handleApiResponse<DocumentationResponse>(
        response
      );
      const docWithDates = parseDates(updatedDoc);
      setDocumentation((prev) =>
        prev.map((doc) => (doc.id === id ? docWithDates : doc))
      );
      return docWithDates;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Eliminar documentación
  const deleteDocumentation = async (id: string) => {
    try {
      const response = await apiRequest(`/api/documentation/${id}`, {
        method: "DELETE",
      });

      await handleApiResponse(response);
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
