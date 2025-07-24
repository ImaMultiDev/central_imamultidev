"use client";

import {
  Calendar,
  BookOpen,
  FileText,
  TrendingUp,
  Monitor,
  Wrench,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardQuickActionsProps {
  onQuickAction: (action: string) => void;
}

export function DashboardQuickActions({
  onQuickAction,
}: DashboardQuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>
          Accede rápidamente a las funciones más utilizadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2"
            onClick={() => onQuickAction("newEvent")}
          >
            <Calendar className="h-6 w-6" />
            <span>Nuevo Evento</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2"
            onClick={() => onQuickAction("newCourse")}
          >
            <BookOpen className="h-6 w-6" />
            <span>Añadir Curso</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2"
            onClick={() => onQuickAction("newDocument")}
          >
            <FileText className="h-6 w-6" />
            <span>Guardar Documento</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2"
            onClick={() => onQuickAction("newTool")}
          >
            <Wrench className="h-6 w-6" />
            <span>Añadir Herramienta</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2"
            onClick={() => onQuickAction("hardwareTest")}
          >
            <Monitor className="h-6 w-6" />
            <span>Test Hardware</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2"
            onClick={() => onQuickAction("calendar")}
          >
            <TrendingUp className="h-6 w-6" />
            <span>Ver Calendario</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
