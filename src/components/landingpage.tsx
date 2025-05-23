"use client";

import { testimonials } from "@/lib/data";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { WobbleCard } from "./ui/wobble-card";
import { cn } from "@/lib/utils";
import { LoginIcon } from "./icons/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const recipientId = "1396073250019500032";
const message = `Hey fren! 👋
Welcome to Supax v1 devlopment version — your new web3 social playground 🌐💬
Complete simple tasks, engage with the community, and earn SOL along the way! 🚀
We're just getting started, and you're early. Let's build together. 🛠️

`;
const encodedMessage = encodeURIComponent(message);
const dmUrl = `https://twitter.com/messages/compose?recipient_id=${recipientId}&text=${encodedMessage}`;

const ContactButton = ({
  className = "",
  size = "lg",
}: {
  className?: string;
  size?: "sm" | "lg";
}) => {
  const sizeStyles =
    size === "sm"
      ? "px-4 py-2 text-sm md:text-lg"
      : "px-8 py-4 text-lg md:text-xl";

  return (
    <button
      onClick={() => window.open(dmUrl, "_blank")}
      className={cn(
        sizeStyles,
        "tracking-wider text-white uppercase bg-black border border-red-600 rounded-lg hover:bg-red-900  transition-all duration-300 z-20 cursor-pointer hover:scale-105 hover:text-white",
        className
      )}
      style={{
        boxShadow:
          "0 0 15px 2px rgba(239, 68, 68, 0.7), inset 0 0 8px rgba(239, 68, 68, 0.5)",
        textShadow: "0 0 3px rgba(255, 255, 255, 0.5)",
      }}
    >
      GET IN TOUCH
    </button>
  );
};

const LandingPage: React.FC = (): JSX.Element => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative bg-black min-h-screen text-white font-mono overflow-hidden">
      {/* Sparkling background layer - you can add this back if you had one */}

      {/* Foreground content */}
      <div className="relative z-10">
        {/* Floating Contact Button */}
        <div
          className="fixed top-4 left-4 z-20 md:absolute md:top-4 md:left-4 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          <LoginIcon />
        </div>

        <div className="fixed top-4 right-4 z-20 md:absolute md:top-4 md:right-4">
          <ContactButton size="sm" />
        </div>

        {/* Hero Section */}
        <div className="w-full">
          <ContainerScroll
            titleComponent={
              <div className="flex items-center justify-center flex-col text-center px-4 sm:px-6 py-12 sm:py-16 md:py-24">
                <h3 className="text-sm sm:text-base md:text-xl font-semibold mb-3 sm:mb-4 md:mb-6">
                  SuperFi by{" "}
                  <span className="text-yellow-400 font-bold">
                    supaX.codextarun.xyz
                  </span>{" "}
                  Superstellar
                </h3>

                <h1 className="text-lg sm:text-xl md:text-3xl tracking-wide sm:tracking-wider uppercase leading-snug sm:leading-relaxed md:leading-loose">
                  <span className="font-extrabold">S</span>UPERCHARGE{" "}
                  <span className="font-extrabold">Y</span>OUR{" "}
                  <span className="font-extrabold">C</span>RYPTO{" "}
                  <span className="font-extrabold">C</span>OMMUNITY
                </h1>

                <h1 className="text-2xl sm:text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 font-bold mt-4 sm:mt-6 md:mt-8">
                  EFFORTLESSLY
                </h1>
              </div>
            }
          />
        </div>

        {/* Description Section */}
        <div className="max-w-5xl mx-auto px-6 md:px-6 py-12 md:py-16 text-center">
          <p className="text-lg sm:text-xl md:text-2xl tracking-wide leading-relaxed uppercase">
            <span className="font-bold">S</span>UPERFI helps{" "}
            <span className="font-bold">N</span>FT projects, meme coins, and new
            token ventures effortlessly achieve{" "}
            <span className="text-cyan-400 font-semibold">organic Twitter</span>{" "}
            engagement and streamline fair airdrop distributions.
            <br className="hidden md:block" />
            <span className="block mt-4">
              With features like automated engagement tracking, custom quests,{" "}
              <span className="text-cyan-400 font-semibold">
                and a gamified
              </span>{" "}
              ranking system, <span className="font-bold">S</span>UPERFI boosts
              community interaction and drives genuine traction—all without you
              handling the details.
            </span>
          </p>
        </div>

        {/* Why Choose Section */}
        <section className="py-16 md:py-24 px-6 md:px-6 text-center bg-black/50">
          <h2 className="text-xl md:text-3xl tracking-widest uppercase mb-8">
            WHY <span className="font-normal">CHOOSE</span>{" "}
            <span className="font-bold">SUPERFI?</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg max-w-3xl mx-auto tracking-wide leading-relaxed uppercase">
            Let our dedicated team handle everything from hosting and setup to
            creating custom quests, while you enjoy consistent, meaningful
            engagement that elevates your community.
          </p>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 md:p-6 max-w-7xl mx-auto">
          <WobbleCard containerClassName="bg-gradient-to-br from-neutral-900 to-black text-left col-span-1 md:col-span-2 p-6 rounded-xl">
            <h3 className="text-xl md:text-2xl font-semibold tracking-widest">
              AUTOMATED ENGAGEMENT TRACKING
            </h3>
            <p className="mt-3 text-sm md:text-base text-white/80 max-w-md">
              Automatically tracks Twitter interactions based on target
              keywords.
            </p>
          </WobbleCard>

          <WobbleCard containerClassName="bg-gradient-to-br from-yellow-500 to-yellow-600 text-black text-left p-6 rounded-xl">
            <h3 className="text-xl md:text-2xl font-semibold tracking-widest">
              SEAMLESS INTEGRATION
            </h3>
            <p className="mt-3 text-sm md:text-base">
              We handle everything from hosting to setup—you just focus on your
              community.
            </p>
          </WobbleCard>

          <WobbleCard containerClassName="bg-gradient-to-br from-green-700 to-green-800 text-left col-span-1 md:col-span-2 p-6 rounded-xl">
            <h3 className="text-xl md:text-2xl font-semibold tracking-widest">
              QUESTING BEYOND LIMITS
            </h3>
            <p className="mt-3 text-sm md:text-base text-white/80 max-w-md">
              Keep your community actively engaged with a vast array of custom
              quests.
            </p>
          </WobbleCard>

          <WobbleCard containerClassName="bg-gradient-to-br from-indigo-900 to-indigo-950 text-left p-6 rounded-xl">
            <h3 className="text-xl md:text-2xl font-semibold tracking-widest">
              RANKING SYSTEM
            </h3>
            <p className="mt-3 text-sm md:text-base text-white/80">
              Our ranking system gamifies user interaction by showing users
              where they stand based on points earned.
            </p>
          </WobbleCard>

          <WobbleCard containerClassName="bg-gradient-to-br from-red-900 to-red-950 text-left p-6 rounded-xl">
            <h3 className="text-xl md:text-2xl font-semibold tracking-widest">
              STREAK SYSTEM
            </h3>
            <p className="mt-3 text-sm md:text-base text-white/80">
              Encourage long-term engagement by incentivizing users to return
              daily.
            </p>
          </WobbleCard>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24">
          <InfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="normal"
            pauseOnHover={true}
          />
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-24 px-6 md:px-6 text-center bg-black/50">
          <h2 className="text-xl md:text-3xl tracking-widest uppercase mb-8">
            Ready to Supercharge Your Community?
          </h2>

          <p className="mt-6 text-sm sm:text-base md:text-lg max-w-3xl mx-auto tracking-wide leading-relaxed uppercase">
            Let our dedicated team handle everything from hosting and setup to
            creating custom quests, while you enjoy consistent, meaningful
            engagement that elevates your community.
          </p>

          <div className="mt-12">
            <ContactButton size="lg" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
