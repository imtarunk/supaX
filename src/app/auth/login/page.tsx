import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const loginUrl = await auth0.login();
  redirect(loginUrl);
}
