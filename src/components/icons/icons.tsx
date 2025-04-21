import Image from "next/image";

export const XIcon = ({
  width = 100,
  height = 100,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <>
      <Image src="/x.png" alt="Twitter" width={width} height={height} />
    </>
  );
};

export const FollowIcon = ({
  width = 100,
  height = 100,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <>
      <Image src="/person.png" alt="Follow" width={width} height={height} />
    </>
  );
};

export const LikeIcon = ({
  width = 100,
  height = 100,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <>
      <Image src="/like.png" alt="Like" width={width} height={height} />
    </>
  );
};

export const DefaultIcon = ({
  width = 100,
  height = 100,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <>
      <Image src="/default.png" alt="Tweet" width={width} height={height} />
    </>
  );
};

export const LoginIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        id="sign-in"
        className="h-8 w-8 md:h-15 md:w-15  hover:scale-110 transition-all duration-300 cursor-pointer z-20"
      >
        <path
          fill="#6563ff"
          d="M21 12c0-.34-.02-.67-.05-1H12.5V9.5a1 1 0 0 0-1.707-.707l-2.5 2.5a1 1 0 0 0 0 1.414l2.5 2.5A1 1 0 0 0 12.5 14.5V13h8.45c.03-.33.05-.66.05-1Z"
        ></path>
        <path
          fill="#b2b1ff"
          d="M12.5 13v1.5a1 1 0 0 1-1.707.707l-2.5-2.5a1 1 0 0 1 0-1.414l2.5-2.5A1 1 0 0 1 12.5 9.5V11h8.45a10 10 0 1 0 0 2Z"
        ></path>
      </svg>
    </>
  );
};

import React, { useState, useEffect } from "react";

export default function AnimatedSupaXLogo() {
  const [sparkle, setSparkle] = useState(false);

  // Create a cycling animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkle(true);
      setTimeout(() => setSparkle(false), 1500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center">
      <span className="text-2xl md:text-3xl font-black tracking-tight relative">
        {/* The "supa" part with subtle hover animation */}
        <span className="text-2xl md:text-3xl relative inline-block">
          <span className="relative inline-block overflow-hidden">
            s
            <span className="absolute h-[2px] w-full bg-blue-500/50 -bottom-[1px] left-0 transform -translate-x-full animate-flow"></span>
          </span>
          <span className="relative inline-block overflow-hidden">
            u
            <span
              className="absolute h-[2px] w-full bg-blue-500/50 -bottom-[1px] left-0 transform -translate-x-full animate-flow"
              style={{ animationDelay: "0.2s" }}
            ></span>
          </span>
          <span className="relative inline-block overflow-hidden">
            p
            <span
              className="absolute h-[2px] w-full bg-blue-500/50 -bottom-[1px] left-0 transform -translate-x-full animate-flow"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </span>
          <span className="relative inline-block overflow-hidden">
            a
            <span
              className="absolute h-[2px] w-full bg-blue-500/50 -bottom-[1px] left-0 transform -translate-x-full animate-flow"
              style={{ animationDelay: "0.6s" }}
            ></span>
          </span>
        </span>

        {/* X letter with special styling and animations */}
        <span className="relative">
          <span
            className={`text-2xl md:text-3xl relative z-10 bg-gradient-to-br from-blue-600 to-purple-600 text-transparent bg-clip-text transition-all duration-300 ${
              sparkle ? "scale-110" : "scale-100"
            }`}
          >
            X
          </span>

          {/* Multiple animated elements around the X */}
          <span className="absolute -right-2 top-0 h-2 w-2 rounded-full bg-blue-500 opacity-80 animate-pulse"></span>

          {/* Orbiting dot */}
          <span
            className="absolute h-1.5 w-1.5 rounded-full bg-purple-400 opacity-70"
            style={{
              animation: "orbit 3s linear infinite",
              transform: "translateX(8px) translateY(8px)",
            }}
          ></span>

          {/* Sparkle effect that appears periodically */}
          {sparkle && (
            <>
              <span className="absolute -top-1 -right-1 h-1 w-1 rounded-full bg-white animate-ping"></span>
              <span
                className="absolute top-2 -right-2 h-1 w-1 rounded-full bg-white animate-ping"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="absolute -top-2 right-2 h-1 w-1 rounded-full bg-white animate-ping"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </>
          )}
        </span>
      </span>

      {/* Add a subtle style element */}
      <style jsx>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(8px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(8px) rotate(-360deg);
          }
        }

        @keyframes flow {
          0% {
            transform: translateX(-100%);
          }
          50%,
          100% {
            transform: translateX(100%);
          }
        }

        .animate-flow {
          animation: flow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
