"use client";

import { useState, useEffect } from "react";
import { DataAnalytics } from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

export function useDataAnalytics() {
  const [dataAnalytics, setDataAnalytics] = useState<DataAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/data-analytics");
      const data = await handleApiResponse<DataAnalytics[]>(response);
      setDataAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const createDataAnalytics = async (
    dataAnalytics: Omit<
      DataAnalytics,
      "id" | "userId" | "createdAt" | "updatedAt"
    >
  ) => {
    try {
      const response = await apiRequest("/api/data-analytics", {
        method: "POST",
        body: JSON.stringify(dataAnalytics),
      });
      const newDataAnalytics = await handleApiResponse<DataAnalytics>(response);
      setDataAnalytics((prev) => [...prev, newDataAnalytics]);
      return newDataAnalytics;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const updateDataAnalytics = async (
    id: string,
    dataAnalytics: Partial<DataAnalytics>
  ) => {
    try {
      const response = await apiRequest(`/api/data-analytics/${id}`, {
        method: "PUT",
        body: JSON.stringify(dataAnalytics),
      });
      const updatedDataAnalytics = await handleApiResponse<DataAnalytics>(
        response
      );
      setDataAnalytics((prev) =>
        prev.map((item) => (item.id === id ? updatedDataAnalytics : item))
      );
      return updatedDataAnalytics;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const deleteDataAnalytics = async (id: string) => {
    try {
      const response = await apiRequest(`/api/data-analytics/${id}`, {
        method: "DELETE",
      });
      await handleApiResponse(response);
      setDataAnalytics((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  useEffect(() => {
    fetchDataAnalytics();
  }, []);

  return {
    dataAnalytics,
    loading,
    error,
    fetchDataAnalytics,
    createDataAnalytics,
    updateDataAnalytics,
    deleteDataAnalytics,
  };
}
