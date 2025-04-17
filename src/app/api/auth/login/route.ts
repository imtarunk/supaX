import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const loginUrl = await auth0.login();
    return NextResponse.redirect(new URL(loginUrl));
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=login", process.env.APP_BASE_URL)
    );
  }
}
