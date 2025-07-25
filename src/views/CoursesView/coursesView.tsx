"use client";

import { useState, useEffect } from "react";
import { Course, CourseStatus } from "@/types";
import { useCourses } from "@/hooks/useCourses";
import {
  CoursesHeader,
  CoursesStats,
  CoursesFilters,
  CoursesGrid,
  CoursesModals,
} from "./components";

export function CoursesView() {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    platform: "",
    url: "",
    notes: "",
    tags: [] as string[],
    tagsInput: "",
    status: "POR_COMENZAR" as CourseStatus,
  });

  const {
    courses,
    createCourse,
    updateCourseStatus,
    updateCourse,
    deleteCourse,
  } = useCourses();

  const filteredCourses = courses.filter((course) => {
    const matchesStatus =
      selectedStatus === "ALL" || course.status === selectedStatus;
    const matchesPlatform =
      selectedPlatform === "ALL" || course.platform === selectedPlatform;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );

    return matchesStatus && matchesPlatform && matchesSearch;
  });

  const handleCreateCourse = async () => {
    try {
      setIsCreating(true);
      await createCourse(newCourse);
      setIsCourseModalOpen(false);
      setNewCourse({
        title: "",
        description: "",
        platform: "",
        url: "",
        notes: "",
        tags: [],
        tagsInput: "",
        status: "POR_COMENZAR" as CourseStatus,
      });
    } catch (error) {
      console.error("Error al crear curso:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusChange = async (
    courseId: string,
    newStatus: CourseStatus
  ) => {
    try {
      setIsStatusUpdating(courseId);
      await updateCourseStatus(courseId, newStatus);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    } finally {
      setIsStatusUpdating(null);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse({
      ...course,
      tagsInput: "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    try {
      setIsUpdating(true);
      await updateCourse(editingCourse.id, {
        title: editingCourse.title,
        description: editingCourse.description || "",
        platform: editingCourse.platform,
        url: editingCourse.url || "",
        notes: editingCourse.notes || "",
        tags: editingCourse.tags || [],
        status: editingCourse.status,
      });
      setIsEditModalOpen(false);
      setEditingCourse(null);
    } catch (error) {
      console.error("Error al actualizar curso:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este curso?")) return;

    try {
      setIsDeleting(courseId);
      await deleteCourse(courseId);
    } catch (error) {
      console.error("Error al eliminar curso:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".course-menu-button")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const stats = {
    total: courses.length,
    inProgress: courses.filter((c) => c.status === "EN_PROGRESO").length,
    completed: courses.filter((c) => c.status === "COMPLETADO").length,
    pending: courses.filter((c) => c.status === "POR_COMENZAR").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <CoursesHeader onAddCourse={() => setIsCourseModalOpen(true)} />

      {/* Stats Grid */}
      <CoursesStats stats={stats} />

      {/* Filters and Search */}
      <CoursesFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Courses Grid */}
      <CoursesGrid
        courses={filteredCourses}
        onStatusChange={handleStatusChange}
        onEditCourse={handleEditCourse}
        onDeleteCourse={handleDeleteCourse}
        openMenuId={openMenuId}
        onOpenMenuChange={setOpenMenuId}
        isDeleting={isDeleting}
        isStatusUpdating={isStatusUpdating}
        onAddCourse={() => setIsCourseModalOpen(true)}
      />

      {/* Modals */}
      <CoursesModals
        isCourseModalOpen={isCourseModalOpen}
        onCourseModalClose={() => setIsCourseModalOpen(false)}
        isEditModalOpen={isEditModalOpen}
        onEditModalClose={() => {
          setIsEditModalOpen(false);
          setEditingCourse(null);
        }}
        newCourse={newCourse}
        onNewCourseChange={setNewCourse}
        editingCourse={editingCourse}
        onEditingCourseChange={setEditingCourse}
        isCreating={isCreating}
        isUpdating={isUpdating}
        onCreateCourse={handleCreateCourse}
        onUpdateCourse={handleUpdateCourse}
      />
    </div>
  );
}
