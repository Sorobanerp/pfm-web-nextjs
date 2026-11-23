import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = new Set([
  "/login",
  "/register",
  "/verify",
  "/forgot-password",
  "/reset-password",
  "/admin/login",
]);

const CLIENT_PREFIXES = [
  "/dashboard",
  "/cards",
  "/import",
  "/inbox",
  "/nfce",
  "/contracts",
  "/family",
  "/profile",
  "/onboarding",
];

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("pfm_access_token")?.value ?? "";
  const tenantId = request.cookies.get("pfm_tenant_id")?.value ?? "";
  const role = request.cookies.get("pfm_user_role")?.value ?? "";

  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!token || role !== "PLATFORM_ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (matchesPrefix(pathname, CLIENT_PREFIXES)) {
    if (!token || !tenantId) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role === "PLATFORM_ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
