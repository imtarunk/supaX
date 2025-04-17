import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      throw new Error("No code provided");
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

    const tokens = await tokenResponse.json();
    console.log("Tokens received:", tokens);

    // Get user info
    const userResponse = await fetch(`${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userInfo = await userResponse.json();
    console.log("User info received:", userInfo);

    // Calculate token expiration time
    const tokenExpires = new Date();
    tokenExpires.setSeconds(tokenExpires.getSeconds() + tokens.expires_in);

    // Save user and tokens to database
    const user = await prisma.user.upsert({
      where: {
        email: userInfo.email,
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

    console.log("User and tokens saved to database:", user);

    // Store tokens in secure cookies
    const response = NextResponse.redirect(
      new URL("/dashboard", process.env.APP_BASE_URL)
    );
    response.cookies.set("access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: tokenExpires,
    });
    response.cookies.set("id_token", tokens.id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: tokenExpires,
    });

    return response;
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=callback", process.env.APP_BASE_URL)
    );
  }
}
