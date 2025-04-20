import LandingPage from "@/components/landingpage";
import { Toaster } from "sonner";

export default function Home(): JSX.Element {
  return (
    <main>
      <LandingPage />
      <Toaster position="top-center" richColors expand={true} />
    </main>
  );
}
