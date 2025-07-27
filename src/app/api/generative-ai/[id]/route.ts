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

    const generativeAI = await prisma.generativeAI.update({
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

    return NextResponse.json(generativeAI);
  } catch (error) {
    console.error("Error updating generative AI:", error);
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

    await prisma.generativeAI.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting generative AI:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
