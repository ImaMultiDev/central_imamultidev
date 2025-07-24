"use client";

import { Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CalendarViewType = "month" | "week" | "day";

interface ViewControlsProps {
  currentView: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
}

export function ViewControls({ currentView, onViewChange }: ViewControlsProps) {
  const views = [
    {
      type: "month" as CalendarViewType,
      label: "Mes",
      icon: Calendar,
    },
    {
      type: "week" as CalendarViewType,
      label: "Semana",
      icon: CalendarRange,
    },
    {
      type: "day" as CalendarViewType,
      label: "Día",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = currentView === view.type;

        return (
          <Button
            key={view.type}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(view.type)}
            className={`flex items-center gap-2 ${
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{view.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
