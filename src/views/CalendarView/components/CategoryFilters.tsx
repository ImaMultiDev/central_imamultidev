"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
}

export function CategoryFilters({
  selectedCategory,
  onCategoryChange,
  categoryColors,
  categoryLabels,
}: CategoryFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtros por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange("ALL")}
          >
            Todos
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
      </CardContent>
    </Card>
  );
}
