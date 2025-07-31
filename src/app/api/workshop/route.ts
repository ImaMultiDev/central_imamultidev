import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/workshop - Obtener todos los workshop
export async function GET() {
  try {
    const workshop = await prisma.workshop.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(workshop);
  } catch (error) {
    console.error("Error fetching workshop:", error);
    return NextResponse.json(
      { error: "Error al obtener los workshop" },
      { status: 500 }
    );
  }
}

// POST /api/workshop - Crear un nuevo workshop
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

    const workshop = await prisma.workshop.create({
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

    return NextResponse.json(workshop, { status: 201 });
  } catch (error) {
    console.error("Error creating workshop:", error);
    return NextResponse.json(
      { error: "Error al crear el workshop" },
      { status: 500 }
    );
  }
}
