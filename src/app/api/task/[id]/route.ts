import { IUser, decodeToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Task } from "@prisma/client";
import { getUserRouteHandler } from "../../project/route";

export async function PATCH(request: NextRequest) {
  const user = (await getUserRouteHandler("token")) as IUser;
  if (!user) {
    return NextResponse.redirect("/signin");
  }
  const {
    name,
    id,
    description,
    status,
  }: {
    name?: string;
    description?: string;
    id: string;
    status?: Task["status"];
  } = await request.json();

  const toUpdateObj = {} as any;
  name && (toUpdateObj.name = name);
  description && (toUpdateObj.description = description);
  status && (toUpdateObj.status = status);

  await prisma.task.update({
    where: {
      id,
    },
    data: {
      ...toUpdateObj,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const user = (await getUserRouteHandler("token")) as IUser;
  if (!user) {
    return NextResponse.redirect("/signin");
  }
  const {
    id,
  }: {
    id: string;
  } = await request.json();

  await prisma.task.delete({
    where: {
      id: id,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
