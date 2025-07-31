import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getTokenFromRequest } from "@/lib/auth";

// PUT /api/generative-ai/[id] - Actualizar un generative AI
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 PUT /api/generative-ai/[id] - Iniciando actualización");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Actualizando generative AI ID:", id);

    const body = await request.json();
    const { title, description, url, type, category, tags } = body;

    if (!title || !type || !category) {
      console.log("❌ Datos faltantes:", {
        title: !!title,
        type: !!type,
        category: !!category,
      });
      return NextResponse.json(
        { error: "Título, tipo y categoría son requeridos" },
        { status: 400 }
      );
    }

    // Verificar que el usuario sea propietario
    const whereClause = { id, userId: user.id };

    const generativeAI = await prisma.generativeAI.update({
      where: whereClause,
      data: {
        title,
        description,
        url,
        type,
        category,
        tags: tags || [],
      },
    });

    console.log("✅ Generative AI actualizado exitosamente:", generativeAI.id);
    return NextResponse.json(generativeAI);
  } catch (error) {
    console.error("❌ Error al actualizar generative AI:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
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
    console.log("🔍 DELETE /api/generative-ai/[id] - Iniciando eliminación");
    const token = getTokenFromRequest(request);
    const user = await getCurrentUser(token);

    if (!user) {
      console.log("❌ Usuario no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log("🔍 Eliminando generative AI ID:", id);

    // Verificar que el usuario sea propietario
    const whereClause = { id, userId: user.id };

    await prisma.generativeAI.delete({
      where: whereClause,
    });

    console.log("✅ Generative AI eliminado exitosamente:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error al eliminar generative AI:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
