import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/certifications - Obtener todas las certificaciones
export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: "Error al obtener las certificaciones" },
      { status: 500 }
    );
  }
}

// POST /api/certifications - Crear nueva certificación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validación básica de campos requeridos
    if (!body.title || !body.type || !body.level || !body.startDate) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: title, type, level, startDate" },
        { status: 400 }
      );
    }

    const certification = await prisma.certification.create({
      data: {
        title: body.title,
        description: body.description || null,
        type: body.type,
        level: body.level,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        certificateUrl: body.certificateUrl || null,
        docsUrl: body.docsUrl || null,
        logoImage: body.logoImage || null,
        badgeImage: body.badgeImage || null,
        notes: body.notes || null,
        tags: body.tags || [],
        userId: body.userId || null,
      },
    });

    return NextResponse.json(certification, { status: 201 });
  } catch (error) {
    console.error("Error creating certification:", error);
    return NextResponse.json(
      { error: "Error al crear la certificación" },
      { status: 500 }
    );
  }
}
