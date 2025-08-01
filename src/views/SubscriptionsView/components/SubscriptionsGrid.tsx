"use client";

import { Subscription } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ExternalLink } from "lucide-react";

interface SubscriptionsGridProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export default function SubscriptionsGrid({
  subscriptions,
  onEdit,
  onDelete,
}: SubscriptionsGridProps) {
  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      SOFTWARE: "Software",
      STREAMING: "Streaming",
      CLOUD_SERVICE: "Cloud Service",
      PRODUCTIVITY: "Productividad",
      DESIGN: "Diseño",
      DEVELOPMENT: "Desarrollo",
      ENTERTAINMENT: "Entretenimiento",
      EDUCATION: "Educación",
      NEWS: "Noticias",
      FITNESS: "Fitness",
    };
    return labels[type] || type;
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      WORK: "Trabajo",
      PERSONAL: "Personal",
      ENTERTAINMENT: "Entretenimiento",
      EDUCATION: "Educación",
      HEALTH: "Salud",
      FINANCE: "Finanzas",
    };
    return labels[category] || category;
  };

  const getBillingCycleLabel = (cycle: string) => {
    const labels: { [key: string]: string } = {
      MONTHLY: "Mensual",
      YEARLY: "Anual",
      WEEKLY: "Semanal",
      LIFETIME: "Lifetime",
    };
    return labels[cycle] || cycle;
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isUpcoming = (date: Date | string | null) => {
    if (!date) return false;
    const nextBilling = new Date(date);
    const today = new Date();
    const diffTime = nextBilling.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No se encontraron suscripciones</p>
        <p className="text-gray-400 text-sm mt-2">
          Comienza agregando tu primera suscripción
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subscriptions.map((subscription) => (
        <Card
          key={subscription.id}
          className="p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white mb-1">
                {subscription.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={subscription.isActive ? "default" : "secondary"}
                >
                  {subscription.isActive ? "Activa" : "Inactiva"}
                </Badge>
                {subscription.nextBillingDate &&
                  isUpcoming(subscription.nextBillingDate) && (
                    <Badge variant="destructive">Próximo pago</Badge>
                  )}
              </div>
            </div>
            <div className="flex gap-1 ml-2">
              {subscription.url && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(subscription.url, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(subscription)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(subscription.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {subscription.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {subscription.description}
            </p>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Tipo:</span>
              <span className="font-medium">
                {getTypeLabel(subscription.type)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Categoría:</span>
              <span className="font-medium">
                {getCategoryLabel(subscription.category)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Precio:</span>
              <span className="font-bold text-green-600">
                €{subscription.price.toFixed(2)} (
                {getBillingCycleLabel(subscription.billingCycle)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Inicio:</span>
              <span className="font-medium">
                {formatDate(subscription.startDate)}
              </span>
            </div>
            {subscription.nextBillingDate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Próximo pago:</span>
                <span
                  className={`font-medium ${
                    isUpcoming(subscription.nextBillingDate)
                      ? "text-red-600"
                      : ""
                  }`}
                >
                  {formatDate(subscription.nextBillingDate)}
                </span>
              </div>
            )}
          </div>

          {subscription.tags && subscription.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {subscription.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
              {subscription.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{subscription.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
