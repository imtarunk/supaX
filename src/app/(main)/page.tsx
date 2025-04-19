import LandingPage from "@/components/landingpage";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <>
      <LandingPage />
      <Toaster position="top-center" richColors expand={true} />
    </>
  );
}
