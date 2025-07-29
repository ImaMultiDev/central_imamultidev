import { useState, useEffect } from "react";
import { Course, CourseStatus } from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

// Tipo para la respuesta de la API sin fechas parseadas
type CourseResponse = Omit<Course, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

// Función helper para parsear fechas
const parseCourseDates = (course: CourseResponse): Course => ({
  ...course,
  createdAt: new Date(course.createdAt),
  updatedAt: new Date(course.updatedAt),
});

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar cursos
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/courses");
      const data = await handleApiResponse<CourseResponse[]>(response);
      const coursesWithDates = data.map(parseCourseDates);
      setCourses(coursesWithDates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Crear curso
  const createCourse = async (courseData: {
    title: string;
    description?: string;
    platform: string;
    url?: string;
    docsUrl?: string;
    notes?: string;
    tags?: string[];
    status?: CourseStatus;
  }) => {
    try {
      const response = await apiRequest("/api/courses", {
        method: "POST",
        body: JSON.stringify(courseData),
      });

      const newCourse = await handleApiResponse<CourseResponse>(response);
      const courseWithDates = parseCourseDates(newCourse);
      setCourses((prev) => [...prev, courseWithDates]);
      return courseWithDates;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Actualizar curso
  const updateCourse = async (
    id: string,
    courseData: {
      title: string;
      description?: string;
      platform: string;
      url?: string;
      docsUrl?: string;
      notes?: string;
      tags?: string[];
      status?: CourseStatus;
    }
  ) => {
    try {
      const response = await apiRequest(`/api/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(courseData),
      });

      const updatedCourse = await handleApiResponse<CourseResponse>(response);
      const courseWithDates = parseCourseDates(updatedCourse);
      setCourses((prev) =>
        prev.map((course) => (course.id === id ? courseWithDates : course))
      );
      return courseWithDates;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Cambiar estado del curso
  const updateCourseStatus = async (id: string, status: CourseStatus) => {
    try {
      const response = await apiRequest(`/api/courses/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      const updatedCourse = await handleApiResponse<CourseResponse>(response);
      const courseWithDates = parseCourseDates(updatedCourse);
      setCourses((prev) =>
        prev.map((course) => (course.id === id ? courseWithDates : course))
      );
      return courseWithDates;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Eliminar curso
  const deleteCourse = async (id: string) => {
    try {
      const response = await apiRequest(`/api/courses/${id}`, {
        method: "DELETE",
      });

      await handleApiResponse(response);
      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  // Cargar cursos al montar el componente
  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    createCourse,
    updateCourse,
    updateCourseStatus,
    deleteCourse,
    refetch: fetchCourses,
  };
}
