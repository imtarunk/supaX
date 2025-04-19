"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { taskSchema } from "@/app/schema/z";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminPage() {
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      icon: "",
      task: [
        {
          type: "tweet",
          content: [
            {
              text: "",
              url: "",
              hashtags: "",
              via: "",
            },
          ],
        },
      ],
      points: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    try {
      const res = await axios.post("/api/admin/createtask", values);
      if (res.status === 200) {
        toast("Task created successfully");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="min-h-screen  text-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10 relative">
      <div className="w-full max-w-2xl">
        <div className="border border-gray-800 rounded-xl p-4 sm:p-8 shadow-lg shadow-blue-900/10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white text-center">
            Create New Task
          </h1>
          <div className="border-b border-gray-800 mb-6 sm:mb-8"></div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm sm:text-base">
                      Icon
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Icon svg code"
                        {...field}
                        className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500 h-10 sm:h-12 text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 text-xs sm:text-sm">
                      This is the icon that will be displayed in the task card.
                    </FormDescription>
                    <FormMessage className="text-red-400 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="task.0.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm sm:text-base">
                      Task Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500 h-10 sm:h-12 text-sm sm:text-base">
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tweet">Tweet</SelectItem>
                        <SelectItem value="follow">Follow</SelectItem>
                        <SelectItem value="like">Like</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-gray-500 text-xs sm:text-sm">
                      Select the type of task to create.
                    </FormDescription>
                    <FormMessage className="text-red-400 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="task.0.content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm sm:text-base">
                      Task Content
                    </FormLabel>
                    {form.watch("task.0.type") === "tweet" ? (
                      <div className="space-y-4">
                        <FormControl>
                          <Input
                            placeholder="Enter tweet text"
                            value={field.value[0]?.text || ""}
                            onChange={(e) => {
                              const newContent = [...field.value];
                              newContent[0] = {
                                ...newContent[0],
                                text: e.target.value,
                              };
                              field.onChange(newContent);
                            }}
                            className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500 h-10 sm:h-12 text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            placeholder="Enter URL (optional)"
                            value={field.value[0]?.url || ""}
                            onChange={(e) => {
                              const newContent = [...field.value];
                              newContent[0] = {
                                ...newContent[0],
                                url: e.target.value,
                              };
                              field.onChange(newContent);
                            }}
                            className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500 h-10 sm:h-12 text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            placeholder="Enter hashtags (optional)"
                            value={field.value[0]?.hashtags || ""}
                            onChange={(e) => {
                              const newContent = [...field.value];
                              newContent[0] = {
                                ...newContent[0],
                                hashtags: e.target.value,
                              };
                              field.onChange(newContent);
                            }}
                            className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500 h-10 sm:h-12 text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormControl>
                          <Input
                            placeholder="Enter via (optional)"
                            value={field.value[0]?.via || ""}
                            onChange={(e) => {
                              const newContent = [...field.value];
                              newContent[0] = {
                                ...newContent[0],
                                via: e.target.value,
                              };
                              field.onChange(newContent);
                            }}
                            className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500 h-10 sm:h-12 text-sm sm:text-base"
                          />
                        </FormControl>
                      </div>
                    ) : form.watch("task.0.type") === "follow" ? (
                      <FormControl>
                        <Input
                          value={field.value[0]?.text || ""}
                          onChange={(e) => {
                            const newContent = [...field.value];
                            newContent[0] = {
                              ...newContent[0],
                              text: e.target.value,
                            };
                            field.onChange(newContent);
                          }}
                          placeholder="Enter Twitter handle to follow"
                          className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500 h-10 sm:h-12 text-sm sm:text-base"
                        />
                      </FormControl>
                    ) : (
                      <FormControl>
                        <Input
                          value={field.value[0]?.text || ""}
                          onChange={(e) => {
                            const newContent = [...field.value];
                            newContent[0] = {
                              ...newContent[0],
                              text: e.target.value,
                            };
                            field.onChange(newContent);
                          }}
                          placeholder="Enter tweet URL to like"
                          className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500 h-10 sm:h-12 text-sm sm:text-base"
                        />
                      </FormControl>
                    )}
                    <FormDescription className="text-gray-500 text-xs sm:text-sm">
                      {form.watch("task.0.type") === "tweet"
                        ? "Enter the tweet content and optional fields"
                        : form.watch("task.0.type") === "follow"
                        ? "The Twitter handle to follow (without @)"
                        : "The URL of the tweet to like"}
                    </FormDescription>
                    <FormMessage className="text-red-400 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm sm:text-base">
                      Points
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Points"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500 h-10 sm:h-12 text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 text-xs sm:text-sm">
                      Points to be awarded for completing this task.
                    </FormDescription>
                    <FormMessage className="text-red-400 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
