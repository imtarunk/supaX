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
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      icon: "",
      task: "",
      points: 0 as number,
    },
  });

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    try {
      await axios.post("/api/admin/createtask", values);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="min-h-screen  text-gray-100 flex items-center justify-center">
      <div className="container mx-auto py-12">
        <div className="max-w-2xl mx-auto border border-gray-800 rounded-xl p-8  shadow-lg shadow-blue-900/10">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Create New Task
          </h1>
          <div className="border-b border-gray-800 mb-8"></div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Icon</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Icon svg code"
                          {...field}
                          className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="2"
                              y="2"
                              width="20"
                              height="20"
                              rx="5"
                              ry="5"
                            ></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      This is the icon that will be displayed in the task card.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="task"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Task</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Task"
                          {...field}
                          className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      This is the task that will be displayed in the task card.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Points</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Points"
                          {...field}
                          className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="8" r="7"></circle>
                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                          </svg>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Points to be awarded for completing this task.
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Create Task
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
