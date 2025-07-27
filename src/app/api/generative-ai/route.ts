import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const generativeAI = await prisma.generativeAI.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(generativeAI);
  } catch (error) {
    console.error("Error fetching generative AI:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, url, type, category, tags } = body;

    const generativeAI = await prisma.generativeAI.create({
      data: {
        title,
        description,
        url,
        type,
        category,
        tags,
        userId: user.id,
      },
    });

    return NextResponse.json(generativeAI);
  } catch (error) {
    console.error("Error creating generative AI:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
