"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course } from "@/types";

interface DashboardCoursesProps {
  courses: Course[];
}

export function DashboardCourses({ courses }: DashboardCoursesProps) {
  const recentCourses = useMemo(() => {
    return courses
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime(); // Ordenar por más reciente primero
      })
      .slice(0, 5); // Limitar a 5 cursos
  }, [courses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cursos en Progreso</CardTitle>
        <CardDescription>Continúa donde lo dejaste</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCourses.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">
                  {course.title}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{course.platform}</p>
            </div>
          ))}
          {recentCourses.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No tienes cursos en progreso
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
