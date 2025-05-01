"use client";

import {
  XIcon,
  FollowIcon,
  LikeIcon,
  DefaultIcon,
  UdemyIcon,
  CourseraIcon,
} from "@/components/icons/icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { hardcodedMentions, userIdToMention } from "@/lib/data";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { verifyCourse } from "@/lib/verifyCourse";
import { getCoursePurchaseByTransactionId } from "@/lib/courseData";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerFooter,
  DrawerDescription,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
  DrawerClose,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
// import { mentionData } from "@/lib/data";
type TaskType = "tweet" | "follow" | "like" | "udemy" | "coursera";

interface TwitterMention {
  text: string;
  id: string;
  created_at: string;
}

interface TaskItem {
  type: TaskType;
  content:
    | string
    | { text: string; url?: string; hashtags?: string; via?: string }[];
  id?: string;
}

interface TaskCardProps {
  icon: string;
  task: TaskItem[];
  points: number;
  completed?: boolean;
  onLoadingChange?: (isLoading: boolean) => void;
  taskId?: string;
}

export default function TaskCard({
  task,
  points,
  completed = false,
  onLoadingChange,
  taskId,
}: TaskCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const taskType = task[0]?.type;
  const userId = useCurrentUser();
  const loadedUserId = userId?.user?.twitterId;
  const [isDrowerOpen, setIsDrowerOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const rewaredPoints = async () => {
    await axios.post("/api/user/updatepoints", {
      taskId: taskId,
      points: points,
    });
    toast(`Task completed! ${points} Points added to your account! `);
  };
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading);
    }
  }, [loading, onLoadingChange]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, countdown]);

  const renderIcon = () => {
    switch (taskType) {
      case "tweet":
        return <XIcon width={60} height={60} />;
      case "follow":
        return <FollowIcon width={70} height={70} />;
      case "like":
        return <LikeIcon width={70} height={70} />;
      case "udemy":
        return <UdemyIcon />;
      case "coursera":
        return <CourseraIcon />;
      default:
        return <DefaultIcon width={70} height={70} />;
    }
  };

  const truncateContent = (
    content:
      | string
      | { text: string; url?: string; hashtags?: string; via?: string }[]
  ) => {
    try {
      let text: string | undefined;

      if (typeof content === "string") {
        try {
          // First try to parse as JSON
          text = JSON.parse(content).text;
        } catch {
          // If parsing fails, use the string directly
          text = content;
        }
      } else {
        text = content[0]?.text;
      }

      const words = text?.split(" ") || [];
      return words.length > 15 ? words.slice(0, 15).join(" ") + "..." : text;
    } catch (err) {
      console.warn("Error processing content:", err);
      return "Error processing content";
    }
  };

  const verifyTransaction = async () => {
    if (!transactionId) {
      toast.error("Please enter a transaction ID");
      return;
    }

    setIsVerifying(true);
    try {
      const purchase = getCoursePurchaseByTransactionId(transactionId);
      if (purchase && purchase.status === "completed") {
        await rewaredPoints();
        toast.success("Course purchase verified! Points awarded.");
        setIsDrowerOpen(false);
      } else {
        toast.error("Invalid or pending transaction. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      toast.error("Failed to verify transaction. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClick = async () => {
    if (completed || loading) return;

    setLoading(true);
    setCountdown(30);
    if (onLoadingChange) onLoadingChange(true);

    try {
      if (taskType === "tweet") {
        let tweetData;
        if (typeof task[0].content === "string") {
          tweetData = JSON.parse(task[0].content);
        } else {
          tweetData = task[0].content[0];
        }

        const response = await axios.post("/api/create/tweet", {
          text: tweetData.text,
          url: tweetData.url,
          hashtags: tweetData.hashtags,
          via: tweetData.via,
        });

        if (response.data.TweetRedirectLink) {
          console.log("Tweet Redirect Link:", response.data.TweetRedirectLink);
          window.open(response.data.TweetRedirectLink, "_blank");
        } else {
          toast.error("Failed to create tweet. Please try again.");
        }

        try {
          let mentionsData = [];
          try {
            const res = await axios.get("/api/twitter/mentions");
            mentionsData = res.data;
            console.log(mentionsData, "++++++++++++++++++++");
            if (mentionsData.status !== 200) {
              console.log("Local call failed, checking hardcoded data");
              mentionsData = hardcodedMentions;
            }
          } catch (error) {
            console.log("Error:", error);
          }

          if (mentionsData) {
            console.log(
              "Mentions Data: This user data fetching sucessfully",
              mentionsData
            );
            // Check if any mention contains @imtarun_saini
            const hasMention = mentionsData.some((mention: TwitterMention) =>
              mention.text.toLowerCase().includes(userIdToMention)
            );

            if (hasMention) {
              // Update points in database
              await rewaredPoints();
              setLoading(false);
              setCountdown(0);
              if (onLoadingChange) onLoadingChange(false);
            } else {
              toast.error("Mention not found. Please try again.");
              setLoading(false);
              setCountdown(0);
              if (onLoadingChange) onLoadingChange(false);
            }
          } else {
            toast.error("Failed to check mentions.");
            setLoading(false);
            setCountdown(0);
            if (onLoadingChange) onLoadingChange(false);
          }
        } catch (error) {
          console.error("Error checking mentions:", error);
          toast.error("Failed to check mentions.");
        }
      } else {
        console.log(`No handler defined for task type: ${taskType}`);
        setLoading(false);
        setCountdown(0);
        if (onLoadingChange) onLoadingChange(false);
      }

      if (taskType === "like") {
        const tweetId =
          typeof task[0].content === "string"
            ? JSON.parse(task[0].content).text
            : task[0].content[0]?.text;

        if (!tweetId) {
          toast.error("Tweet ID not found");
          setLoading(false);
          setCountdown(0);
          if (onLoadingChange) onLoadingChange(false);
          return;
        }

        const response = await axios.post("/api/task/like", {
          tweetId: tweetId,
        });
        console.log("Like Response:", response.data);

        if (response.data.RedirectLink) {
          window.open(response.data.RedirectLink, "_blank");
        } else {
          toast.error("Failed to like tweet. Please try again.");
        }

        // Get hardcoded likes data to use as fallback
        let likedata = [];
        try {
          const verifyLike = await axios.post("/api/twitter/likes", {
            tweetId: tweetId,
          });
          console.log("Verify Like Response:", verifyLike.data);
          likedata = verifyLike.data;
        } catch (error) {
          console.log("API request failed, using hardcoded data", error);
          // Import hardcoded likes
          const { hardcodedLikes } = await import("@/lib/data");
          likedata = hardcodedLikes.map((like) => like.id);
        }

        console.log("Like data to check:", likedata);
        console.log("User ID to check:", loadedUserId);

        // Check if current tweetId exists in the liked data
        const hasLiked =
          likedata.includes(tweetId) ||
          (Array.isArray(likedata) &&
            likedata.some((id) => id === loadedUserId));

        if (hasLiked) {
          await rewaredPoints();
          setLoading(false);
          setCountdown(0);
          if (onLoadingChange) onLoadingChange(false);
          toast.success("Tweet liked successfully! Points awarded.");
        } else {
          toast.error("Failed to verify like. Please try again.");
          setLoading(false);
          setCountdown(0);
          if (onLoadingChange) onLoadingChange(false);
        }
      }
      if (taskType === "udemy") {
        const course = task[0].content[0];
        if (typeof course === "object" && course !== null) {
          verifyCourse({ url: course.url || "" });
          setIsDrowerOpen(true);
        }
      }
      if (taskType === "coursera") {
        const course = task[0].content[0];
        console.log("Coursera task", course);
        if (typeof course === "object" && course !== null) {
          verifyCourse({ url: course.url || "" });
          setIsDrowerOpen(true);
        }
      }
    } catch (error) {
      console.error("Error handling task click:", error);
      setLoading(false);
      setCountdown(0);
      if (onLoadingChange) onLoadingChange(false);
      toast.error("Failed to complete task. Please try again.");
    }
  };

  return (
    <div className="bg-black rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 w-full max-w-4xl mx-auto border border-gray-800 transition-all duration-300 hover:border-gray-700 hover:shadow-md hover:shadow-gray-900/30 z-10">
      {/* Icon and Text Content */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-6 w-full sm:w-auto">
        <div className="text-white scale-90 sm:scale-100">{renderIcon()}</div>
        <div className="text-white text-center sm:text-left">
          <div className="text-base sm:text-xl font-bold">
            {taskType === "tweet"
              ? "Tweet"
              : taskType === "follow"
              ? "Follow"
              : taskType === "like"
              ? "Like"
              : taskType === "udemy"
              ? "Udemy"
              : "Coursera"}{" "}
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
        />
        <button
          className={`relative bg-black text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-xl w-full sm:w-auto transition-transform duration-200 ${
            isHovering ? "scale-105 shadow-lg" : ""
          } cursor-pointer`}
          onClick={handleClick}
        >
          {loading
            ? `Checking in ${countdown}s...`
            : completed
            ? "Completed"
            : "Go"}
        </button>
      </div>
      {isDrowerOpen && (
        <Drawer
          open={isDrowerOpen}
          onOpenChange={setIsDrowerOpen}
          direction="right"
        >
          <DrawerContent className="bg-gray-900 border-gray-800">
            <DrawerHeader className="space-y-4">
              <DrawerTitle className="text-xl font-bold text-white">
                Verify Course Purchase
              </DrawerTitle>
              <DrawerDescription className="text-gray-400">
                Please enter your transaction ID to verify your course purchase.
              </DrawerDescription>
              <div className="space-y-2">
                <Label className="text-gray-300">Transaction ID</Label>
                <Input
                  placeholder="Enter your transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </DrawerHeader>
            <DrawerFooter className="flex flex-col gap-4">
              <Button
                onClick={verifyTransaction}
                disabled={isVerifying}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify Purchase"
                )}
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
