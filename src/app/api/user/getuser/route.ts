import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function GET() {
  try {
    // First check the session
    const session = await getServerSession(authOptions);
    console.log("API Session:", session);

    if (!session?.user?.id) {
      console.log("API: No session or user ID found");
      return NextResponse.json(
        { error: "Unauthorized - No session found" },
        { status: 401 }
      );
    }

    // Then get the current user
    const user = await getCurrentUser();
    console.log("API User:", user);

    if (!user) {
      console.log("API: No user found");
      return NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      );
    }

    // Fetch user data from the database
    const userData = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        twitterId: true,
        points: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error in getuser route:", error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes("prisma")) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
