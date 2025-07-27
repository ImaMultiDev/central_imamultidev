import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DataAnalyticsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  typeColors: Record<string, string>;
  typeLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
}

export function DataAnalyticsFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  typeColors,
  typeLabels,
  categoryColors,
  categoryLabels,
}: DataAnalyticsFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Búsqueda y Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar herramientas, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("ALL")}
            >
              Todos los tipos
            </Button>
            {Object.entries(typeLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedType === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(key)}
                className="gap-2"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    typeColors[key as keyof typeof typeColors]
                  }`}
                />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Categoría</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("ALL")}
            >
              Todas las categorías
            </Button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(key)}
                className="gap-2"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    categoryColors[key as keyof typeof categoryColors]
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
