import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ToolsFiltersProps {
  selectedType: string;
  selectedCategory: string;
  searchTerm: string;
  onTypeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  typeLabels: Record<string, string>;
  categoryLabels: Record<string, string>;
  typeColors: Record<string, string>;
  categoryColors: Record<string, string>;
}

export function ToolsFilters({
  selectedType,
  selectedCategory,
  searchTerm,
  onTypeChange,
  onCategoryChange,
  onSearchChange,
  typeLabels,
  categoryLabels,
  typeColors,
  categoryColors,
}: ToolsFiltersProps) {
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
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Tipo</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => onTypeChange("ALL")}
            >
              Todos los tipos
            </Button>
            {Object.entries(typeLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedType === key ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange(key)}
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
              onClick={() => onCategoryChange("ALL")}
            >
              Todas las categorías
            </Button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(key)}
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
