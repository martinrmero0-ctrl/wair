import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_ROUTES = ["/swipe", "/wishlist", "/social", "/profile"];

export async function middleware(request: NextRequest) {
  const { response, session } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  if (!session && PROTECTED_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (session && pathname === "/auth") {
    return NextResponse.redirect(new URL("/swipe", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/swipe",
    "/wishlist",
    "/social",
    "/profile",
    "/auth",
  ],
};
