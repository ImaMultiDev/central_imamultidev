import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// GET /api/tutorials - Obtener todos los tutoriales del usuario
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/tutorials - Iniciando request");
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

    console.log("🔍 Buscando tutoriales para usuario:", user.id);

    // En desarrollo, filtrar por userId. En producción, obtener todos
    const whereClause =
      process.env.NODE_ENV === "development" ? { userId: user.id } : {};

    const tutorials = await prisma.tutorial.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    console.log("✅ Tutoriales encontrados:", tutorials.length);

    return NextResponse.json(tutorials);
  } catch (error) {
    console.error("❌ Error al obtener tutoriales:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/tutorials - Crear un nuevo tutorial
export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/tutorials - Iniciando creación");
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
    const { title, description, platform, url, docsUrl, notes, status, tags } =
      body;

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
      docsUrl,
      notes,
      tags: tags || [],
      status: status || "POR_COMENZAR",
    };

    console.log("🔍 Intentando crear tutorial en BD");

    const tutorial = await prisma.tutorial.create({
      data:
        process.env.NODE_ENV === "development"
          ? { ...baseData, userId: user.id }
          : (baseData as Parameters<typeof prisma.tutorial.create>[0]["data"]),
    });

    console.log("✅ Tutorial creado exitosamente:", tutorial.id);
    return NextResponse.json(tutorial, { status: 201 });
  } catch (error) {
    console.error("❌ Error al crear tutorial:", error);
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
