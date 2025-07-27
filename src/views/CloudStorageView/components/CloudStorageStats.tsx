import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Database, TrendingUp } from "lucide-react";

interface CloudStorageStatsProps {
  stats: {
    total: number;
    byCategory: Record<string, number>;
  };
}

export function CloudStorageStats({ stats }: CloudStorageStatsProps) {
  const topCategories = Object.entries(stats.byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Herramientas
          </CardTitle>
          <Cloud className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Herramientas de Cloud & Storage
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Categorías Activas
          </CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {
              Object.values(stats.byCategory).filter((count) => count > 0)
                .length
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Categorías con herramientas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Categoría Principal
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topCategories[0] ? topCategories[0][1] : 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {topCategories[0] ? topCategories[0][0] : "Sin datos"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Promedio por Categoría
          </CardTitle>
          <Cloud className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.total > 0
              ? Math.round(stats.total / Object.keys(stats.byCategory).length)
              : 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Herramientas por categoría
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
