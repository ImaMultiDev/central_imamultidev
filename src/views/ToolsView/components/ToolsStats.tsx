import { Wrench, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tool } from "@/types";

interface ToolsStatsProps {
  tools: Tool[];
  filteredTools: Tool[];
}

export function ToolsStats({ tools, filteredTools }: ToolsStatsProps) {
  const totalTools = tools.length;
  const filteredCount = filteredTools.length;
  const uniqueTypes = new Set(tools.map((tool) => tool.type)).size;
  const uniqueCategories = new Set(tools.map((tool) => tool.category)).size;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Herramientas
          </CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTools}</div>
          <p className="text-xs text-muted-foreground">
            {filteredCount} mostradas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tipos</CardTitle>
          <Filter className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueTypes}</div>
          <p className="text-xs text-muted-foreground">Categorías diferentes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categorías</CardTitle>
          <Filter className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueCategories}</div>
          <p className="text-xs text-muted-foreground">Especialidades</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promedio Tags</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalTools > 0
              ? Math.round(
                  tools.reduce((acc, tool) => acc + tool.tags.length, 0) /
                    totalTools
                )
              : 0}
          </div>
          <p className="text-xs text-muted-foreground">Por herramienta</p>
        </CardContent>
      </Card>
    </div>
  );
}
