"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Sparkle {
  id: number;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  moveX: number;
  moveY: number;
}

export default function SparklingBackground() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const generateSparkles = (count: number) => {
      const newSparkles: Sparkle[] = [];
      for (let i = 0; i < count; i++) {
        newSparkles.push({
          id: Math.random(),
          size: Math.random() * 3 + 1,
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          delay: Math.random() * 2,
          duration: Math.random() * 3 + 2,
          moveX: (Math.random() - 0.5) * 2,
          moveY: (Math.random() - 0.5) * 2,
        });
      }
      setSparkles((current) => [...current, ...newSparkles]);
    };

    generateSparkles(50);
    const interval = setInterval(() => generateSparkles(10), 1000);

    return () => clearInterval(interval);
  }, [dimensions]);

  useEffect(() => {
    if (sparkles.length === 0) return;

    const timeout = setTimeout(() => {
      setSparkles((s) => s.slice(Math.max(0, s.length - 100)));
    }, 5000);

    return () => clearTimeout(timeout);
  }, [sparkles]);

  return (
    <div className="fixed top-0 left-0 w-full h-full ">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute rounded-full bg-white"
            style={{
              width: sparkle.size,
              height: sparkle.size,
              left: sparkle.x,
              top: sparkle.y,
              boxShadow: `0 0 ${sparkle.size * 2}px ${
                sparkle.size / 2
              }px rgba(255, 255, 255, 0.7)`,
            }}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0.5, 1, 0],
              scale: [0, 1, 0.8, 1, 0],
              x: [0, sparkle.moveX, sparkle.moveX * 0.5, sparkle.moveX],
              y: [0, sparkle.moveY, sparkle.moveY * 0.7, sparkle.moveY],
            }}
            transition={{
              duration: sparkle.duration,
              delay: sparkle.delay,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
            }}
            exit={{ opacity: 0, scale: 0 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
