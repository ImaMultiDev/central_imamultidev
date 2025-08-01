"use client";

import { Subscription } from "@/types";
import { Card } from "@/components/ui/card";

interface SubscriptionsStatsProps {
  subscriptions: Subscription[];
}

export default function SubscriptionsStats({
  subscriptions,
}: SubscriptionsStatsProps) {
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter((s) => s.isActive).length;
  const inactiveSubscriptions = totalSubscriptions - activeSubscriptions;

  // Calcular gastos mensuales estimados
  const monthlyExpenses = subscriptions
    .filter((s) => s.isActive)
    .reduce((total, sub) => {
      let monthlyPrice = 0;
      switch (sub.billingCycle) {
        case "MONTHLY":
          monthlyPrice = sub.price;
          break;
        case "YEARLY":
          monthlyPrice = sub.price / 12;
          break;
        case "WEEKLY":
          monthlyPrice = sub.price * 4.33; // Aproximadamente 4.33 semanas por mes
          break;
        case "LIFETIME":
          monthlyPrice = 0; // No aplica para lifetime
          break;
      }
      return total + monthlyPrice;
    }, 0);

  const yearlyExpenses = monthlyExpenses * 12;

  const stats = [
    {
      title: "Total Suscripciones",
      value: totalSubscriptions,
      subtitle: "servicios registrados",
    },
    {
      title: "Activas",
      value: activeSubscriptions,
      subtitle: "suscripciones activas",
    },
    {
      title: "Inactivas",
      value: inactiveSubscriptions,
      subtitle: "suscripciones pausadas",
    },
    {
      title: "Gasto Mensual",
      value: `€${monthlyExpenses.toFixed(2)}`,
      subtitle: "gasto estimado/mes",
    },
    {
      title: "Gasto Anual",
      value: `€${yearlyExpenses.toFixed(2)}`,
      subtitle: "gasto estimado/año",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {stat.title}
            </p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.subtitle}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
