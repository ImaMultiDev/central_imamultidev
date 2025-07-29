import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// PATCH /api/tutorials/[id]/status - Cambiar estado de un tutorial
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log(
      "🔍 PATCH /api/tutorials/[id]/status - Iniciando cambio de estado"
    );
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Cambiando estado del tutorial ID:", id);

    const body = await request.json();
    const { status } = body;

    if (!status) {
      console.log("❌ Estado faltante");
      return NextResponse.json(
        { error: "Estado es requerido" },
        { status: 400 }
      );
    }

    // En desarrollo, verificar que el usuario sea propietario. En producción, no es necesario
    const whereClause =
      process.env.NODE_ENV === "development" ? { id, userId: user.id } : { id };

    const tutorial = await prisma.tutorial.update({
      where: whereClause,
      data: { status },
    });

    console.log(
      "✅ Estado del tutorial actualizado exitosamente:",
      tutorial.id
    );
    return NextResponse.json(tutorial);
  } catch (error) {
    console.error("❌ Error al cambiar estado del tutorial:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
