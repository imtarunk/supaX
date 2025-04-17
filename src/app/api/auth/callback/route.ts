import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple rate limiting
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5;
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);

  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userRequests.count >= MAX_REQUESTS) {
    return false;
  }

  userRequests.count++;
  return true;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (!code) {
      throw new Error("No authorization code provided");
    }

    // Check rate limit
    if (!checkRateLimit(ip)) {
      throw new Error("Too many requests. Please try again later.");
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(
      `${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          code,
          redirect_uri: `${process.env.APP_BASE_URL}/api/auth/callback`,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error("Token exchange failed:", error);
      throw new Error(
        `Token exchange failed: ${error.error_description || error.error}`
      );
    }

    const tokens = await tokenResponse.json();
    console.log("Tokens received successfully");

    // Get user info
    const userResponse = await fetch(`${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const error = await userResponse.json();
      console.error("User info fetch failed:", error);
      throw new Error(
        `Failed to fetch user info: ${error.error_description || error.error}`
      );
    }

    const userInfo = await userResponse.json();
    console.log("User info received successfully");

    // Calculate token expiration time
    const tokenExpires = new Date();
    tokenExpires.setSeconds(tokenExpires.getSeconds() + tokens.expires_in);

    // Save user and tokens to database
    const user = await prisma.user.upsert({
      where: {
        twitterId: userInfo.sub,
      },
      update: {
        name: userInfo.name,
        email: userInfo.email,
        image: userInfo.picture,
        twitterId: userInfo.sub,
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
        refreshToken: tokens.refresh_token,
        tokenExpires: tokenExpires,
      },
      create: {
        name: userInfo.name,
        email: userInfo.email,
        image: userInfo.picture,
        twitterId: userInfo.sub,
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
        refreshToken: tokens.refresh_token,
        tokenExpires: tokenExpires,
      },
    });

    console.log("User and tokens saved to database successfully", user);

    // Store tokens in secure cookies
    const response = NextResponse.redirect(
      new URL("/dashboard", process.env.APP_BASE_URL)
    );

    // Set secure cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      expires: tokenExpires,
    };

    response.cookies.set("access_token", tokens.access_token, cookieOptions);
    response.cookies.set("id_token", tokens.id_token, cookieOptions);

    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.redirect(
      new URL(
        `/auth/login?error=${encodeURIComponent(
          error instanceof Error ? error.message : "Authentication failed"
        )}`,
        process.env.APP_BASE_URL
      )
    );
  }
}
