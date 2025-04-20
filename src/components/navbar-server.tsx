import { getCurrentUser } from "@/lib/auth";
import NavbarClient from "./navbar";

export default async function Navbar() {
  const user = await getCurrentUser();

  if (!user) {
    return <NavbarClient initialUser={null} />;
  }

  return (
    <NavbarClient
      initialUser={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        points: user.points,
      }}
    />
  );
}
