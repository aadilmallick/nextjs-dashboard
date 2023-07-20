import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  cookies().delete("token");
  request.nextUrl.pathname = "/signin";
  return NextResponse.redirect(request.nextUrl.href);
}
