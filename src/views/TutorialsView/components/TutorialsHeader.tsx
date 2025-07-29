"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface TutorialsHeaderProps {
  onAddTutorial: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TutorialsHeader({
  onAddTutorial,
  searchQuery,
  onSearchChange,
}: TutorialsHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground">Tutoriales</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus tutoriales de YouTube y otras plataformas
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tutoriales..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={onAddTutorial} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Tutorial
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
