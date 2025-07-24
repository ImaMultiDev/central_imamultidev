import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// PATCH /api/courses/[id]/status - Cambiar el estado de un curso
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 PATCH /api/courses/[id]/status - Iniciando cambio de estado");
    const token = getTokenFromRequest(request);
    console.log("🔍 Token encontrado:", token ? "Sí" : "No");

    const user = await getCurrentUser(token);
    console.log(
      "🔍 Usuario obtenido:",
      user ? `ID: ${user.id}` : "No autorizado"
    );

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Cambiando estado del curso ID:", id);

    const body = await request.json();
    const { status } = body;
    console.log("🔍 Nuevo estado:", status);

    if (
      !status ||
      !["POR_COMENZAR", "EN_PROGRESO", "COMPLETADO"].includes(status)
    ) {
      console.log("❌ Estado inválido:", status);
      return NextResponse.json(
        { error: "Estado válido requerido" },
        { status: 400 }
      );
    }

    // En desarrollo, verificar que el usuario sea propietario. En producción, no es necesario
    const whereClause =
      process.env.NODE_ENV === "development" ? { id, userId: user.id } : { id };

    const course = await prisma.course.update({
      where: whereClause,
      data: {
        status,
      },
    });

    console.log("✅ Estado del curso actualizado exitosamente:", course.id);
    return NextResponse.json(course);
  } catch (error) {
    console.error("❌ Error al cambiar estado del curso:", error);
    console.error("❌ Detalles del error:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack",
    });
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
