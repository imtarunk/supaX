import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { icon, task, points } = await request.json();
    // const user = await getCurrentUser();

    // if (!user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // if (user.name !== "Tarun k saini") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // Validate task type
    if (!task || !task[0] || !task[0].type || !task[0].content) {
      return NextResponse.json(
        { message: "Invalid task format" },
        { status: 400 }
      );
    }

    // Validate task type is one of the allowed types
    const allowedTypes = ["tweet", "follow", "like"];
    if (!allowedTypes.includes(task[0].type)) {
      return NextResponse.json(
        { message: "Invalid task type" },
        { status: 400 }
      );
    }

    await prisma.task.create({
      data: {
        icon,
        task: [
          {
            type: task[0].type,
            content: task[0].content,
          },
        ],
        points,
      },
    });

    return NextResponse.json({ message: "Task created successfully" });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
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
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
