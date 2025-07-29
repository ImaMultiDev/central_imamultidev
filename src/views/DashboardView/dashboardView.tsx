"use client";

import { useRouter } from "next/navigation";
import { useEvents } from "@/hooks/useEvents";
import { useCourses } from "@/hooks/useCourses";
import { useDocumentation } from "@/hooks/useDocumentation";
import { useTools } from "@/hooks/useTools";
import { useDataAnalytics } from "@/hooks/useDataAnalytics";
import { useCloudStorage } from "@/hooks/useCloudStorage";
import { useGenerativeAI } from "@/hooks/useGenerativeAI";
import { useWorkshop } from "@/hooks/useWorkshop";
import { useTutorials } from "@/hooks/useTutorials";
import {
  DashboardHeader,
  DashboardStats,
  DashboardEvents,
  DashboardCourses,
  DashboardTools,
  DashboardQuickActions,
} from "./components";

export function DashboardView() {
  const router = useRouter();
  const { events } = useEvents();
  const { courses } = useCourses();
  const { documentation } = useDocumentation();
  const { tools } = useTools();
  const { dataAnalytics } = useDataAnalytics();
  const { cloudStorage } = useCloudStorage();
  const { generativeAI } = useGenerativeAI();
  const { workshop } = useWorkshop();
  const { tutorials } = useTutorials();

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
    totalTools: tools.length,
    totalDataAnalytics: dataAnalytics.length,
    totalCloudStorage: cloudStorage.length,
    totalGenerativeAI: generativeAI.length,
    totalWorkshop: workshop.length,
    totalTutorials: tutorials.length,
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

  // Obtener herramientas recientes
  const recentTools = tools
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    })
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
      case "newTutorial":
        router.push("/tutorials");
        break;
      case "newDocument":
        router.push("/docs");
        break;
      case "newTool":
        router.push("/tools");
        break;
      case "hardwareTest":
        router.push("/hardware-test");
        break;
      case "dataAnalytics":
        router.push("/data-analytics");
        break;
      case "cloudStorage":
        router.push("/cloud-storage");
        break;
      case "generativeAI":
        router.push("/generative-ai");
        break;
      case "workshop":
        router.push("/workshop");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6">
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

        {/* Recent Tools */}
        <DashboardTools tools={recentTools} />
      </div>

      {/* Quick Actions */}
      <DashboardQuickActions onQuickAction={handleQuickAction} />
    </div>
  );
}
