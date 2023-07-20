import { comparePasswords, generateToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, password }: { email: string; password: string } =
    await req.json();
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const passwordValid = await comparePasswords(password, user.password);

  if (!passwordValid) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = generateToken(user);
  cookies().set("token", token, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json({ user, token }, { status: 200 });
}
