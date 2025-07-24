import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tools - Obtener todas las herramientas
export async function GET() {
  try {
    const tools = await prisma.tool.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tools);
  } catch (error) {
    console.error("Error fetching tools:", error);
    return NextResponse.json(
      { error: "Error al obtener las herramientas" },
      { status: 500 }
    );
  }
}

// POST /api/tools - Crear una nueva herramienta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, url, type, category, tags, userId } = body;

    // Validaciones básicas
    if (!title || !url || !type || !category) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const tool = await prisma.tool.create({
      data: {
        title,
        description,
        url,
        type,
        category,
        tags: tags || [],
        userId: userId || null,
      },
    });

    return NextResponse.json(tool, { status: 201 });
  } catch (error) {
    console.error("Error creating tool:", error);
    return NextResponse.json(
      { error: "Error al crear la herramienta" },
      { status: 500 }
    );
  }
}
