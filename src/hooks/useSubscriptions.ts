"use client";

import { useState, useEffect, useCallback } from "react";
import { Subscription } from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función helper para convertir fechas de strings a Date objects
  const convertSubscriptionDates = useCallback(
    (
      subscription: Omit<
        Subscription,
        "startDate" | "nextBillingDate" | "createdAt" | "updatedAt"
      > & {
        startDate: string;
        nextBillingDate?: string;
        createdAt: string;
        updatedAt: string;
      }
    ): Subscription => {
      return {
        ...subscription,
        startDate: new Date(subscription.startDate),
        nextBillingDate: subscription.nextBillingDate
          ? new Date(subscription.nextBillingDate)
          : undefined,
        createdAt: new Date(subscription.createdAt),
        updatedAt: new Date(subscription.updatedAt),
      };
    },
    []
  );

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/subscriptions");
      const data = await handleApiResponse<
        Array<
          Omit<
            Subscription,
            "startDate" | "nextBillingDate" | "createdAt" | "updatedAt"
          > & {
            startDate: string;
            nextBillingDate?: string;
            createdAt: string;
            updatedAt: string;
          }
        >
      >(response);
      const convertedData = data.map(convertSubscriptionDates);
      setSubscriptions(convertedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [convertSubscriptionDates]);

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
      const rawSubscription = await handleApiResponse<
        Omit<
          Subscription,
          "startDate" | "nextBillingDate" | "createdAt" | "updatedAt"
        > & {
          startDate: string;
          nextBillingDate?: string;
          createdAt: string;
          updatedAt: string;
        }
      >(response);
      const newSubscription = convertSubscriptionDates(rawSubscription);
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
      const rawSubscription = await handleApiResponse<
        Omit<
          Subscription,
          "startDate" | "nextBillingDate" | "createdAt" | "updatedAt"
        > & {
          startDate: string;
          nextBillingDate?: string;
          createdAt: string;
          updatedAt: string;
        }
      >(response);
      const updatedSubscription = convertSubscriptionDates(rawSubscription);
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
  }, [fetchSubscriptions]);

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
