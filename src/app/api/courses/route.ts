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
    const courses = await prisma.course.findMany({
      where: { userId: user.id },
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

    console.log("🔍 Intentando crear curso en BD con datos:", {
      title,
      description,
      platform,
      url,
      notes,
      status: status || "POR_COMENZAR",
      userId: user.id,
    });

    const course = await prisma.course.create({
      data: {
        title,
        description,
        platform,
        url,
        notes,
        status: status || "POR_COMENZAR",
        userId: user.id,
      },
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
