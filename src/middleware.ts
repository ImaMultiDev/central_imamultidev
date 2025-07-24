import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // En desarrollo, ser menos estricto con la autenticación
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const url = request.nextUrl.clone();

  // Si no hay autenticación, redirigir al login
  if (!authHeader) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Verificar credenciales básicas
  const expectedAuth = `Basic ${btoa(
    `${process.env.AUTH_USERNAME || "imamultidev"}:${
      process.env.AUTH_PASSWORD || "password123"
    }`
  )}`;

  if (authHeader !== expectedAuth) {
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
