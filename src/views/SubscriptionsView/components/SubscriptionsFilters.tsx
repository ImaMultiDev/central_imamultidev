"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubscriptionType, SubscriptionCategory, BillingCycle } from "@/types";
import { Search } from "lucide-react";

interface SubscriptionsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedBillingCycle: string;
  onBillingCycleChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export default function SubscriptionsFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  selectedBillingCycle,
  onBillingCycleChange,
  selectedStatus,
  onStatusChange,
}: SubscriptionsFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar suscripciones..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro por Tipo */}
        <Select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value={SubscriptionType.SOFTWARE}>Software</option>
          <option value={SubscriptionType.STREAMING}>Streaming</option>
          <option value={SubscriptionType.CLOUD_SERVICE}>Cloud Service</option>
          <option value={SubscriptionType.PRODUCTIVITY}>Productividad</option>
          <option value={SubscriptionType.DESIGN}>Diseño</option>
          <option value={SubscriptionType.DEVELOPMENT}>Desarrollo</option>
          <option value={SubscriptionType.ENTERTAINMENT}>
            Entretenimiento
          </option>
          <option value={SubscriptionType.EDUCATION}>Educación</option>
          <option value={SubscriptionType.NEWS}>Noticias</option>
          <option value={SubscriptionType.FITNESS}>Fitness</option>
        </Select>

        {/* Filtro por Categoría */}
        <Select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value={SubscriptionCategory.WORK}>Trabajo</option>
          <option value={SubscriptionCategory.PERSONAL}>Personal</option>
          <option value={SubscriptionCategory.ENTERTAINMENT}>
            Entretenimiento
          </option>
          <option value={SubscriptionCategory.EDUCATION}>Educación</option>
          <option value={SubscriptionCategory.HEALTH}>Salud</option>
          <option value={SubscriptionCategory.FINANCE}>Finanzas</option>
        </Select>

        {/* Filtro por Ciclo de Facturación */}
        <Select
          value={selectedBillingCycle}
          onChange={(e) => onBillingCycleChange(e.target.value)}
        >
          <option value="">Todos los ciclos</option>
          <option value={BillingCycle.MONTHLY}>Mensual</option>
          <option value={BillingCycle.YEARLY}>Anual</option>
          <option value={BillingCycle.WEEKLY}>Semanal</option>
          <option value={BillingCycle.LIFETIME}>Lifetime</option>
        </Select>

        {/* Filtro por Estado */}
        <Select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="active">Activas</option>
          <option value="inactive">Inactivas</option>
        </Select>
      </div>
    </div>
  );
}
