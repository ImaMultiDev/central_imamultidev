import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function signToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(
  token: string
): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7); // Remover "Bearer "
}

export async function getCurrentUser(token?: string | null) {
  // En desarrollo, crear o usar un usuario por defecto
  if (process.env.NODE_ENV === "development") {
    // Buscar o crear un usuario por defecto
    let user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      // Crear un usuario por defecto si no existe
      user = await prisma.user.create({
        data: {
          email: "dev@example.com",
          name: "Usuario Desarrollo",
          password: "password123", // En producción esto debería ser hasheado
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    return user;
  }

  // En producción, usar autenticación JWT
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // En producción, usar un ID fijo para el usuario autenticado
  // ya que no tenemos usuarios en la base de datos
  return {
    id: "admin-user",
    email: payload.email,
    name: "Administrador",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
