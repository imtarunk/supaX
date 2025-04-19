import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, points } = await request.json();
    console.log("Received taskId:", taskId);
    console.log("Received points:", points);
    console.log("User ID:", user.id);

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

    console.log("Existing UserTask:", existingUserTask);

    if (!existingUserTask) {
      // Check if the task exists in the Task table
      const taskExists = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

      console.log("Task exists:", taskExists);

      if (!taskExists) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      // Create a new UserTask if the task exists but no UserTask exists
      const newUserTask = await prisma.userTask.create({
        data: {
          userId: user.id,
          taskId: taskId,
          completed: true,
        },
      });

      console.log("Created new UserTask:", newUserTask);

      // Update user points
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
    }

    // Update existing UserTask
    await prisma.userTask.update({
      where: {
        id: existingUserTask.id,
      },
      data: {
        completed: true,
      },
    });

    // Update user points
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
