"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FallingParticle {
  id: number;
  x: number;
  y: number;
  length: number;
  opacity: number;
  delay: number;
  duration: number;
  color: string;
}

const getRandomColor = () => {
  const colors = ["#888", "#aaa", "#ccc", "#eee"]; // Muted, light grayscale colors
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function FallingParticlesBackground() {
  const [particles, setParticles] = useState<FallingParticle[]>([]);
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
    const generateParticles = (count: number) => {
      const newParticles: FallingParticle[] = [];
      for (let i = 0; i < count; i++) {
        const startX = Math.random() * dimensions.width;
        const startY = -Math.random() * 50; // Start slightly above the screen
        const length = Math.random() * 30 + 10;
        const opacity = Math.random() * 0.6 + 0.4; // More consistent opacity
        const duration = Math.random() * 3 + 2;

        newParticles.push({
          id: Math.random(),
          x: startX,
          y: startY,
          length: length,
          opacity: opacity,
          delay: Math.random() * 2,
          duration: duration,
          color: getRandomColor(),
        });
      }
      setParticles((current) => [...current, ...newParticles]);
    };

    generateParticles(80); // Generate more particles initially
    const interval = setInterval(() => generateParticles(20), 1000);

    return () => clearInterval(interval);
  }, [dimensions]);

  useEffect(() => {
    if (particles.length === 0) return;

    const timeout = setTimeout(() => {
      setParticles((s) => s.slice(Math.max(0, s.length - 150))); // Keep more particles around longer
    }, 6000);

    return () => clearTimeout(timeout);
  }, [particles]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-white rounded-full"
            style={{
              width: 1, // Thin vertical line
              height: particle.length,
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity,
              backgroundColor: particle.color,
            }}
            initial={{ y: -particle.length, opacity: 0 }}
            animate={{
              y: dimensions.height + particle.length,
              opacity: particle.opacity,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "linear", // Consistent falling speed
            }}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
