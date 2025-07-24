import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// PUT /api/documentation/[id] - Actualizar documentación
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
    const { title, description, url, type, category, tags } = body;

    if (!title || !url || !type || !category) {
      return NextResponse.json(
        { error: "Título, URL, tipo y categoría son requeridos" },
        { status: 400 }
      );
    }

    const documentation = await prisma.documentation.update({
      where: {
        id,
        userId: user.id, // Asegurar que solo el propietario puede actualizar
      },
      data: {
        title,
        description,
        url,
        type,
        category,
        tags: tags || [],
      },
    });

    return NextResponse.json(documentation);
  } catch (error) {
    console.error("Error al actualizar documentación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE /api/documentation/[id] - Eliminar documentación
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

    await prisma.documentation.delete({
      where: {
        id,
        userId: user.id, // Asegurar que solo el propietario puede eliminar
      },
    });

    return NextResponse.json({
      message: "Documentación eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar documentación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
