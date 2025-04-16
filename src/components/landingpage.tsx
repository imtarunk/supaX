"use client";

import { testimonials } from "@/lib/data";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { WobbleCard } from "./ui/wobble-card";
const recipientId = "1622174627924672513"; // Replace with actual Twitter user ID
const message = "Hey! I'm interested in your product 🙌";
const encodedMessage = encodeURIComponent(message);

const dmUrl = `https://twitter.com/messages/compose?recipient_id=${recipientId}&text=${encodedMessage}`;

const LandingPage = () => {
  return (
    <div className="landing-page bg-black min-h-screen text-white font-mono">
      <button
        onClick={() => window.open(dmUrl, "_blank")}
        className="pointe px-8 py-3 font-mono text-lg tracking-wider text-white uppercase bg-black border border-red-600 rounded hover:bg-red-900 hover:bg-opacity-20 transition-all duration-300 absolute right-4 top-4 z-10 "
        style={{
          boxShadow:
            "0 0 10px 1px rgba(239, 68, 68, 0.7), inset 0 0 5px rgba(239, 68, 68, 0.5)",
          textShadow: "0 0 3px rgba(255, 255, 255, 0.5)",
        }}
      >
        GET IN TOUCH
      </button>
      <ContainerScroll
        titleComponent={
          <div className="flex items-center justify-center flex-col text-center px-4">
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              SuperFi by{" "}
              <span className="text-yellow-400 font-bold">[LOGO]</span>{" "}
              Superstellar
            </h3>

            <h1 className="text-2xl md:text-3xl tracking-widest uppercase">
              <span className="font-extrabold">S</span>UPERCHARGE{" "}
              <span className="font-extrabold">Y</span>OUR{" "}
              <span className="font-extrabold">C</span>RYPTO{" "}
              <span className="font-extrabold">C</span>OMMUNITY
            </h1>

            <h1 className="text-4xl sm:text-6xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 font-stretch-b mt-6">
              EFFORTLESSLY
            </h1>
          </div>
        }
      />

      {/* Main Text Section */}
      <div className="max-w-5xl mx-auto px-6 mt-16 text-center">
        <p className="text-xl sm:text-2xl md:text-2xl tracking-wider leading-relaxed uppercase">
          <span className="font-bold">S</span>UPERFI helps{" "}
          <span className="font-bold">N</span>FT projects, meme coins, and new
          token ventures effortlessly achieve{" "}
          <span className="text-cyan-400 font-semibold">organic Twitter</span>{" "}
          engagement and streamline fair airdrop distributions. With features
          like automated engagement tracking, custom quests,{" "}
          <span className="text-cyan-400 font-semibold">and a gamified</span>{" "}
          ranking system, <span className="font-bold">S</span>UPERFI boosts
          community interaction and drives genuine traction—all without you
          handling the details.
        </p>
      </div>

      {/* Why Choose Section */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-2xl md:text-3xl tracking-widest uppercase">
          WHY <span className="font-normal">CHOOSE</span>{" "}
          <span className="font-bold">SUPERFI?</span>
        </h2>

        <p className="mt-6 text-sm sm:text-base md:text-lg max-w-3xl mx-auto tracking-wider leading-relaxed uppercase">
          Let our dedicated team handle everything from hosting and setup to
          creating custom quests, while you enjoy consistent, meaningful
          engagement that elevates your community.
        </p>
      </section>

      {/* Wobble Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-16 max-w-7xl mx-auto">
        <WobbleCard containerClassName="bg-gradient-to-b from-neutral-900 to-black text-left col-span-2">
          <h3 className="text-2xl font-mono font-semibold tracking-widest">
            <span className="text-white">A</span>UTOMATED{" "}
            <span className="text-white">E</span>NGAGEMENT{" "}
            <span className="text-white">T</span>RACKING
          </h3>
          <p className="mt-2 text-sm text-white/80 font-mono max-w-md">
            Automatically tracks Twitter interactions based on target keywords.
          </p>
        </WobbleCard>

        <WobbleCard containerClassName="bg-yellow-500 text-black text-left">
          <h3 className="text-2xl font-mono font-semibold tracking-widest">
            <span className="text-white">S</span>EAMLESS{" "}
            <span className="text-white">I</span>NTEGRATION
          </h3>
          <p className="mt-2 text-sm font-mono">
            We handle everything from hosting to setup—you have to manage
            anything.
          </p>
        </WobbleCard>

        <WobbleCard containerClassName="bg-green-700 text-left col-span-2">
          <h3 className="text-2xl font-mono font-semibold tracking-widest">
            <span className="text-white">Q</span>UESTING{" "}
            <span className="text-white">B</span>EYOND LIMITS
          </h3>
          <p className="mt-2 text-sm text-white/80 font-mono max-w-md">
            Keep your community actively engaged with a vast array of custom
            quests.
          </p>
        </WobbleCard>

        <WobbleCard containerClassName="bg-indigo-900 text-left">
          <h3 className="text-2xl font-mono font-semibold tracking-widest">
            <span className="text-white">R</span>ANKING SYSTEM
          </h3>
          <p className="mt-2 text-sm text-white/80 font-mono">
            Our ranking system gamifies user interaction by showing users where
            they stand based on points earned.
          </p>
        </WobbleCard>

        <WobbleCard containerClassName="bg-red-900 text-left">
          <h3 className="text-2xl font-mono font-semibold tracking-widest">
            <span className="text-white">S</span>TREAK SYSTEM
          </h3>
          <p className="mt-2 text-sm text-white/80 font-mono">
            Encourage long-term engagement by incentivizing users to return
            daily.
          </p>
        </WobbleCard>
      </section>
      <section>
        <InfiniteMovingCards
          items={testimonials}
          direction="left"
          speed="normal"
          pauseOnHover={true}
        />
      </section>
      <section className="py-24 px-6 text-center">
        <h2 className="text-2xl md:text-3xl tracking-widest uppercase">
          Ready to Supercharge Your Community?
        </h2>

        <p className="mt-6 text-xs sm:text-base md:text-lg max-w-3xl mx-auto tracking-wider leading-relaxed uppercase">
          Let our dedicated team handle everything from hosting and setup to
          creating custom quests, while you enjoy consistent, meaningful
          engagement that elevates your community.
        </p>
        <div className="h-6"></div>
        <button
          onClick={() => window.open(dmUrl, "_blank")}
          className="relative px-8 py-3 font-mono text-lg tracking-wider text-white uppercase bg-black border border-red-600 rounded hover:bg-red-900 hover:bg-opacity-20 transition-all duration-300"
          style={{
            boxShadow:
              "0 0 10px 1px rgba(239, 68, 68, 0.7), inset 0 0 5px rgba(239, 68, 68, 0.5)",
            textShadow: "0 0 3px rgba(255, 255, 255, 0.5)",
          }}
        >
          GET IN TOUCH
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
