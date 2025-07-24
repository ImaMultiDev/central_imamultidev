import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// PATCH /api/courses/[id]/status - Cambiar el estado de un curso
export async function PATCH(
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
    const { status } = body;

    if (
      !status ||
      !["POR_COMENZAR", "EN_PROGRESO", "COMPLETADO"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Estado válido requerido" },
        { status: 400 }
      );
    }

    const course = await prisma.course.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error al cambiar estado del curso:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
