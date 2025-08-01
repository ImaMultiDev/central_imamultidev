import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Disable ESLint for Prisma client access
/* eslint-disable @typescript-eslint/no-explicit-any */

// PUT /api/subscriptions/[id] - Actualizar una suscripción
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const subscription = await (prisma as any).subscription.update({
      where: { id },
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
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Error al actualizar la suscripción" },
      { status: 500 }
    );
  }
}

// DELETE /api/subscriptions/[id] - Eliminar una suscripción
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await (prisma as any).subscription.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Suscripción eliminada correctamente",
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { error: "Error al eliminar la suscripción" },
      { status: 500 }
    );
  }
}
