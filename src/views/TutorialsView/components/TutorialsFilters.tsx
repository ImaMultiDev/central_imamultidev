"use client";

import { Card, CardContent } from "@/components/ui/card";

const statusOptions = [
  { value: "ALL", label: "Todos los estados" },
  { value: "POR_COMENZAR", label: "Por Comenzar" },
  { value: "EN_PROGRESO", label: "En Progreso" },
  { value: "COMPLETADO", label: "Completado" },
];

const platformOptions = [
  { value: "ALL", label: "Todas las plataformas" },
  { value: "YOUTUBE", label: "YouTube" },
  { value: "UDEMY", label: "Udemy" },
  { value: "COURSERA", label: "Coursera" },
  { value: "PLATZI", label: "Platzi" },
  { value: "OTRA", label: "Otra" },
];

interface TutorialsFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

export function TutorialsFilters({
  selectedStatus,
  onStatusChange,
  selectedPlatform,
  onPlatformChange,
}: TutorialsFiltersProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground block mb-2">
              Estado
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-foreground block mb-2">
              Plataforma
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => onPlatformChange(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
            >
              {platformOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
