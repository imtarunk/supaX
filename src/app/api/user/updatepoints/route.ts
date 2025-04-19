import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await request.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Create or update UserTask
    await prisma.userTask.upsert({
      where: {
        userId_taskId: {
          userId: user.id,
          taskId: taskId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        userId: user.id,
        taskId: taskId,
        completed: true,
      },
    });

    return NextResponse.json({ message: "Points updated successfully" });
  } catch (error) {
    console.error("Error updating points:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
