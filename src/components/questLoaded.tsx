import { useEffect, useState } from "react";

export default function AlternativeLoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white h-screen w-full">
      <h1 className="text-3xl font-mono mb-12">Verifying your quest</h1>

      <div className="w-64 mb-12">
        <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>0%</span>
          <span>{progress}%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="flex space-x-2 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-blue-500"
            style={{
              animation: "pulse 1.5s infinite ease-in-out",
              animationDelay: `${i * 0.2}s`,
            }}
          ></div>
        ))}
      </div>

      <p className="text-lg font-mono text-center max-w-md px-4">
        Please hold on while we verify your quest. This will only take a moment.
      </p>
    </div>
  );
}
