import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("like");
  const body = await request.json();
  const tweetId = body.tweetId;

  if (!tweetId) {
    return NextResponse.json(
      { error: "Tweet ID is required" },
      { status: 400 }
    );
  }
  console.log("This is from server =====", tweetId);

  const link = `https://twitter.com/i/web/status/${tweetId}`;

  if (!link) {
    return NextResponse.json(
      { error: "Tweet ID is required" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Tweet liked successfully", RedirectLink: link },
    { status: 200 }
  );
}
