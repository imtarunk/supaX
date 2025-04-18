"use client";
import { handleTweet } from "@/app/api/create/tweet";
import React, { useState } from "react";

interface TaskCardProps {
  icon: React.ReactNode;
  points: number;
  task: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  icon,
  points,
  task,
}: TaskCardProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="bg-black rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 w-full max-w-4xl mx-auto border border-gray-800 transition-all duration-300 hover:border-gray-700 hover:shadow-md hover:shadow-gray-900/30 z-10">
      {/* X Logo and Text Content - Stack on mobile, row on larger screens */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-6 w-full sm:w-auto">
        <div className="text-white scale-90 sm:scale-100">{icon}</div>

        {/* Text Content */}
        <div className="text-white text-center sm:text-left">
          <div className="text-base sm:text-xl font-bold">{task}</div>
          <div className="text-gray-400 text-sm sm:text-lg">{points} XP</div>
        </div>
      </div>

      {/* Go Button */}
      <div
        className="relative mt-2 sm:mt-0 w-full sm:w-auto flex justify-center sm:block"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className={`absolute -inset-1 bg-gradient-to-r from-lime-400 to-lime-300 rounded-lg transition-all duration-300 ${
            isHovering ? "scale-105 opacity-100" : "scale-95 opacity-90"
          }`}
        ></div>
        <button
          className={`relative bg-black text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-xl w-full sm:w-auto transition-transform duration-200 ${
            isHovering ? "scale-105 shadow-lg" : ""
          } cursor-pointer`}
          onClick={handleTweet}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
