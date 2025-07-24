export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  category: EventCategory;
  isAllDay: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum EventCategory {
  TRABAJO = "TRABAJO",
  PERSONAL = "PERSONAL",
  ESTUDIO = "ESTUDIO",
  SALUD = "SALUD",
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  platform: string;
  status: CourseStatus;
  url?: string;
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CourseStatus {
  EN_PROGRESO = "EN_PROGRESO",
  COMPLETADO = "COMPLETADO",
  POR_COMENZAR = "POR_COMENZAR",
}

export interface Documentation {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: DocumentationType;
  category: DocumentationCategory;
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DocumentationType {
  DOCUMENTACION_OFICIAL = "DOCUMENTACION_OFICIAL",
  TUTORIAL = "TUTORIAL",
  CHEAT_SHEET = "CHEAT_SHEET",
  ARTICULO = "ARTICULO",
  VIDEO = "VIDEO",
}

export enum DocumentationCategory {
  MULTIPLATAFORMA = "MULTIPLATAFORMA",
  BACKEND = "BACKEND",
  BASES_DATOS = "BASES_DATOS",
  FRONTEND = "FRONTEND",
  CIENCIA_DATOS = "CIENCIA_DATOS",
  LENGUAJES = "LENGUAJES",
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  activeCourses: number;
  totalDocuments: number;
  upcomingEvents: number;
}
