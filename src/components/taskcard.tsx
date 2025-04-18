"use client";
import {
  XIcon,
  FollowIcon,
  LikeIcon,
  DefaultIcon,
} from "@/components/icons/icons";
import React, { useState } from "react";

type TaskType = "tweet" | "follow" | "like";

interface TaskItem {
  type: TaskType;
  content: string;
}

interface TaskCardProps {
  icon: string;
  task: TaskItem[];
  points: number;
  completed?: boolean;
}

export default function TaskCard({
  task,
  points,
  completed = false,
}: TaskCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const taskType = task[0]?.type;

  const renderIcon = () => {
    switch (taskType) {
      case "tweet":
        return <XIcon width={60} height={60} />;
      case "follow":
        return <FollowIcon width={70} height={70} />;
      case "like":
        return <LikeIcon width={70} height={70} />;
      default:
        return <DefaultIcon width={70} height={70} />;
    }
  };

  const truncateContent = (content: string) => {
    const words = content.split(" ");
    if (words.length > 15) {
      return words.slice(0, 15).join(" ") + "...";
    }
    return content;
  };

  return (
    <div className="bg-black rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 w-full max-w-4xl mx-auto border border-gray-800 transition-all duration-300 hover:border-gray-700 hover:shadow-md hover:shadow-gray-900/30 z-10">
      {/* Icon and Text Content - Stack on mobile, row on larger screens */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-6 w-full sm:w-auto">
        <div className="text-white scale-90 sm:scale-100">{renderIcon()}</div>

        {/* Text Content */}
        <div className="text-white text-center sm:text-left">
          <div className="text-base sm:text-xl font-bold">
            {taskType === "tweet"
              ? "Tweet"
              : taskType === "follow"
              ? "Follow"
              : "Like"}{" "}
            Task
          </div>
          <div className="text-gray-400 text-sm sm:text-lg">
            {task[0]?.content ? truncateContent(task[0].content) : ""}
          </div>
          <div className="text-lime-400 text-sm mt-1">{points} points</div>
          {completed && (
            <div className="text-green-500 text-sm mt-1">✓ Completed</div>
          )}
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
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {completed ? "Completed" : "Go"}
        </button>
      </div>
    </div>
  );
}
