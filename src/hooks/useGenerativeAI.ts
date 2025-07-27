"use client";

import { useState, useEffect } from "react";
import { GenerativeAI } from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

export function useGenerativeAI() {
  const [generativeAI, setGenerativeAI] = useState<GenerativeAI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGenerativeAI = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/generative-ai");
      const data = await handleApiResponse<GenerativeAI[]>(response);
      setGenerativeAI(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const createGenerativeAI = async (
    generativeAI: Omit<
      GenerativeAI,
      "id" | "userId" | "createdAt" | "updatedAt"
    >
  ) => {
    try {
      const response = await apiRequest("/api/generative-ai", {
        method: "POST",
        body: JSON.stringify(generativeAI),
      });
      const newGenerativeAI = await handleApiResponse<GenerativeAI>(response);
      setGenerativeAI((prev) => [...prev, newGenerativeAI]);
      return newGenerativeAI;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const updateGenerativeAI = async (
    id: string,
    generativeAI: Partial<GenerativeAI>
  ) => {
    try {
      const response = await apiRequest(`/api/generative-ai/${id}`, {
        method: "PUT",
        body: JSON.stringify(generativeAI),
      });
      const updatedGenerativeAI = await handleApiResponse<GenerativeAI>(
        response
      );
      setGenerativeAI((prev) =>
        prev.map((item) => (item.id === id ? updatedGenerativeAI : item))
      );
      return updatedGenerativeAI;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const deleteGenerativeAI = async (id: string) => {
    try {
      const response = await apiRequest(`/api/generative-ai/${id}`, {
        method: "DELETE",
      });
      await handleApiResponse(response);
      setGenerativeAI((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  useEffect(() => {
    fetchGenerativeAI();
  }, []);

  return {
    generativeAI,
    loading,
    error,
    fetchGenerativeAI,
    createGenerativeAI,
    updateGenerativeAI,
    deleteGenerativeAI,
  };
}
