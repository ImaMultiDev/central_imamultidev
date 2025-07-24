"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
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
import { Pagination } from "@/components/ui/pagination";
import { Documentation } from "@/types";

interface DocsGridProps {
  documents: Documentation[];
  onEditDocument: (doc: Documentation) => void;
  onDeleteDocument: (docId: string) => void;
  typeColors: Record<string, string>;
  typeLabels: Record<string, string>;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
}

export function DocsGrid({
  documents,
  onEditDocument,
  onDeleteDocument,
  typeColors,
  typeLabels,
  categoryColors,
  categoryLabels,
}: DocsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return documents.slice(startIndex, endIndex);
  }, [documents, currentPage]);

  const totalPages = Math.ceil(documents.length / itemsPerPage);

  // Reset to page 1 when documents change
  useEffect(() => {
    setCurrentPage(1);
  }, [documents.length]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {paginatedDocuments.map((doc) => (
          <Card key={doc.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                    {doc.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {doc.description}
                  </CardDescription>
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      // Toggle menu for this specific document
                      const menuId = `menu-${doc.id}`;
                      const menu = document.getElementById(menuId);
                      if (menu) {
                        menu.classList.toggle("hidden");
                      }
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <div
                    id={`menu-${doc.id}`}
                    className="absolute right-0 top-8 z-10 hidden bg-background border border-border rounded-md shadow-lg min-w-[120px]"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2 rounded-none border-b border-border"
                      onClick={() => onEditDocument(doc)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2 rounded-none text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDeleteDocument(doc.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                    typeColors[doc.type as keyof typeof typeColors]
                  }`}
                >
                  {typeLabels[doc.type as keyof typeof typeLabels]}
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                    categoryColors[doc.category as keyof typeof categoryColors]
                  }`}
                >
                  {categoryLabels[doc.category as keyof typeof categoryLabels]}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {doc.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {doc.tags.length > 4 && (
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                    +{doc.tags.length - 4}
                  </span>
                )}
              </div>

              {/* Date */}
              <div className="text-sm text-muted-foreground">
                Añadido: {doc.createdAt.toLocaleDateString("es-ES")}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 flex-wrap justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    window.open(doc.url, "_blank", "noopener,noreferrer")
                  }
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {documents.length === 0 && (
          <Card className="lg:col-span-3">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-medium">
                    No se encontraron documentos
                  </h3>
                  <p className="text-muted-foreground">
                    Ajusta los filtros o añade tu primer documento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {documents.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
            {Math.min(currentPage * itemsPerPage, documents.length)} de{" "}
            {documents.length} documentos
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
