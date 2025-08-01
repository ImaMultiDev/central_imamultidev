import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Disable ESLint for Prisma client access
/* eslint-disable @typescript-eslint/no-explicit-any */

// GET /api/subscriptions - Obtener todas las suscripciones
export async function GET() {
  try {
    const subscriptions = await (prisma as any).subscription.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Error al obtener las suscripciones" },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions - Crear una nueva suscripción
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      url,
      type,
      category,
      price,
      billingCycle,
      startDate,
      nextBillingDate,
      isActive,
      tags,
      userId,
    } = body;

    // Validaciones básicas
    if (
      !title ||
      !type ||
      !category ||
      price === undefined ||
      !billingCycle ||
      !startDate
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const subscription = await (prisma as any).subscription.create({
      data: {
        title,
        description,
        url,
        type,
        category,
        price: parseFloat(price),
        billingCycle,
        startDate: new Date(startDate),
        nextBillingDate: nextBillingDate ? new Date(nextBillingDate) : null,
        isActive: isActive !== undefined ? isActive : true,
        tags: tags || [],
        userId: userId || null,
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Error al crear la suscripción" },
      { status: 500 }
    );
  }
}
