"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hammer, Scissors, Wrench, Palette } from "lucide-react";

interface WorkshopStatsProps {
  stats: {
    total: number;
    byCategory: Record<string, number>;
  };
}

export function WorkshopStats({ stats }: WorkshopStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Herramientas
          </CardTitle>
          <Hammer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Herramientas de Taller
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Edición</CardTitle>
          <Scissors className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.byCategory.MULTIMEDIA_EDITING || 0}
          </div>
          <p className="text-xs text-muted-foreground">Edición multimedia</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversión</CardTitle>
          <Palette className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.byCategory.MULTIMEDIA_CONVERSION || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Conversión de archivos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilidades</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.byCategory.UTILITIES || 0}
          </div>
          <p className="text-xs text-muted-foreground">Herramientas útiles</p>
        </CardContent>
      </Card>
    </div>
  );
}
