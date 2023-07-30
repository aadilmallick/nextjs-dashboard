import { IUser, decodeToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getUserRouteHandler } from "../route";

// given the project id, delete the project and all tasks associated with it
export async function DELETE(request: NextRequest) {
  const user = (await getUserRouteHandler("token")) as IUser;
  if (!user) {
    return NextResponse.redirect("/signin");
  }
  const { id }: { id: string } = await request.json();
  await prisma.project.delete({
    where: {
      id: id,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const user = (await getUserRouteHandler("token")) as IUser;
  if (!user) {
    return NextResponse.redirect("/signin");
  }
  const { id, name, due }: { name: string; due?: string; id: string } =
    await request.json();

  await prisma.project.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      due: due,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
