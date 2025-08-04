"use client";

import { Plus, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificationsHeaderProps {
  onAddCertification: () => void;
}

export function CertificationsHeader({ onAddCertification }: CertificationsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg">
          <Award className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Certificaciones y Títulos
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu galería de certificaciones, títulos académicos y logros profesionales
          </p>
        </div>
      </div>
      <Button onClick={onAddCertification} className="shrink-0">
        <Plus className="mr-2 h-4 w-4" />
        Añadir Certificación
      </Button>
    </div>
  );
}