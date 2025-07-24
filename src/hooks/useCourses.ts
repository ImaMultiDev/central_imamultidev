import { useState, useEffect } from "react";
import { Course, CourseStatus } from "@/types";
import { apiRequest, handleApiResponse } from "@/lib/api";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar cursos
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/courses");
      const data = await handleApiResponse<Course[]>(response);
      setCourses(data);
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
    notes?: string;
    status?: CourseStatus;
  }) => {
    try {
      const response = await apiRequest("/api/courses", {
        method: "POST",
        body: JSON.stringify(courseData),
      });

      const newCourse = await handleApiResponse<Course>(response);
      setCourses((prev) => [...prev, newCourse]);
      return newCourse;
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
      notes?: string;
      status?: CourseStatus;
    }
  ) => {
    try {
      const response = await apiRequest(`/api/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(courseData),
      });

      const updatedCourse = await handleApiResponse<Course>(response);
      setCourses((prev) =>
        prev.map((course) => (course.id === id ? updatedCourse : course))
      );
      return updatedCourse;
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

      const updatedCourse = await handleApiResponse<Course>(response);
      setCourses((prev) =>
        prev.map((course) => (course.id === id ? updatedCourse : course))
      );
      return updatedCourse;
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
