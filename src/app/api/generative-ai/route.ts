import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/generative-ai - Obtener todos los generative AI
export async function GET() {
  try {
    const generativeAI = await prisma.generativeAI.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(generativeAI);
  } catch (error) {
    console.error("Error fetching generative AI:", error);
    return NextResponse.json(
      { error: "Error al obtener los generative AI" },
      { status: 500 }
    );
  }
}

// POST /api/generative-ai - Crear un nuevo generative AI
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

    const generativeAI = await prisma.generativeAI.create({
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

    return NextResponse.json(generativeAI, { status: 201 });
  } catch (error) {
    console.error("Error creating generative AI:", error);
    return NextResponse.json(
      { error: "Error al crear el generative AI" },
      { status: 500 }
    );
  }
}
