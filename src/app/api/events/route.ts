import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// GET /api/events - Obtener todos los eventos del usuario
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET /api/events - Iniciando request");
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

    console.log("🔍 Buscando eventos para usuario:", user.id);

    // En desarrollo, filtrar por userId. En producción, obtener todos
    const whereClause =
      process.env.NODE_ENV === "development" ? { userId: user.id } : {};

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { startDate: "asc" },
    });
    console.log("✅ Eventos encontrados:", events.length);

    return NextResponse.json(events);
  } catch (error) {
    console.error("❌ Error al obtener eventos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/events - Crear un nuevo evento
export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/events - Iniciando creación");
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
    const { title, description, startDate, endDate, category, isAllDay } = body;

    if (!title || !startDate) {
      console.log("❌ Datos faltantes:", {
        title: !!title,
        startDate: !!startDate,
      });
      return NextResponse.json(
        { error: "Título y fecha de inicio son requeridos" },
        { status: 400 }
      );
    }

    // En desarrollo, incluir userId. En producción, no es necesario
    const baseData = {
      title,
      description,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      category: category || "PERSONAL",
      isAllDay: isAllDay || false,
    };

    console.log("🔍 Intentando crear evento en BD");

    const event = await prisma.event.create({
      data:
        process.env.NODE_ENV === "development"
          ? { ...baseData, userId: user.id }
          : (baseData as Parameters<typeof prisma.event.create>[0]["data"]),
    });

    console.log("✅ Evento creado exitosamente:", event.id);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("❌ Error al crear evento:", error);
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
