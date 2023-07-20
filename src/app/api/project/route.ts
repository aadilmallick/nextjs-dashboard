import { IUser, decodeToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = (await getUserRouteHandler("token")) as IUser;
  const { name }: { name: string } = await request.json();
  await prisma.project.create({
    data: {
      name,
      ownerId: user.id,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function getUserRouteHandler(cookieName: string = "token") {
  const jwt = cookies().get(cookieName);
  if (!jwt) {
    return NextResponse.redirect("/signin");
  }
  const user = await decodeToken(jwt.value);
  return user as IUser;
}
