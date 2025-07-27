import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, url, type, category, tags } = body;

    const workshop = await prisma.workshop.update({
      where: { id, userId: user.id },
      data: {
        title,
        description,
        url,
        type,
        category,
        tags,
      },
    });

    return NextResponse.json(workshop);
  } catch (error) {
    console.error("Error updating workshop:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await prisma.workshop.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
