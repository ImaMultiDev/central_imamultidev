import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  // En desarrollo, ser menos estricto con la autenticación
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const url = request.nextUrl.clone();

  // Si no hay autenticación, redirigir al login
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Extraer y verificar el token JWT
  const token = authHeader.substring(7); // Remover "Bearer "
  const payload = verifyToken(token);

  if (!payload) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
