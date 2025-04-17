import type { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth0.getSession();
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");

  // If user is not authenticated and trying to access protected routes
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If user is authenticated and trying to access auth routes
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
