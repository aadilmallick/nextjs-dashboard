import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  // later save this to an env in production
  const jwt = request.cookies.get("token");
  console.log("jwt", jwt);
  if (!jwt) {
    request.nextUrl.pathname = "/signin";
    return NextResponse.redirect(request.nextUrl.href);
  }

  if (request.nextUrl.pathname === "/") {
    request.nextUrl.pathname = "/home";
    return NextResponse.redirect(request.nextUrl.href);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/project/:path*", "/", "/profile", "/settings"],
};
