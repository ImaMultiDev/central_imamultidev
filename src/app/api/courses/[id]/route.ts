import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// PUT /api/courses/[id] - Actualizar un curso
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
    const { title, description, platform, url, notes, status } = body;

    if (!title || !platform) {
      return NextResponse.json(
        { error: "Título y plataforma son requeridos" },
        { status: 400 }
      );
    }

    const course = await prisma.course.update({
      where: {
        id,
        userId: user.id, // Asegurar que solo el propietario puede actualizar
      },
      data: {
        title,
        description,
        platform,
        url,
        notes,
        status: status || "POR_COMENZAR",
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error al actualizar curso:", error);
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
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.course.delete({
      where: {
        id,
        userId: user.id, // Asegurar que solo el propietario puede eliminar
      },
    });

    return NextResponse.json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
