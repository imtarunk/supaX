import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { points } = await req.json();

    // Update user's points
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        points: points,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating points:", error);
    return NextResponse.json(
      { error: "Failed to update points" },
      { status: 500 }
    );
  }
}
