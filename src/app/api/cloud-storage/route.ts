import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cloud-storage - Obtener todos los cloud storage
export async function GET() {
  try {
    const cloudStorage = await prisma.cloudStorage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cloudStorage);
  } catch (error) {
    console.error("Error fetching cloud storage:", error);
    return NextResponse.json(
      { error: "Error al obtener los cloud storage" },
      { status: 500 }
    );
  }
}

// POST /api/cloud-storage - Crear un nuevo cloud storage
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

    const cloudStorage = await prisma.cloudStorage.create({
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

    return NextResponse.json(cloudStorage, { status: 201 });
  } catch (error) {
    console.error("Error creating cloud storage:", error);
    return NextResponse.json(
      { error: "Error al crear el cloud storage" },
      { status: 500 }
    );
  }
}
