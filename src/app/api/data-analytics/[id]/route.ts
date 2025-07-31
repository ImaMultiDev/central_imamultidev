import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// PUT /api/data-analytics/[id] - Actualizar un data analytics
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 PUT /api/data-analytics/[id] - Iniciando actualización");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Actualizando data analytics ID:", id);

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

    // Verificar que el usuario sea propietario
    const whereClause = { id, userId: user.id };

    const dataAnalytics = await prisma.dataAnalytics.update({
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

    console.log(
      "✅ Data analytics actualizado exitosamente:",
      dataAnalytics.id
    );
    return NextResponse.json(dataAnalytics);
  } catch (error) {
    console.error("❌ Error al actualizar data analytics:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/data-analytics/[id] - Eliminar un data analytics
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 DELETE /api/data-analytics/[id] - Iniciando eliminación");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Eliminando data analytics ID:", id);

    // Verificar que el usuario sea propietario
    const whereClause = { id, userId: user.id };

    await prisma.dataAnalytics.delete({
      where: whereClause,
    });

    console.log("✅ Data analytics eliminado exitosamente:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error al eliminar data analytics:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
