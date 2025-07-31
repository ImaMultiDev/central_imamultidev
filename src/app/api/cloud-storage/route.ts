import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// GET /api/cloud-storage - Obtener todos los cloud storage del usuario
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/cloud-storage - Iniciando request");
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

    console.log("🔍 Buscando cloud storage para usuario:", user.id);

    // En desarrollo, filtrar por userId. En producción, obtener todos
    const whereClause =
      process.env.NODE_ENV === "development" ? { userId: user.id } : {};

    const cloudStorage = await prisma.cloudStorage.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    console.log("✅ Cloud storage encontrados:", cloudStorage.length);

    return NextResponse.json(cloudStorage);
  } catch (error) {
    console.error("❌ Error al obtener cloud storage:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/cloud-storage - Crear un nuevo cloud storage
export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/cloud-storage - Iniciando creación");
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

    console.log("🔍 Intentando crear cloud storage en BD");

    const cloudStorage = await prisma.cloudStorage.create({
      data:
        process.env.NODE_ENV === "development"
          ? { ...baseData, userId: user.id }
          : (baseData as Parameters<
              typeof prisma.cloudStorage.create
            >[0]["data"]),
    });

    console.log("✅ Cloud storage creado exitosamente:", cloudStorage.id);
    return NextResponse.json(cloudStorage, { status: 201 });
  } catch (error) {
    console.error("❌ Error al crear cloud storage:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
