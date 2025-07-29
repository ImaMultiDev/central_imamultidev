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
  docsUrl?: string;
  notes?: string;
  tags: string[];
  tagsInput?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CourseStatus {
  EN_PROGRESO = "EN_PROGRESO",
  COMPLETADO = "COMPLETADO",
  POR_COMENZAR = "POR_COMENZAR",
}

export interface Tutorial {
  id: string;
  title: string;
  description?: string;
  platform: string;
  status: TutorialStatus;
  url?: string;
  docsUrl?: string;
  notes?: string;
  tags: string[];
  tagsInput?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TutorialStatus {
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

export interface Tool {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: ToolType;
  category: ToolCategory;
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ToolType {
  DESPLIEGUE = "DESPLIEGUE",
  DISENO = "DISENO",
  MULTIMEDIA = "MULTIMEDIA",
  IA_GENERATIVA = "IA_GENERATIVA",
  DOCUMENTACION = "DOCUMENTACION",
  LEGAL = "LEGAL",
  DESARROLLO = "DESARROLLO",
  MONITOREO = "MONITOREO",
  COMUNICACION = "COMUNICACION",
}

export enum ToolCategory {
  SERVICIOS_CLOUD = "SERVICIOS_CLOUD",
  HERRAMIENTAS_DISENO = "HERRAMIENTAS_DISENO",
  EDITORES_MULTIMEDIA = "EDITORES_MULTIMEDIA",
  IA_ARTE = "IA_ARTE",
  IA_TEXTO = "IA_TEXTO",
  IA_CODIGO = "IA_CODIGO",
  PLATAFORMAS_DOCS = "PLATAFORMAS_DOCS",
  SERVICIOS_LEGALES = "SERVICIOS_LEGALES",
  IDES_EDITORES = "IDES_EDITORES",
  SERVICIOS_BASE_DATOS = "SERVICIOS_BASE_DATOS",
  AUTENTICACION = "AUTENTICACION",
  ANALITICAS = "ANALITICAS",
  CHAT_COLABORACION = "CHAT_COLABORACION",
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  activeCourses: number;
  totalTutorials: number;
  totalDocuments: number;
  totalTools: number;
  upcomingEvents: number;
  totalDataAnalytics: number;
  totalCloudStorage: number;
  totalGenerativeAI: number;
  totalWorkshop: number;
}

// Nuevos tipos para las vistas adicionales

// Data & Analytics
export interface DataAnalytics {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: DataAnalyticsType;
  category: DataAnalyticsCategory;
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DataAnalyticsType {
  BUSINESS_INTELLIGENCE = "BUSINESS_INTELLIGENCE",
  DATA_PROCESSING = "DATA_PROCESSING",
  MACHINE_LEARNING = "MACHINE_LEARNING",
  DATA_VISUALIZATION = "DATA_VISUALIZATION",
  ETL_ELT = "ETL_ELT",
  CLOUD_ANALYTICS = "CLOUD_ANALYTICS",
}

export enum DataAnalyticsCategory {
  DASHBOARDS = "DASHBOARDS",
  SELF_SERVICE_BI = "SELF_SERVICE_BI",
  CLOUD_ANALYTICS = "CLOUD_ANALYTICS",
  DATA_LAKES = "DATA_LAKES",
  ETL_ELT = "ETL_ELT",
  ML_PLATFORMS = "ML_PLATFORMS",
  AUTOML = "AUTOML",
  MLOPS = "MLOPS",
  ADVANCED_VIZ = "ADVANCED_VIZ",
  STATISTICAL = "STATISTICAL",
}

// Cloud & Storage
export interface CloudStorage {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: CloudStorageType;
  category: CloudStorageCategory;
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CloudStorageType {
  PERSONAL_STORAGE = "PERSONAL_STORAGE",
  HIGH_CAPACITY = "HIGH_CAPACITY",
  COLLABORATION = "COLLABORATION",
  BACKUP = "BACKUP",
  FILE_TRANSFER = "FILE_TRANSFER",
  NOTE_TAKING = "NOTE_TAKING",
  HOSTING = "HOSTING",
  CLOUD_PROVIDERS = "CLOUD_PROVIDERS",
  DATABASES = "DATABASES",
  CDN = "CDN",
  CI_CD = "CI_CD",
  MONITORING = "MONITORING",
}

export enum CloudStorageCategory {
  STORAGE_SYNC = "STORAGE_SYNC",
  DEV_INFRASTRUCTURE = "DEV_INFRASTRUCTURE",
}

// Generative AI
export interface GenerativeAI {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: GenerativeAIType;
  category: GenerativeAICategory;
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum GenerativeAIType {
  TEXT = "TEXT",
  CODE = "CODE",
  IMAGE = "IMAGE",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  PRODUCTIVITY = "PRODUCTIVITY",
}

export enum GenerativeAICategory {
  TEXT_GENERATION = "TEXT_GENERATION",
  CODE_GENERATION = "CODE_GENERATION",
  IMAGE_GENERATION = "IMAGE_GENERATION",
  AUDIO_GENERATION = "AUDIO_GENERATION",
  VIDEO_GENERATION = "VIDEO_GENERATION",
  PRODUCTIVITY_AI = "PRODUCTIVITY_AI",
}

// Workshop
export interface Workshop {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: WorkshopType;
  category: WorkshopCategory;
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum WorkshopType {
  MULTIMEDIA_EDITING = "MULTIMEDIA_EDITING",
  CONVERSION = "CONVERSION",
  UTILITIES = "UTILITIES",
}

export enum WorkshopCategory {
  IMAGES = "IMAGES",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  FILES = "FILES",
  GENERATORS = "GENERATORS",
  TESTING = "TESTING",
  ANALYSIS = "ANALYSIS",
}
