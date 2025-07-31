import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/data-analytics - Obtener todos los data analytics
export async function GET() {
  try {
    const dataAnalytics = await prisma.dataAnalytics.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(dataAnalytics);
  } catch (error) {
    console.error("Error fetching data analytics:", error);
    return NextResponse.json(
      { error: "Error al obtener los data analytics" },
      { status: 500 }
    );
  }
}

// POST /api/data-analytics - Crear un nuevo data analytics
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

    const dataAnalytics = await prisma.dataAnalytics.create({
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

    return NextResponse.json(dataAnalytics, { status: 201 });
  } catch (error) {
    console.error("Error creating data analytics:", error);
    return NextResponse.json(
      { error: "Error al crear el data analytics" },
      { status: 500 }
    );
  }
}
