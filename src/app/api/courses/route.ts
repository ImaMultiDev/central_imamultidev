import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// GET /api/courses - Obtener todos los cursos del usuario
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/courses - Iniciando request");
    const token = getTokenFromRequest(request);
    console.log("🔍 Token encontrado:", token ? "Sí" : "No");

    const user = await getCurrentUser(token);
    console.log(
      "🔍 Usuario obtenido:",
      user ? `ID: ${user.id}` : "No autorizado"
    );

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("🔍 Buscando cursos para usuario:", user.id);

    // En desarrollo, filtrar por userId. En producción, obtener todos
    const whereClause =
      process.env.NODE_ENV === "development" ? { userId: user.id } : {};

    const courses = await prisma.course.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    console.log("✅ Cursos encontrados:", courses.length);

    return NextResponse.json(courses);
  } catch (error) {
    console.error("❌ Error al obtener cursos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/courses - Crear un nuevo curso
export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/courses - Iniciando creación");
    const token = getTokenFromRequest(request);
    console.log("🔍 Token encontrado:", token ? "Sí" : "No");

    const user = await getCurrentUser(token);
    console.log(
      "🔍 Usuario obtenido:",
      user ? `ID: ${user.id}` : "No autorizado"
    );

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    console.log("🔍 Datos recibidos:", body);
    const { title, description, platform, url, notes, status } = body;

    if (!title || !platform) {
      console.log("❌ Datos faltantes:", {
        title: !!title,
        platform: !!platform,
      });
      return NextResponse.json(
        { error: "Título y plataforma son requeridos" },
        { status: 400 }
      );
    }

    // En desarrollo, incluir userId. En producción, no es necesario
    const baseData = {
      title,
      description,
      platform,
      url,
      notes,
      status: status || "POR_COMENZAR",
    };

    console.log("🔍 Intentando crear curso en BD");

    const course = await prisma.course.create({
      data:
        process.env.NODE_ENV === "development"
          ? { ...baseData, userId: user.id }
          : (baseData as Parameters<typeof prisma.course.create>[0]["data"]),
    });

    console.log("✅ Curso creado exitosamente:", course.id);
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("❌ Error al crear curso:", error);
    console.error("❌ Detalles del error:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack",
    });
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
