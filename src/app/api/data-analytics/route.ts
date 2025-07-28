import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// GET /api/data-analytics - Obtener todos los data analytics del usuario
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/data-analytics - Iniciando request");
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

    console.log("🔍 Buscando data analytics para usuario:", user.id);

    // En desarrollo, filtrar por userId. En producción, obtener todos
    const whereClause =
      process.env.NODE_ENV === "development" ? { userId: user.id } : {};

    const dataAnalytics = await prisma.dataAnalytics.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    console.log("✅ Data analytics encontrados:", dataAnalytics.length);

    return NextResponse.json(dataAnalytics);
  } catch (error) {
    console.error("❌ Error al obtener data analytics:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/data-analytics - Crear un nuevo data analytics
export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/data-analytics - Iniciando creación");
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

    if (!title || !type || !category) {
      console.log("❌ Datos faltantes:", {
        title: !!title,
        type: !!type,
        category: !!category,
      });
      return NextResponse.json(
        { error: "Título, tipo y categoría son requeridos" },
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

    console.log("🔍 Intentando crear data analytics en BD");

    const dataAnalytics = await prisma.dataAnalytics.create({
      data:
        process.env.NODE_ENV === "development"
          ? { ...baseData, userId: user.id }
          : (baseData as Parameters<
              typeof prisma.dataAnalytics.create
            >[0]["data"]),
    });

    console.log("✅ Data analytics creado exitosamente:", dataAnalytics.id);
    return NextResponse.json(dataAnalytics, { status: 201 });
  } catch (error) {
    console.error("❌ Error al crear data analytics:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
