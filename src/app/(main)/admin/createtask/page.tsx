"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "@/app/schema/z";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = {
  icon: string;
  task: {
    type: string;
    content: string;
  }[];
  points: number;
  tweetText?: string;
  tweetUrl?: string;
  tweetHashtags?: string;
  tweetVia?: string;
};

export default function CreateTaskPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [taskType, setTaskType] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      icon: "",
      task: [{ type: "", content: "" }],
      points: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // If it's a tweet task, combine the tweet fields into content
      if (data.task[0].type === "tweet") {
        const tweetContent = {
          text: data.tweetText || "",
          url: data.tweetUrl || "",
          hashtags: data.tweetHashtags || "",
          via: data.tweetVia || "",
        };
        data.task[0].content = JSON.stringify(tweetContent);
      }

      const response = await fetch("/api/admin/createtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      toast.success("Task created successfully");
      router.push("/admin");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon (SVG)</Label>
          <Textarea
            id="icon"
            {...register("icon")}
            placeholder="Paste SVG icon code here"
            className="min-h-[100px]"
          />
          {errors.icon && (
            <p className="text-red-500 text-sm">{errors.icon.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Task Type</Label>
          <Select
            onValueChange={(value) => {
              setTaskType(value);
              setValue("task.0.type", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tweet">Tweet</SelectItem>
              <SelectItem value="follow">Follow</SelectItem>
              <SelectItem value="like">Like</SelectItem>
            </SelectContent>
          </Select>
          {errors.task?.[0]?.type && (
            <p className="text-red-500 text-sm">
              {errors.task[0].type.message}
            </p>
          )}
        </div>

        {taskType === "tweet" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="tweetText">Tweet Text (Optional)</Label>
              <Input
                id="tweetText"
                {...register("tweetText")}
                placeholder="Enter tweet text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tweetUrl">URL (Optional)</Label>
              <Input
                id="tweetUrl"
                {...register("tweetUrl")}
                placeholder="Enter URL to share"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tweetHashtags">Hashtags (Optional)</Label>
              <Input
                id="tweetHashtags"
                {...register("tweetHashtags")}
                placeholder="Enter hashtags (comma separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tweetVia">Via (Optional)</Label>
              <Input
                id="tweetVia"
                {...register("tweetVia")}
                placeholder="Enter Twitter username for via"
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="content">Task Content</Label>
            <Input
              id="content"
              {...register("task.0.content")}
              placeholder={
                taskType === "follow"
                  ? "Enter Twitter username to follow"
                  : taskType === "like"
                  ? "Enter tweet ID to like"
                  : "Enter task content"
              }
            />
            {errors.task?.[0]?.content && (
              <p className="text-red-500 text-sm">
                {errors.task[0].content.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="points">Points</Label>
          <Input
            id="points"
            type="number"
            {...register("points", { valueAsNumber: true })}
            placeholder="Enter points"
          />
          {errors.points && (
            <p className="text-red-500 text-sm">{errors.points.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Task"}
        </Button>
      </form>
    </div>
  );
}
