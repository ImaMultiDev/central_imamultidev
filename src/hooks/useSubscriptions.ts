"use client";

import { useState, useEffect } from "react";
import { Subscription } from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/subscriptions");
      const data = await handleApiResponse<Subscription[]>(response);
      setSubscriptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (
    subscription: Omit<
      Subscription,
      "id" | "userId" | "createdAt" | "updatedAt"
    >
  ) => {
    try {
      const response = await apiRequest("/api/subscriptions", {
        method: "POST",
        body: JSON.stringify(subscription),
      });
      const newSubscription = await handleApiResponse<Subscription>(response);
      setSubscriptions((prev) => [...prev, newSubscription]);
      return newSubscription;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const updateSubscription = async (
    id: string,
    subscription: Partial<Subscription>
  ) => {
    try {
      const response = await apiRequest(`/api/subscriptions/${id}`, {
        method: "PUT",
        body: JSON.stringify(subscription),
      });
      const updatedSubscription = await handleApiResponse<Subscription>(
        response
      );
      setSubscriptions((prev) =>
        prev.map((item) => (item.id === id ? updatedSubscription : item))
      );
      return updatedSubscription;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      const response = await apiRequest(`/api/subscriptions/${id}`, {
        method: "DELETE",
      });
      await handleApiResponse(response);
      setSubscriptions((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    loading,
    error,
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
  };
}
