import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/tools/[id] - Actualizar una herramienta
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, url, type, category, tags } = body;

    // Validaciones básicas
    if (!title || !url || !type || !category) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const tool = await prisma.tool.update({
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

    return NextResponse.json(tool);
  } catch (error) {
    console.error("Error updating tool:", error);
    return NextResponse.json(
      { error: "Error al actualizar la herramienta" },
      { status: 500 }
    );
  }
}

// DELETE /api/tools/[id] - Eliminar una herramienta
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.tool.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Herramienta eliminada correctamente",
    });
  } catch (error) {
    console.error("Error deleting tool:", error);
    return NextResponse.json(
      { error: "Error al eliminar la herramienta" },
      { status: 500 }
    );
  }
}
