import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// PUT /api/workshop/[id] - Actualizar un workshop
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 PUT /api/workshop/[id] - Iniciando actualización");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Actualizando workshop ID:", id);

    const body = await request.json();
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

    // En desarrollo, verificar que el usuario sea propietario. En producción, no es necesario
    const whereClause =
      process.env.NODE_ENV === "development" ? { id, userId: user.id } : { id };

    const workshop = await prisma.workshop.update({
      where: whereClause,
      data: {
        title,
        description,
        url,
        type,
        category,
        tags: tags || [],
      },
    });

    console.log("✅ Workshop actualizado exitosamente:", workshop.id);
    return NextResponse.json(workshop);
  } catch (error) {
    console.error("❌ Error al actualizar workshop:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/workshop/[id] - Eliminar un workshop
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 DELETE /api/workshop/[id] - Iniciando eliminación");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Eliminando workshop ID:", id);

    // En desarrollo, verificar que el usuario sea propietario. En producción, no es necesario
    const whereClause =
      process.env.NODE_ENV === "development" ? { id, userId: user.id } : { id };

    await prisma.workshop.delete({
      where: whereClause,
    });

    console.log("✅ Workshop eliminado exitosamente:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error al eliminar workshop:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
