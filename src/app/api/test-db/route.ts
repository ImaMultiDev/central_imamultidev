import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("🔍 Test DB - Verificando conexión");

    // Verificar conexión básica
    await prisma.$connect();
    console.log("✅ Conexión a BD exitosa");

    // Verificar si las tablas existen
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("📋 Tablas encontradas:", tables);

    // Verificar tabla de cursos específicamente
    const courseCount = await prisma.course.count();
    console.log("📊 Número de cursos en BD:", courseCount);

    // Verificar tabla de usuarios
    const userCount = await prisma.user.count();
    console.log("👥 Número de usuarios en BD:", userCount);

    return NextResponse.json({
      success: true,
      message: "Conexión a BD exitosa",
      tables,
      courseCount,
      userCount,
      databaseUrl: process.env.DATABASE_URL ? "Configurado" : "No configurado",
    });
  } catch (error) {
    console.error("❌ Error en test DB:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        databaseUrl: process.env.DATABASE_URL
          ? "Configurado"
          : "No configurado",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
