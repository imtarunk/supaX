import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { points } = body;

    console.log("Received Points:", points);

    if (!points || typeof points !== "number") {
      return NextResponse.json(
        { error: "Invalid or missing points" },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        points: { decrement: points },
      },
    });

    return NextResponse.json(
      { message: "Points updated", points: updatedUser.points },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in points API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
