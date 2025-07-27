"use client";

import { useState, useEffect } from "react";
import { CloudStorage } from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

export function useCloudStorage() {
  const [cloudStorage, setCloudStorage] = useState<CloudStorage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCloudStorage = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/cloud-storage");
      const data = await handleApiResponse<CloudStorage[]>(response);
      setCloudStorage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const createCloudStorage = async (
    cloudStorage: Omit<
      CloudStorage,
      "id" | "userId" | "createdAt" | "updatedAt"
    >
  ) => {
    try {
      const response = await apiRequest("/api/cloud-storage", {
        method: "POST",
        body: JSON.stringify(cloudStorage),
      });
      const newCloudStorage = await handleApiResponse<CloudStorage>(response);
      setCloudStorage((prev) => [...prev, newCloudStorage]);
      return newCloudStorage;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const updateCloudStorage = async (
    id: string,
    cloudStorage: Partial<CloudStorage>
  ) => {
    try {
      const response = await apiRequest(`/api/cloud-storage/${id}`, {
        method: "PUT",
        body: JSON.stringify(cloudStorage),
      });
      const updatedCloudStorage = await handleApiResponse<CloudStorage>(
        response
      );
      setCloudStorage((prev) =>
        prev.map((item) => (item.id === id ? updatedCloudStorage : item))
      );
      return updatedCloudStorage;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const deleteCloudStorage = async (id: string) => {
    try {
      const response = await apiRequest(`/api/cloud-storage/${id}`, {
        method: "DELETE",
      });
      await handleApiResponse(response);
      setCloudStorage((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  useEffect(() => {
    fetchCloudStorage();
  }, []);

  return {
    cloudStorage,
    loading,
    error,
    fetchCloudStorage,
    createCloudStorage,
    updateCloudStorage,
    deleteCloudStorage,
  };
}
