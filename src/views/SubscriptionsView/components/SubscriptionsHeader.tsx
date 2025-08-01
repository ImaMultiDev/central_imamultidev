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
    <div className="flex flex-col mb-6 lg:flex-row gap-4 lg:gap-0 text-center lg:text-left items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">Suscripciones</h1>
        <p className="text-muted-foreground">
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
