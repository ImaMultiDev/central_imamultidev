"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SubscriptionsHeaderProps {
  onAddNew: () => void;
}

export default function SubscriptionsHeader({
  onAddNew,
}: SubscriptionsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Suscripciones</h1>
        <p className="text-gray-600 mt-1">
          Gestiona todas tus suscripciones de servicios y controla tus gastos
        </p>
      </div>
      <Button onClick={onAddNew} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Agregar Suscripción
      </Button>
    </div>
  );
}
