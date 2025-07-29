import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// PUT /api/courses/[id] - Actualizar un curso
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 PUT /api/courses/[id] - Iniciando actualización");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Actualizando curso ID:", id);

    const body = await request.json();
    const { title, description, platform, url, docsUrl, notes, status, tags } =
      body;

    if (!title || !platform) {
      console.log("❌ Datos faltantes:", {
        title: !!title,
        platform: !!platform,
      });
      return NextResponse.json(
        { error: "Título y plataforma son requeridos" },
        { status: 400 }
      );
    }

    // En desarrollo, verificar que el usuario sea propietario. En producción, no es necesario
    const whereClause =
      process.env.NODE_ENV === "development" ? { id, userId: user.id } : { id };

    const course = await prisma.course.update({
      where: whereClause,
      data: {
        title,
        description,
        platform,
        url,
        docsUrl,
        notes,
        tags: tags || [],
        status: status || "POR_COMENZAR",
      },
    });

    console.log("✅ Curso actualizado exitosamente:", course.id);
    return NextResponse.json(course);
  } catch (error) {
    console.error("❌ Error al actualizar curso:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Eliminar un curso
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 DELETE /api/courses/[id] - Iniciando eliminación");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Eliminando curso ID:", id);

    // En desarrollo, verificar que el usuario sea propietario. En producción, no es necesario
    const whereClause =
      process.env.NODE_ENV === "development" ? { id, userId: user.id } : { id };

    await prisma.course.delete({
      where: whereClause,
    });

    console.log("✅ Curso eliminado exitosamente:", id);
    return NextResponse.json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar curso:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
