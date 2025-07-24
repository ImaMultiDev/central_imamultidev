import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// PUT /api/events/[id] - Actualizar un evento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, startDate, endDate, category, isAllDay } = body;

    if (!title || !startDate || !category) {
      return NextResponse.json(
        { error: "Título, fecha de inicio y categoría son requeridos" },
        { status: 400 }
      );
    }

    const event = await prisma.event.update({
      where: {
        id,
        userId: user.id, // Asegurar que solo el propietario puede actualizar
      },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        category,
        isAllDay: isAllDay || false,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error al actualizar evento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Eliminar un evento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.event.delete({
      where: {
        id,
        userId: user.id, // Asegurar que solo el propietario puede eliminar
      },
    });

    return NextResponse.json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
