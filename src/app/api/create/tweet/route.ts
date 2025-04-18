import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// if you're using Next.js 13+ App Router

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json();
  const { text, url, hashtags, via } = body;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const texthash = encodeURIComponent(text);
  const urlHash = encodeURIComponent(url);

  const tweetUrl = `https://twitter.com/intent/tweet?text=${texthash}&url=${urlHash}&hashtags=${hashtags}&via=${via}`;

  if (!tweetUrl) {
    return NextResponse.json({ error: "Invalid tweet URL" }, { status: 400 });
  }
  console.log(tweetUrl);
  return NextResponse.json({ TweetRedirectLink: tweetUrl }, { status: 200 });

  // window.open(tweetUrl, "_blank"); // opens in a new tab
  // or use: window.location.href = tweetUrl; to open in same tab
}
