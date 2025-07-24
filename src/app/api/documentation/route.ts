import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/documentation - Obtener toda la documentación del usuario
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const documentation = await prisma.documentation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documentation);
  } catch (error) {
    console.error("Error al obtener documentación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/documentation - Crear nueva documentación
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, url, type, category, tags } = body;

    if (!title || !url || !type || !category) {
      return NextResponse.json(
        { error: "Título, URL, tipo y categoría son requeridos" },
        { status: 400 }
      );
    }

    const documentation = await prisma.documentation.create({
      data: {
        title,
        description,
        url,
        type,
        category,
        tags: tags || [],
        userId: user.id,
      },
    });

    return NextResponse.json(documentation, { status: 201 });
  } catch (error) {
    console.error("Error al crear documentación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
