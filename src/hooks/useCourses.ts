import { useState, useEffect } from "react";
import { Course, CourseStatus } from "@/types";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar cursos
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/courses");
      if (!response.ok) {
        throw new Error("Error al cargar cursos");
      }
      const data = await response.json();
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
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Error al crear curso");
      }

      const newCourse = await response.json();
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
      const response = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar curso");
      }

      const updatedCourse = await response.json();
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
      const response = await fetch(`/api/courses/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Error al cambiar estado del curso");
      }

      const updatedCourse = await response.json();
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
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar curso");
      }

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
