"use client";

import { Award, Trophy, Calendar, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Certification, CertificationType } from "@/types";

interface CertificationsStatsProps {
  certifications: Certification[];
}

export function CertificationsStats({
  certifications,
}: CertificationsStatsProps) {
  const totalCertifications = certifications.length;
  const totalCertificados = certifications.filter(
    (cert) => cert.type === CertificationType.CERTIFICADO
  ).length;
  const totalTitulos = certifications.filter(
    (cert) => cert.type === CertificationType.TITULO
  ).length;

  // Certificaciones obtenidas este año
  const currentYear = new Date().getFullYear();
  const thisYearCertifications = certifications.filter(
    (cert) => cert.startDate.getFullYear() === currentYear
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Certificaciones
          </CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCertifications}</div>
          <p className="text-xs text-muted-foreground">
            Certificaciones y títulos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Certificados</CardTitle>
          <Star className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {totalCertificados}
          </div>
          <p className="text-xs text-muted-foreground">
            Certificaciones profesionales
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Títulos</CardTitle>
          <Trophy className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">
            {totalTitulos}
          </div>
          <p className="text-xs text-muted-foreground">Títulos académicos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Este Año</CardTitle>
          <Calendar className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {thisYearCertifications}
          </div>
          <p className="text-xs text-muted-foreground">
            Obtenidas en {currentYear}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
