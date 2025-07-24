import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/events - Obtener todos los eventos del usuario
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      where: { userId: user.id },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/events - Crear un nuevo evento
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, startDate, endDate, category, isAllDay } = body;

    if (!title || !startDate || !category) {
      return NextResponse.json(
        { error: "Título, fecha de inicio y categoría son requeridos" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        category,
        isAllDay: isAllDay || false,
        userId: user.id,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error al crear evento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
