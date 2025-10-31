import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const access = request.cookies.has("access");
  const cookie = request.cookies.get("access");

  let role: string | undefined = undefined;
  if (cookie) {
    try {
      role = JSON.parse(cookie.value).role;
    } catch (e) {
      console.error("Failed to parse role cookie:", e);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access");
      return response;
    }
  }

  if (access && role) {
    if (pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/campus") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (
      (pathname.startsWith("/judgment") ||
        pathname.startsWith("/topics") ||
        pathname.startsWith("/judge")) &&
      role !== "admin" &&
      role !== "judge"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (
      (pathname.startsWith("/results") ||
        pathname.startsWith("/announcement")) &&
      role !== "admin" &&
      role !== "announce"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (pathname.startsWith("/students") && role !== "campus") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (
      pathname.startsWith("/registration") &&
      role !== "admin" &&
      role !== "report"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (pathname.startsWith("/award") && role !== "admin" && role !== "award") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (pathname.startsWith("/programs") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/login") || pathname === "/unauthorized") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico|results|fonts|certificate).*)"],
};
