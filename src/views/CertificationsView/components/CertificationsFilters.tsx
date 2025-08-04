"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CertificationType, CertificationLevel } from "@/types";

interface CertificationsFiltersProps {
  searchQuery: string;
  selectedType: string;
  selectedLevel: string;
  onSearchChange: (query: string) => void;
  onTypeChange: (type: string) => void;
  onLevelChange: (level: string) => void;
}

export function CertificationsFilters({
  searchQuery,
  selectedType,
  selectedLevel,
  onSearchChange,
  onTypeChange,
  onLevelChange,
}: CertificationsFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar certificaciones..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <select
        className="h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        <option value="ALL">Todos los tipos</option>
        <option value={CertificationType.CERTIFICADO}>Certificados</option>
        <option value={CertificationType.TITULO}>Títulos</option>
      </select>

      <select
        className="h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
        value={selectedLevel}
        onChange={(e) => onLevelChange(e.target.value)}
      >
        <option value="ALL">Todos los niveles</option>
        <option value={CertificationLevel.FPGS}>FPGS</option>
        <option value={CertificationLevel.FPGM}>FPGM</option>
        <option value={CertificationLevel.CERTIFICADO_NIVEL_3}>
          Certificado Nivel 3
        </option>
        <option value={CertificationLevel.CERTIFICADO_NIVEL_2}>
          Certificado Nivel 2
        </option>
        <option value={CertificationLevel.CERTIFICADO_NIVEL_1}>
          Certificado Nivel 1
        </option>
      </select>
    </div>
  );
}
