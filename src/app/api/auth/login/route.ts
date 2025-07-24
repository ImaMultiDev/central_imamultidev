import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Verificar credenciales contra variables de entorno del servidor
    const expectedUsername = process.env.AUTH_USERNAME;
    const expectedPassword = process.env.AUTH_PASSWORD;

    if (!expectedUsername || !expectedPassword) {
      return NextResponse.json(
        { error: "Configuración de autenticación incompleta" },
        { status: 500 }
      );
    }

    if (username === expectedUsername && password === expectedPassword) {
      // Generar token JWT
      const token = signToken({
        userId: "admin",
        email: username,
      });

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: "admin",
          email: username,
          name: "Administrador",
        },
      });
    } else {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
