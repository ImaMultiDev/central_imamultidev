import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/generative-ai/[id] - Actualizar un generative AI
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

    const generativeAI = await prisma.generativeAI.update({
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

    return NextResponse.json(generativeAI);
  } catch (error) {
    console.error("Error updating generative AI:", error);
    return NextResponse.json(
      { error: "Error al actualizar el generative AI" },
      { status: 500 }
    );
  }
}

// DELETE /api/generative-ai/[id] - Eliminar un generative AI
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.generativeAI.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Generative AI eliminado correctamente",
    });
  } catch (error) {
    console.error("Error deleting generative AI:", error);
    return NextResponse.json(
      { error: "Error al eliminar el generative AI" },
      { status: 500 }
    );
  }
}
