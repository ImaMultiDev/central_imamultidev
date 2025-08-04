"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Award,
  Trophy,
  Plus,
  ExternalLink,
  MoreHorizontal,
  Calendar,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Certification, CertificationType } from "@/types";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";

interface CertificationsGridProps {
  certifications: Certification[];
  onEditCertification: (certification: Certification) => void;
  onDeleteCertification: (certificationId: string) => void;
  openMenuId: string | null;
  onOpenMenuChange: (menuId: string | null) => void;
  isDeleting: string | null;
  onAddCertification: () => void;
}

const levelLabels = {
  FPGS: "FPGS",
  FPGM: "FPGM",
  CERTIFICADO_NIVEL_3: "Certificado Nivel 3",
  CERTIFICADO_NIVEL_2: "Certificado Nivel 2",
  CERTIFICADO_NIVEL_1: "Certificado Nivel 1",
};

export function CertificationsGrid({
  certifications,
  onEditCertification,
  onDeleteCertification,
  openMenuId,
  onOpenMenuChange,
  isDeleting,
  onAddCertification,
}: CertificationsGridProps) {
  const { isAdmin } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const paginatedCertifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return certifications.slice(startIndex, startIndex + itemsPerPage);
  }, [certifications, currentPage]);

  const totalPages = Math.ceil(certifications.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
    });
  };

  if (certifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No hay certificaciones
        </h3>
        <p className="text-muted-foreground mb-4">
          Comienza añadiendo tu primera certificación o título.
        </p>
        <Button onClick={onAddCertification}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Certificación
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedCertifications.map((certification) => {
          // Estilos según el tipo (Certificado = plateado, Título = dorado)
          const typeStyles =
            certification.type === CertificationType.TITULO
              ? "bg-gradient-to-br from-yellow-900 to-green-500 border-amber-200 dark:from-amber-950/20 dark:to-yellow-950/20 dark:border-amber-800"
              : "bg-gradient-to-br from-gray-600 to-black border-slate-200 dark:from-slate-950/20 dark:to-gray-950/20 dark:border-slate-700";

          const iconBgStyles =
            certification.type === CertificationType.TITULO
              ? "bg-gradient-to-r from-amber-500 to-yellow-600"
              : "bg-gradient-to-r from-slate-500 to-gray-600";

          return (
            <Card
              key={certification.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${typeStyles}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 ${iconBgStyles} rounded-lg shrink-0`}>
                      {certification.type === CertificationType.TITULO ? (
                        <Trophy className="h-4 w-4 text-white" />
                      ) : (
                        <Award className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm font-semibold text-foreground line-clamp-1">
                        {certification.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`text-xs mt-1 ${
                          certification.type === CertificationType.TITULO
                            ? "border-amber-300 text-amber-200 dark:border-amber-700 dark:text-amber-300"
                            : "border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {levelLabels[certification.level]}
                      </Badge>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 certification-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenMenuChange(
                            openMenuId === certification.id
                              ? null
                              : certification.id
                          );
                        }}
                        disabled={isDeleting === certification.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      {openMenuId === certification.id && (
                        <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border bg-background shadow-lg">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditCertification(certification);
                                onOpenMenuChange(null);
                              }}
                              className="block w-full px-4 py-2 text-left text-sm hover:bg-accent"
                            >
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCertification(certification.id);
                                onOpenMenuChange(null);
                              }}
                              disabled={isDeleting === certification.id}
                              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isDeleting === certification.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-2 inline"></div>
                                  Eliminando...
                                </>
                              ) : (
                                "Eliminar"
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {certification.description && (
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {certification.description}
                  </CardDescription>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(certification.startDate)}</span>
                    {certification.endDate && (
                      <>
                        <span>-</span>
                        <span>{formatDate(certification.endDate)}</span>
                      </>
                    )}
                  </div>

                  {certification.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {certification.tags.slice(0, 2).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-2 py-0.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {certification.tags.length > 2 && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0.5"
                        >
                          +{certification.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  {certification.certificateUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() =>
                        window.open(certification.certificateUrl, "_blank")
                      }
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                  )}
                  {certification.docsUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() =>
                        window.open(certification.docsUrl, "_blank")
                      }
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Docs
                    </Button>
                  )}
                </div>

                {/* Mostrar imágenes si existen */}
                <div className="flex items-center gap-2 mt-3">
                  {certification.logoImage && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      <Image
                        src={certification.logoImage}
                        alt="Logo"
                        className="w-full h-full object-cover"
                        width={32}
                        height={32}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  {certification.badgeImage && (
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden">
                      <Image
                        src={certification.badgeImage}
                        alt="Badge"
                        className="w-full h-full object-cover"
                        width={32}
                        height={32}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </>
  );
}
