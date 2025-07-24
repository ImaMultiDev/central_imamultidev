import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// PUT /api/documentation/[id] - Actualizar un documento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 PUT /api/documentation/[id] - Iniciando actualización");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Actualizando documento ID:", id);

    const body = await request.json();
    const { title, description, url, type, category, tags } = body;

    if (!title || !url || !type || !category) {
      console.log("❌ Datos faltantes:", {
        title: !!title,
        url: !!url,
        type: !!type,
        category: !!category,
      });
      return NextResponse.json(
        { error: "Título, URL, tipo y categoría son requeridos" },
        { status: 400 }
      );
    }

    // En desarrollo, verificar que el usuario sea propietario. En producción, no es necesario
    const whereClause =
      process.env.NODE_ENV === "development" ? { id, userId: user.id } : { id };

    const documentation = await prisma.documentation.update({
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

    console.log("✅ Documento actualizado exitosamente:", documentation.id);
    return NextResponse.json(documentation);
  } catch (error) {
    console.error("❌ Error al actualizar documento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/documentation/[id] - Eliminar un documento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 DELETE /api/documentation/[id] - Iniciando eliminación");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Eliminando documento ID:", id);

    // En desarrollo, verificar que el usuario sea propietario. En producción, no es necesario
    const whereClause =
      process.env.NODE_ENV === "development" ? { id, userId: user.id } : { id };

    await prisma.documentation.delete({
      where: whereClause,
    });

    console.log("✅ Documento eliminado exitosamente:", id);
    return NextResponse.json({ message: "Documento eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar documento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
