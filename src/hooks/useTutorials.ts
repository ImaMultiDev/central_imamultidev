import { useState, useEffect } from "react";
import { Tutorial, TutorialStatus } from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

// Tipo para la respuesta de la API sin fechas parseadas
type TutorialResponse = Omit<Tutorial, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

// Función helper para parsear fechas
const parseTutorialDates = (tutorial: TutorialResponse): Tutorial => ({
  ...tutorial,
  createdAt: new Date(tutorial.createdAt),
  updatedAt: new Date(tutorial.updatedAt),
});

export function useTutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar tutoriales
  const fetchTutorials = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/tutorials");
      const data = await handleApiResponse<TutorialResponse[]>(response);
      const tutorialsWithDates = data.map(parseTutorialDates);
      setTutorials(tutorialsWithDates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Crear tutorial
  const createTutorial = async (tutorialData: {
    title: string;
    description?: string;
    platform: string;
    url?: string;
    docsUrl?: string;
    notes?: string;
    tags?: string[];
    status?: TutorialStatus;
  }) => {
    try {
      const response = await apiRequest("/api/tutorials", {
        method: "POST",
        body: JSON.stringify(tutorialData),
      });

      const newTutorial = await handleApiResponse<TutorialResponse>(response);
      const tutorialWithDates = parseTutorialDates(newTutorial);
      setTutorials((prev) => [...prev, tutorialWithDates]);
      return tutorialWithDates;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Actualizar tutorial
  const updateTutorial = async (
    id: string,
    tutorialData: {
      title: string;
      description?: string;
      platform: string;
      url?: string;
      docsUrl?: string;
      notes?: string;
      tags?: string[];
      status?: TutorialStatus;
    }
  ) => {
    try {
      const response = await apiRequest(`/api/tutorials/${id}`, {
        method: "PUT",
        body: JSON.stringify(tutorialData),
      });

      const updatedTutorial = await handleApiResponse<TutorialResponse>(
        response
      );
      const tutorialWithDates = parseTutorialDates(updatedTutorial);
      setTutorials((prev) =>
        prev.map((tutorial) =>
          tutorial.id === id ? tutorialWithDates : tutorial
        )
      );
      return tutorialWithDates;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Cambiar estado del tutorial
  const updateTutorialStatus = async (id: string, status: TutorialStatus) => {
    try {
      const response = await apiRequest(`/api/tutorials/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      const updatedTutorial = await handleApiResponse<TutorialResponse>(
        response
      );
      const tutorialWithDates = parseTutorialDates(updatedTutorial);
      setTutorials((prev) =>
        prev.map((tutorial) =>
          tutorial.id === id ? tutorialWithDates : tutorial
        )
      );
      return tutorialWithDates;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Eliminar tutorial
  const deleteTutorial = async (id: string) => {
    try {
      const response = await apiRequest(`/api/tutorials/${id}`, {
        method: "DELETE",
      });

      await handleApiResponse(response);
      setTutorials((prev) => prev.filter((tutorial) => tutorial.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Cargar tutoriales al montar el componente
  useEffect(() => {
    fetchTutorials();
  }, []);

  return {
    tutorials,
    loading,
    error,
    createTutorial,
    updateTutorial,
    updateTutorialStatus,
    deleteTutorial,
    refetch: fetchTutorials,
  };
}
