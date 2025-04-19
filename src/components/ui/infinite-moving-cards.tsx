"use client";

import React, { useEffect, useRef, useState } from "react";

interface InfiniteMovingCardsProps {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const scrollerRef = containerRef.current.querySelector(
        "[data-scroller]"
      ) as HTMLElement;
      const scrollerInnerRef = containerRef.current.querySelector(
        "[data-scroller-inner]"
      ) as HTMLElement;

      if (!scrollerRef || !scrollerInnerRef) return;

      const getDirection = () => {
        if (containerRef.current) {
          if (direction === "left") {
            containerRef.current.style.setProperty(
              "--animation-direction",
              "forwards"
            );
          } else {
            containerRef.current.style.setProperty(
              "--animation-direction",
              "reverse"
            );
          }
        }
      };

      const getSpeed = () => {
        if (containerRef.current) {
          if (speed === "fast") {
            containerRef.current.style.setProperty(
              "--animation-duration",
              "30s"
            );
          } else if (speed === "normal") {
            containerRef.current.style.setProperty(
              "--animation-duration",
              "60s"
            );
          } else {
            containerRef.current.style.setProperty(
              "--animation-duration",
              "90s"
            );
          }
        }
      };

      // Create a wrapper for the content
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.gap = "1rem";
      wrapper.style.width = "max-content";
      wrapper.style.flexWrap = "nowrap";

      // Add original items
      items.forEach((item) => {
        const li = document.createElement("li");
        li.className =
          "w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px]";
        li.innerHTML = `
          <blockquote>
            <div aria-hidden="true" class="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"></div>
            <span class="relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">${item.quote}</span>
            <div class="relative z-20 mt-6 flex flex-row items-center">
              <span class="flex flex-col gap-1">
                <span class="text-sm leading-[1.6] text-gray-400 font-normal">${item.name}</span>
                <span class="text-sm leading-[1.6] text-gray-400 font-normal">${item.title}</span>
              </span>
            </div>
          </blockquote>
        `;
        wrapper.appendChild(li);
      });

      // Duplicate the content for seamless scrolling
      const duplicateWrapper = wrapper.cloneNode(true) as HTMLElement;
      wrapper.appendChild(duplicateWrapper);

      // Clear and add new content
      scrollerRef.innerHTML = "";
      scrollerRef.appendChild(wrapper);

      getDirection();
      getSpeed();
      setStart(true);
    }
  }, [direction, speed, items]);

  return (
    <div
      ref={containerRef}
      className={`scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] ${className}`}
    >
      <ul
        ref={scrollerRef}
        data-scroller
        className={`flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap ${
          start ? "animate-scroll" : ""
        } ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
      >
        {items.map((item, idx) => (
          <li
            data-scroller-inner
            className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px]"
            key={idx}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] text-gray-400 font-normal">
                    {item.name}
                  </span>
                  <span className="text-sm leading-[1.6] text-gray-400 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
