"use client";

import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const platformColors = {
  UDEMY: "bg-purple-500",
  COURSERA: "bg-blue-500",
  YOUTUBE: "bg-red-500",
  PLATZI: "bg-green-500",
  OTRA: "bg-gray-500",
};

const platformLabels = {
  UDEMY: "Udemy",
  COURSERA: "Coursera",
  YOUTUBE: "YouTube",
  PLATZI: "Platzi",
  OTRA: "Otra",
};

const statusLabels = {
  EN_PROGRESO: "En Progreso",
  COMPLETADO: "Completado",
  POR_COMENZAR: "Por Comenzar",
};

const statusColors = {
  EN_PROGRESO: "bg-yellow-500",
  COMPLETADO: "bg-green-500",
  POR_COMENZAR: "bg-blue-500",
};

interface CoursesFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CoursesFilters({
  selectedStatus,
  onStatusChange,
  selectedPlatform,
  onPlatformChange,
  searchQuery,
  onSearchChange,
}: CoursesFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Estado</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedStatus === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange("ALL")}
            >
              Todos
            </Button>
            {Object.entries(statusLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedStatus === key ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(key)}
                className="gap-2"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    statusColors[key as keyof typeof statusColors]
                  }`}
                />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Platform Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Plataforma</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedPlatform === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => onPlatformChange("ALL")}
            >
              Todas
            </Button>
            {Object.entries(platformLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedPlatform === key ? "default" : "outline"}
                size="sm"
                onClick={() => onPlatformChange(key)}
                className="gap-2"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    platformColors[key as keyof typeof platformColors]
                  }`}
                />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
