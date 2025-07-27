"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Brain, Sparkles } from "lucide-react";

interface GenerativeAIStatsProps {
  stats: {
    total: number;
    byCategory: Record<string, number>;
  };
}

export function GenerativeAIStats({ stats }: GenerativeAIStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total IA</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Herramientas de IA Generativa
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Texto</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.byCategory.TEXT || 0}</div>
          <p className="text-xs text-muted-foreground">Generación de texto</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Imágenes</CardTitle>
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.byCategory.IMAGES || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Generación de imágenes
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Multimedia</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(stats.byCategory.AUDIO || 0) + (stats.byCategory.VIDEO || 0)}
          </div>
          <p className="text-xs text-muted-foreground">Audio y video</p>
        </CardContent>
      </Card>
    </div>
  );
}
