import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/certifications/[id] - Actualizar certificación
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validación básica de campos requeridos
    if (!body.title || !body.type || !body.level || !body.startDate) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: title, type, level, startDate" },
        { status: 400 }
      );
    }

    const certification = await prisma.certification.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description || null,
        type: body.type,
        level: body.level,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        certificateUrl: body.certificateUrl || null,
        docsUrl: body.docsUrl || null,
        logoImage: body.logoImage || null,
        badgeImage: body.badgeImage || null,
        notes: body.notes || null,
        tags: body.tags || [],
      },
    });

    return NextResponse.json(certification);
  } catch (error) {
    console.error("Error updating certification:", error);
    return NextResponse.json(
      { error: "Error al actualizar la certificación" },
      { status: 500 }
    );
  }
}

// DELETE /api/certifications/[id] - Eliminar certificación
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.certification.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Certificación eliminada" });
  } catch (error) {
    console.error("Error deleting certification:", error);
    return NextResponse.json(
      { error: "Error al eliminar la certificación" },
      { status: 500 }
    );
  }
}
