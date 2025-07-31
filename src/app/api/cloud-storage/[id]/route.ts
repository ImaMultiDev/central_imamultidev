import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/cloud-storage/[id] - Actualizar un cloud storage
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

    const cloudStorage = await prisma.cloudStorage.update({
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

    return NextResponse.json(cloudStorage);
  } catch (error) {
    console.error("Error updating cloud storage:", error);
    return NextResponse.json(
      { error: "Error al actualizar el cloud storage" },
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
    const { id } = await params;

    await prisma.cloudStorage.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Cloud storage eliminado correctamente",
    });
  } catch (error) {
    console.error("Error deleting cloud storage:", error);
    return NextResponse.json(
      { error: "Error al eliminar el cloud storage" },
      { status: 500 }
    );
  }
}
