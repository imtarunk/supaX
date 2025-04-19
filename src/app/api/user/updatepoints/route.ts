import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { toast } from "sonner";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, points } = await request.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Find existing UserTask
    const existingUserTask = await prisma.userTask.findFirst({
      where: {
        userId: user.id,
        taskId: taskId,
      },
    });

    if (!existingUserTask) {
      toast("Task not found");
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Create or update UserTask
    await prisma.userTask.upsert({
      where: {
        id: existingUserTask?.id,
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

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        points: { increment: points },
      },
    });

    return NextResponse.json(
      { message: "Points updated successfully", points: user.points },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating points:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
