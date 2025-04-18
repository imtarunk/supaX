import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { icon, task, points } = await request.json();
  const user = await getCurrentUser();

  console.log(icon, task, points);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (user.name !== "Tarun k saini") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await prisma.task.create({
    data: {
      icon,
      task,
      points,
    },
  });

  return NextResponse.json({ message: "Task created successfully" });
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userTask = await prisma.userTask.findMany({
    where: {
      userId: user.id,
    },
    include: {
      task: true,
    },
  });
  return NextResponse.json(userTask);
}
