import { IRegisterBody } from "@/lib/api";
import { IUser, comparePasswords, generateToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, password, firstName, lastName }: IRegisterBody =
    await req.json();

  const ifUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (ifUserExists)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const user = await prisma.user.create({
    data: {
      email,
      password,
      lastName,
      firstName,
    },
  });

  const token = generateToken(user);

  //   response.cookies.set("token", token);
  cookies().set("token", token, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return NextResponse.json(
    { user, token },
    {
      status: 200,
    }
  );
}
