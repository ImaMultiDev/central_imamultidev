"use client";

import { useRouter } from "next/navigation";
import { useEvents } from "@/hooks/useEvents";
import { useCourses } from "@/hooks/useCourses";
import { useDocumentation } from "@/hooks/useDocumentation";
import {
  DashboardHeader,
  DashboardStats,
  DashboardEvents,
  DashboardCourses,
  DashboardQuickActions,
} from "./components";

export function DashboardView() {
  const router = useRouter();
  const { events } = useEvents();
  const { courses } = useCourses();
  const { documentation } = useDocumentation();

  // Función helper para convertir fechas de manera segura
  const safeDate = (date: Date | string): Date => {
    return date instanceof Date ? date : new Date(date);
  };

  // Calcular estadísticas reales
  const stats = {
    totalTasks: events.length,
    completedTasks: 0, // Los eventos no tienen status, así que lo dejamos en 0
    activeCourses: courses.filter((course) => course.status === "EN_PROGRESO")
      .length,
    totalDocuments: documentation.length,
    upcomingEvents: events.filter((event) => {
      const eventDate = safeDate(event.startDate);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventDate >= today && eventDate <= nextWeek;
    }).length,
  };

  // Obtener eventos próximos (próximos 7 días)
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = safeDate(event.startDate);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventDate >= today && eventDate <= nextWeek;
    })
    .sort(
      (a, b) =>
        safeDate(a.startDate).getTime() - safeDate(b.startDate).getTime()
    )
    .slice(0, 5);

  // Obtener cursos en progreso
  const recentCourses = courses
    .filter((course) => course.status === "EN_PROGRESO")
    .slice(0, 3);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "calendar":
        router.push("/calendar");
        break;
      case "newEvent":
        router.push("/calendar");
        break;
      case "newCourse":
        router.push("/courses");
        break;
      case "newDocument":
        router.push("/docs");
        break;
      case "hardwareTest":
        router.push("/hardware-test");
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader onViewCalendar={() => router.push("/calendar")} />

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Events */}
        <DashboardEvents events={upcomingEvents} />

        {/* Recent Courses */}
        <DashboardCourses courses={recentCourses} />
      </div>

      {/* Quick Actions */}
      <DashboardQuickActions onQuickAction={handleQuickAction} />
    </div>
  );
}
