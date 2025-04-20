import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
const oauth = new OAuth({
  consumer: {
    key: process.env.TWITTER_API_KEY as string,
    secret: process.env.TWITTER_API_SECRET as string,
  },
  signature_method: "HMAC-SHA1",
  hash_function(base_string: string, key: string) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

export async function POST(req: Request) {
  const { tweetId } = await req.json();
  console.log("likes===============================");
  try {
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    // }

    // Get user's liked tweets using hardcoded userData
    const url = `https://api.twitter.com/2/tweets/${tweetId}/liking_users`;

    const request_data = {
      url,
      method: "GET",
    };

    const oauthHeaders = oauth.toHeader(
      oauth.authorize(request_data, {
        key: process.env.TWITTER_ACCESS_TOKEN as string,
        secret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
      })
    );

    const response = await fetch(url, {
      headers: {
        ...oauthHeaders,
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      throw new Error(`Twitter API request failed: ${response}`);
    }

    const data = await response.json();

    if (!data.data) {
      return NextResponse.json(
        { error: "Failed to fetch liking users" },
        { status: 500 }
      );
    }

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error fetching liking users:", error);
    return NextResponse.json(
      { error: "Failed to fetch liking users" },
      { status: 500 }
    );
  }
}
