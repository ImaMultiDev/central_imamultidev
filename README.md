# Central IMA - Dashboard Personal

Una aplicación web moderna tipo dashboard que funciona como centro de operaciones diarias personal. Construida con Next.js 15, React 19, TypeScript y Tailwind CSS 4.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Central+IMA+Dashboard)

## 🚀 Características Principales

### 📊 **Dashboard Principal**

- Vista general con widgets de resumen dinámicos
- Estadísticas en tiempo real de todas las secciones
- Cards informativas con datos reales desde la base de datos
- Acciones rápidas funcionales a todas las secciones
- Eventos próximos calculados dinámicamente
- Cursos en progreso sin porcentajes (según backend)

### 📅 **Calendario y Gestión de Tareas**

- **Vistas múltiples**: Mes, Semana y Día
- Calendario interactivo con navegación temporal
- Crear, editar y eliminar eventos
- Categorización por tipo (Trabajo, Personal, Estudio, Salud)
- Modal detallado para gestión de eventos
- Filtros por categoría y búsqueda
- Vista de próximos eventos en dashboard

### 📚 **Gestión de Cursos**

- Organización por estado: "En progreso", "Completados", "Por comenzar"
- Soporte para múltiples plataformas (Udemy, Coursera, YouTube, Platzi)
- Sistema de notas personales
- Gestión de certificaciones
- Filtros por estado y plataforma
- Búsqueda avanzada

### 📖 **Centro de Documentación**

- Categorización por materias técnicas (Frontend, Backend, Databases, DevOps)
- Tipos de recursos (Documentación oficial, Tutoriales, Cheat Sheets, etc.)
- Sistema de etiquetas con gestión avanzada
- Búsqueda avanzada y filtros múltiples
- Enlaces directos a recursos
- Estadísticas de documentos por categoría

### 🔧 **Test de Hardware**

- **Test de cámara web** con captura de fotos
- **Test de micrófono** con grabación y reproducción (MediaRecorder API)
- **Test de altavoces** con tonos de prueba (Web Audio API)
- **Test de pantalla** con información del sistema
- Información detallada del navegador y APIs disponibles
- Resumen visual de resultados de tests

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 con App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 4 (tema oscuro)
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: Sistema básico con JWT y bcrypt
- **Iconos**: Lucide React
- **Utilities**: clsx, tailwind-merge, date-fns
- **APIs**: MediaDevices, AudioContext, Canvas, MediaRecorder

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/central-imamultidev.git
cd central-imamultidev
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus configuraciones:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/central_imamultidev"

# JWT Secret para autenticación
JWT_SECRET="tu-clave-secreta-super-segura-aqui"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
```

4. **Configurar la base de datos**

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar las migraciones
npx prisma db push

# (Opcional) Llenar con datos de ejemplo
npx prisma db seed
```

5. **Ejecutar en desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🚀 Despliegue en Producción

### Vercel (Recomendado)

1. **Conectar repositorio a Vercel**
2. **Configurar variables de entorno en Vercel**
3. **Configurar base de datos PostgreSQL**
   - Recomendado: Neon, Supabase, o Railway
4. **Deploy automático**

### Docker

```bash
# Construir imagen
docker build -t central-ima .

# Ejecutar contenedor
docker run -p 3000:3000 -e DATABASE_URL="tu_url" central-ima
```

## 📁 Estructura del Proyecto

```
central_imamultidev/
├── src/
│   ├── app/                 # App Router de Next.js
│   │   ├── calendar/        # Página de calendario
│   │   ├── courses/         # Gestión de cursos
│   │   ├── docs/           # Centro de documentación
│   │   ├── hardware-test/   # Test de hardware
│   │   ├── api/            # API routes
│   │   ├── globals.css     # Estilos globales
│   │   ├── layout.tsx      # Layout principal
│   │   └── page.tsx        # Dashboard principal
│   ├── components/         # Componentes reutilizables
│   │   ├── ui/            # Componentes UI base
│   │   └── sidebar.tsx    # Sidebar de navegación
│   ├── views/              # Vistas modulares
│   │   ├── CalendarView/   # Vista de calendario
│   │   ├── CoursesView/    # Vista de cursos
│   │   ├── DocsView/       # Vista de documentación
│   │   ├── HardwareTestView/ # Vista de tests
│   │   └── DashboardView/  # Vista del dashboard
│   ├── hooks/              # Custom hooks
│   │   ├── useEvents.ts    # Hook para eventos
│   │   ├── useCourses.ts   # Hook para cursos
│   │   └── useDocumentation.ts # Hook para documentación
│   ├── lib/               # Utilidades y configuraciones
│   │   ├── prisma.ts      # Cliente de Prisma
│   │   ├── auth.ts        # Utilidades de autenticación
│   │   └── utils.ts       # Funciones helper
│   └── types/             # Definiciones de TypeScript
├── prisma/
│   └── schema.prisma      # Esquema de base de datos
├── public/                # Archivos estáticos
└── README.md
```

## 🎨 Características de UI/UX

- **Diseño moderno y minimalista**
- **Tema oscuro por defecto**
- **Sidebar collapsible** con navegación intuitiva
- **Completamente responsive** (desktop, tablet, móvil)
- **Iconos SVG** usando Lucide React
- **Componentes reutilizables** con sistema de diseño consistente
- **Loading states** y skeleton loaders
- **Manejo elegante de errores**
- **Modales y formularios** optimizados para UX

## 🔧 Funcionalidades Avanzadas

### Arquitectura Modular

- **Componentes modulares** organizados por vista
- **Separación de responsabilidades** clara
- **Reutilización de código** optimizada
- **Props tipadas** con TypeScript
- **Estado centralizado** en componentes padre

### Tailwind CSS 4

La aplicación usa Tailwind CSS v4 con:

- Configuración CSS-first usando `@theme`
- Variables CSS nativas
- Tema oscuro optimizado
- Animaciones personalizadas

### Gestión de Estado

- Estados locales con React Hooks
- Custom hooks para lógica de negocio
- Persistencia temporal con LocalStorage
- Datos reales desde APIs

### Responsividad

- Mobile-first design
- Sidebar adaptativo
- Grids responsivos
- Touch-friendly interfaces

## 📱 Compatibilidad

- **Navegadores**: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
- **Dispositivos**: Desktop, Tablet, Mobile
- **APIs**: MediaDevices, AudioContext, Canvas, MediaRecorder

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide](https://lucide.dev/) - Iconos
- [Prisma](https://prisma.io/) - ORM
- [Vercel](https://vercel.com/) - Platform de deployment

---

**Central IMA** - Tu centro de operaciones diarias personal 🚀
