import { NextResponse } from "next/server";
import OAuth from "oauth-1.0a";
import crypto from "crypto";

const userData = {
  id: "1684871141956239361",
  name: "Tarun k saini",
  username: "imtarun_saini",
};
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

export async function GET() {
  try {
    const url = `https://api.twitter.com/2/users/${userData.id}/mentions`;
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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching mentions:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentions" },
      { status: 500 }
    );
  }
}
