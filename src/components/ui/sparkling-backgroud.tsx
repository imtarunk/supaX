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
  moveX: number; // Add this for horizontal movement
  moveY: number; // Add this for vertical movement
}

export default function SparklingBackground() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial dimensions
    updateDimensions();

    // Add event listener
    window.addEventListener("resize", updateDimensions);

    // Clean up
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Generate new sparkles periodically
  useEffect(() => {
    if (dimensions.width === 0) return;

    // Initial sparkles
    generateSparkles(50);

    // Add new sparkles every second
    const interval = setInterval(() => {
      generateSparkles(8);
    }, 1000);

    return () => clearInterval(interval);
  }, [dimensions]);

  // Remove sparkles that have been visible for their duration
  useEffect(() => {
    if (sparkles.length === 0) return;

    const timeout = setTimeout(() => {
      setSparkles((currentSparkles) =>
        currentSparkles.slice(Math.max(0, currentSparkles.length - 100))
      );
    }, 5000);

    return () => clearTimeout(timeout);
  }, [sparkles]);

  const generateSparkles = (count: number) => {
    const newSparkles: Sparkle[] = [];

    for (let i = 0; i < count; i++) {
      newSparkles.push({
        id: Date.now() + i,
        size: Math.random() * 4 + 0.5, // 0.5-4.5px (smaller minimum, larger maximum)
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        delay: Math.random() * 2, // 0-2s delay
        duration: Math.random() * 2 + 2, // 2-4s duration
        moveX: (Math.random() - 0.5) * 50, // Random movement between -25 and 25
        moveY: (Math.random() - 0.5) * 50, // Random movement between -25 and 25
      });
    }

    setSparkles((currentSparkles) => [...currentSparkles, ...newSparkles]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-transparent overflow-hidden">
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
