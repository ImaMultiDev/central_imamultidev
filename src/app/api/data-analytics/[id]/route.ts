import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/data-analytics/[id] - Actualizar un data analytics
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

    const dataAnalytics = await prisma.dataAnalytics.update({
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

    return NextResponse.json(dataAnalytics);
  } catch (error) {
    console.error("Error updating data analytics:", error);
    return NextResponse.json(
      { error: "Error al actualizar el data analytics" },
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
    const { id } = await params;

    await prisma.dataAnalytics.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Data analytics eliminado correctamente",
    });
  } catch (error) {
    console.error("Error deleting data analytics:", error);
    return NextResponse.json(
      { error: "Error al eliminar el data analytics" },
      { status: 500 }
    );
  }
}
