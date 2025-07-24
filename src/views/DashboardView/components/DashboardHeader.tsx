"use client";

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onViewCalendar: () => void;
}

export function DashboardHeader({ onViewCalendar }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 text-center lg:text-left items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Bienvenido de vuelta! Aquí tienes un resumen de tu actividad.
        </p>
      </div>
      <Button onClick={onViewCalendar}>
        <Calendar className="mr-2 h-4 w-4" />
        Ver Calendario
      </Button>
    </div>
  );
}
