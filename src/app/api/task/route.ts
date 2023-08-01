import { IUser, decodeToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getUserRouteHandler } from "../project/route";
import { Task } from "@prisma/client";

// given the project id, delete the project and all tasks associated with it
export async function POST(request: NextRequest) {
  const user = (await getUserRouteHandler("token")) as IUser;
  if (!user) {
    return NextResponse.redirect("/signin");
  }
  const {
    name,
    projectId,
    description,
    status,
  }: {
    name: string;
    description?: string;
    projectId: string;
    status: Task["status"];
  } = await request.json();

  const thing = await prisma.task.create({
    data: {
      name,
      description,
      projectId,
      ownerId: user.id,
      status,
    },
  });

  return NextResponse.json({ ...thing }, { status: 200 });
}
