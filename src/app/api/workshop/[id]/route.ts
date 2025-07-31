import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/workshop/[id] - Actualizar un workshop
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, url, type, category, tags } = body;

    // Validaciones básicas
    if (!title || !url || !type || !category) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const workshop = await prisma.workshop.update({
      where: { id },
      data: {
        title,
        description,
        url,
        type,
        category,
        tags: tags || [],
      },
    });

    return NextResponse.json(workshop);
  } catch (error) {
    console.error("Error updating workshop:", error);
    return NextResponse.json(
      { error: "Error al actualizar el workshop" },
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
    const { id } = await params;

    await prisma.workshop.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Workshop eliminado correctamente",
    });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    return NextResponse.json(
      { error: "Error al eliminar el workshop" },
      { status: 500 }
    );
  }
}
