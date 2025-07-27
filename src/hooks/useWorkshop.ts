"use client";

import { useState, useEffect } from "react";
import { Workshop } from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

export function useWorkshop() {
  const [workshop, setWorkshop] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkshop = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/workshop");
      const data = await handleApiResponse<Workshop[]>(response);
      setWorkshop(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const createWorkshop = async (
    workshop: Omit<Workshop, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await apiRequest("/api/workshop", {
        method: "POST",
        body: JSON.stringify(workshop),
      });
      const newWorkshop = await handleApiResponse<Workshop>(response);
      setWorkshop((prev) => [...prev, newWorkshop]);
      return newWorkshop;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const updateWorkshop = async (id: string, workshop: Partial<Workshop>) => {
    try {
      const response = await apiRequest(`/api/workshop/${id}`, {
        method: "PUT",
        body: JSON.stringify(workshop),
      });
      const updatedWorkshop = await handleApiResponse<Workshop>(response);
      setWorkshop((prev) =>
        prev.map((item) => (item.id === id ? updatedWorkshop : item))
      );
      return updatedWorkshop;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const deleteWorkshop = async (id: string) => {
    try {
      const response = await apiRequest(`/api/workshop/${id}`, {
        method: "DELETE",
      });
      await handleApiResponse(response);
      setWorkshop((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  useEffect(() => {
    fetchWorkshop();
  }, []);

  return {
    workshop,
    loading,
    error,
    fetchWorkshop,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
  };
}
