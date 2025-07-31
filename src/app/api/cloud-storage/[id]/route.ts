import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// PUT /api/cloud-storage/[id] - Actualizar un cloud storage
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 PUT /api/cloud-storage/[id] - Iniciando actualización");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Actualizando cloud storage ID:", id);

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

    const cloudStorage = await prisma.cloudStorage.update({
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

    console.log("✅ Cloud storage actualizado exitosamente:", cloudStorage.id);
    return NextResponse.json(cloudStorage);
  } catch (error) {
    console.error("❌ Error al actualizar cloud storage:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/cloud-storage/[id] - Eliminar un cloud storage
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 DELETE /api/cloud-storage/[id] - Iniciando eliminación");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Eliminando cloud storage ID:", id);

    // Verificar que el usuario sea propietario
    const whereClause = { id, userId: user.id };

    await prisma.cloudStorage.delete({
      where: whereClause,
    });

    console.log("✅ Cloud storage eliminado exitosamente:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error al eliminar cloud storage:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
