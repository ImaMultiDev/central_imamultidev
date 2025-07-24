"use client";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cursos en Progreso</CardTitle>
        <CardDescription>Continúa donde lo dejaste</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">
                  {course.title}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{course.platform}</p>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No tienes cursos en progreso
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
