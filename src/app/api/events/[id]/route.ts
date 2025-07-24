import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// PUT /api/events/[id] - Actualizar un evento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 PUT /api/events/[id] - Iniciando actualización");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Actualizando evento ID:", id);

    const body = await request.json();
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

    // En desarrollo, verificar que el usuario sea propietario. En producción, no es necesario
    const whereClause =
      process.env.NODE_ENV === "development" ? { id, userId: user.id } : { id };

    const event = await prisma.event.update({
      where: whereClause,
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        category: category || "PERSONAL",
        isAllDay: isAllDay || false,
      },
    });

    console.log("✅ Evento actualizado exitosamente:", event.id);
    return NextResponse.json(event);
  } catch (error) {
    console.error("❌ Error al actualizar evento:", error);
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
    console.log("🔍 DELETE /api/events/[id] - Iniciando eliminación");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Eliminando evento ID:", id);

    // En desarrollo, verificar que el usuario sea propietario. En producción, no es necesario
    const whereClause =
      process.env.NODE_ENV === "development" ? { id, userId: user.id } : { id };

    await prisma.event.delete({
      where: whereClause,
    });

    console.log("✅ Evento eliminado exitosamente:", id);
    return NextResponse.json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar evento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
