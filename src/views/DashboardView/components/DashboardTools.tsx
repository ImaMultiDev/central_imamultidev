"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tool } from "@/types";

interface DashboardToolsProps {
  tools: Tool[];
}

export function DashboardTools({ tools }: DashboardToolsProps) {
  const recentTools = useMemo(() => {
    return tools
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime(); // Ordenar por más reciente primero
      })
      .slice(0, 5); // Limitar a 5 herramientas
  }, [tools]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Herramientas Recientes</CardTitle>
        <CardDescription>Últimas herramientas añadidas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTools.map((tool) => (
            <div key={tool.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">{tool.title}</p>
              </div>
              <p className="text-xs text-muted-foreground">{tool.type}</p>
            </div>
          ))}
          {recentTools.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No tienes herramientas añadidas
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
