import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/" ||
    pathname === "/create-challenge" ||
    pathname === "/profile"
  ) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname === "/login" || pathname === "/register") {
    const token = request.cookies.get("token")?.value;

    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
};
