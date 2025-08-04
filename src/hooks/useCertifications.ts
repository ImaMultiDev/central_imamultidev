import { useState, useEffect, useCallback } from "react";
import { Certification, CertificationType, CertificationLevel } from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

// Tipo para los datos que vienen de la API (con fechas como strings)
type ApiCertification = Omit<
  Certification,
  "startDate" | "endDate" | "createdAt" | "updatedAt"
> & {
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};

export function useCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función helper para convertir fechas de string a Date
  const convertCertificationDates = useCallback(
    (certification: ApiCertification): Certification => ({
      ...certification,
      startDate: new Date(certification.startDate),
      endDate: certification.endDate
        ? new Date(certification.endDate)
        : undefined,
      createdAt: new Date(certification.createdAt),
      updatedAt: new Date(certification.updatedAt),
    }),
    []
  );

  // Cargar certificaciones
  const fetchCertifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/certifications");
      const data = await handleApiResponse<ApiCertification[]>(response);
      // Convertir fechas de string a Date objects
      const certificationsWithDates = data.map(convertCertificationDates);
      setCertifications(certificationsWithDates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [convertCertificationDates]);

  // Crear certificación
  const createCertification = async (certificationData: {
    title: string;
    description?: string;
    type: CertificationType;
    level: CertificationLevel;
    startDate: string;
    endDate?: string;
    certificateUrl?: string;
    docsUrl?: string;
    logoImage?: string;
    badgeImage?: string;
    notes?: string;
    tags?: string[];
  }) => {
    try {
      const response = await apiRequest("/api/certifications", {
        method: "POST",
        body: JSON.stringify(certificationData),
      });

      const newCertification = await handleApiResponse<ApiCertification>(
        response
      );
      const certificationWithDates =
        convertCertificationDates(newCertification);
      setCertifications((prev) => [certificationWithDates, ...prev]);
      return certificationWithDates;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Actualizar certificación
  const updateCertification = async (
    id: string,
    certificationData: {
      title: string;
      description?: string;
      type: CertificationType;
      level: CertificationLevel;
      startDate: string;
      endDate?: string;
      certificateUrl?: string;
      docsUrl?: string;
      logoImage?: string;
      badgeImage?: string;
      notes?: string;
      tags?: string[];
    }
  ) => {
    try {
      const response = await apiRequest(`/api/certifications/${id}`, {
        method: "PUT",
        body: JSON.stringify(certificationData),
      });

      const updatedCertification = await handleApiResponse<ApiCertification>(
        response
      );
      const certificationWithDates =
        convertCertificationDates(updatedCertification);
      setCertifications((prev) =>
        prev.map((cert) => (cert.id === id ? certificationWithDates : cert))
      );
      return certificationWithDates;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Eliminar certificación
  const deleteCertification = async (id: string) => {
    try {
      const response = await apiRequest(`/api/certifications/${id}`, {
        method: "DELETE",
      });

      await handleApiResponse(response);
      setCertifications((prev) => prev.filter((cert) => cert.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Cargar certificaciones al montar el componente
  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  return {
    certifications,
    loading,
    error,
    createCertification,
    updateCertification,
    deleteCertification,
    refetch: fetchCertifications,
  };
}
