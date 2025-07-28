import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// GET /api/workshop - Obtener todos los workshop del usuario
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/workshop - Iniciando request");
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

    console.log("🔍 Buscando workshop para usuario:", user.id);

    // En desarrollo, filtrar por userId. En producción, obtener todos
    const whereClause =
      process.env.NODE_ENV === "development" ? { userId: user.id } : {};

    const workshop = await prisma.workshop.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    console.log("✅ Workshop encontrados:", workshop.length);

    return NextResponse.json(workshop);
  } catch (error) {
    console.error("❌ Error al obtener workshop:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/workshop - Crear un nuevo workshop
export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/workshop - Iniciando creación");
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

    console.log("🔍 Intentando crear workshop en BD");

    const workshop = await prisma.workshop.create({
      data:
        process.env.NODE_ENV === "development"
          ? { ...baseData, userId: user.id }
          : (baseData as Parameters<typeof prisma.workshop.create>[0]["data"]),
    });

    console.log("✅ Workshop creado exitosamente:", workshop.id);
    return NextResponse.json(workshop, { status: 201 });
  } catch (error) {
    console.error("❌ Error al crear workshop:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
