import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// GET /api/documentation - Obtener toda la documentación del usuario
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/documentation - Iniciando request");
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

    console.log("🔍 Buscando documentación para usuario:", user.id);

    // En desarrollo, filtrar por userId. En producción, obtener todos
    const whereClause =
      process.env.NODE_ENV === "development" ? { userId: user.id } : {};

    const documentation = await prisma.documentation.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    console.log("✅ Documentación encontrada:", documentation.length);

    return NextResponse.json(documentation);
  } catch (error) {
    console.error("❌ Error al obtener documentación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/documentation - Crear nueva documentación
export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/documentation - Iniciando creación");
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
    const { title, description, url, type, category, tags } = body;

    if (!title || !url || !type || !category) {
      console.log("❌ Datos faltantes:", {
        title: !!title,
        url: !!url,
        type: !!type,
        category: !!category,
      });
      return NextResponse.json(
        { error: "Título, URL, tipo y categoría son requeridos" },
        { status: 400 }
      );
    }

    // En desarrollo, incluir userId. En producción, no es necesario
    const baseData = {
      title,
      description,
      url,
      type,
      category,
      tags: tags || [],
    };

    console.log("🔍 Intentando crear documentación en BD");

    const documentation = await prisma.documentation.create({
      data:
        process.env.NODE_ENV === "development"
          ? { ...baseData, userId: user.id }
          : (baseData as Parameters<
              typeof prisma.documentation.create
            >[0]["data"]),
    });

    console.log("✅ Documentación creada exitosamente:", documentation.id);
    return NextResponse.json(documentation, { status: 201 });
  } catch (error) {
    console.error("❌ Error al crear documentación:", error);
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
