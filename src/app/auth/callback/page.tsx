import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function CallbackPage() {
  try {
    await auth0.handleCallback();
    return redirect("/dashboard");
  } catch (error) {
    console.error("Auth callback error:", error);
    return redirect("/auth/login?error=callback");
  }
}
