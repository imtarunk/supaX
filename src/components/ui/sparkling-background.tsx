import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Sparkle {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: {
    top: string;
    left: string;
  };
}

interface SparklingBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const SparklingBackground = ({
  children,
  className,
}: SparklingBackgroundProps) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const now = Date.now();
      const newSparkles: Sparkle[] = [];

      for (let i = 0; i < 50; i++) {
        newSparkles.push({
          id: String(now + i),
          createdAt: now,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          size: Math.random() * 10 + 5,
          style: {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          },
        });
      }

      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            ...sparkle.style,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: sparkle.color,
            borderRadius: "50%",
          }}
        />
      ))}
      {children}
    </div>
  );
};
