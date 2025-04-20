import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navbar";
import Image from "next/image";
import TaskCard from "@/components/taskcard";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import { redirect } from "next/navigation";

type TaskType = "tweet" | "follow" | "like";

interface TaskItem {
  type: TaskType;
  content: string;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const user = await getCurrentUser();

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Fetch all tasks and user's completed tasks
  const [tasks, userTasks] = await Promise.all([
    prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
    user
      ? prisma.userTask.findMany({
          where: {
            userId: user.id,
          },
          select: {
            taskId: true,
            completed: true,
          },
        })
      : [],
  ]);

  // Create a map of task IDs to completion status
  const taskCompletionMap = userTasks.reduce((acc, userTask) => {
    acc[userTask.taskId] = userTask.completed;
    return acc;
  }, {} as Record<string, boolean>);

  return (
    <div className="min-h-screen bg-transparent text-white relative z-10">
      <Navbar initialUser={user} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Dashboard
          </h1>

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-gray-900 border-gray-800"
              >
                {user && (
                  <div className="mt-8">
                    <div className="flex flex-col items-center gap-4">
                      {user.image && (
                        <div className="relative w-20 h-20">
                          <Image
                            src={user.image}
                            alt={user.name || "User"}
                            fill
                            sizes="(max-width: 64px) 100vw, 64px"
                            className="rounded-full object-cover border-2 border-blue-500"
                            priority
                          />
                        </div>
                      )}
                      <div className="text-center">
                        <h2 className="text-lg font-semibold">{user.name}</h2>
                        <p className="text-gray-400 text-sm break-words">
                          {user.email}
                        </p>
                        {user.twitterId && (
                          <p className="text-blue-400 text-sm flex items-center justify-center gap-1">
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            Connected
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-gray-800 pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Total Tasks</span>
                        <span className="font-medium">{tasks.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Completed</span>
                        <span className="font-medium">
                          {
                            Object.values(taskCompletionMap).filter(Boolean)
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Profile Section */}
        <div className="hidden sm:block mb-8">
          {user ? (
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {user.image && (
                    <div className="relative w-24 h-24">
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        fill
                        sizes="(max-width: 96px) 100vw, 96px"
                        className="rounded-full object-cover border-2 border-blue-500"
                        priority
                      />
                    </div>
                  )}

                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                    <p className="text-gray-400 text-sm break-words mb-2">
                      {user.email}
                    </p>
                    {user.twitterId && (
                      <p className="text-blue-400 text-sm flex items-center gap-1 sm:justify-start justify-center">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Connected
                      </p>
                    )}
                  </div>

                  <div className="hidden md:block border-l border-gray-700 pl-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Total Tasks</p>
                          <p className="font-medium">{tasks.length}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Completed</p>
                          <p className="font-medium">
                            {
                              Object.values(taskCompletionMap).filter(Boolean)
                                .length
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile stats row */}
              <div className="sm:hidden grid grid-cols-2 divide-x divide-gray-700 bg-gray-800/50">
                <div className="p-3 text-center">
                  <p className="text-gray-400 text-xs">Total Tasks</p>
                  <p className="font-medium">{tasks.length}</p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-gray-400 text-xs">Completed</p>
                  <p className="font-medium">
                    {Object.values(taskCompletionMap).filter(Boolean).length}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-xl text-center">
              <p>No user data available</p>
            </div>
          )}
        </div>

        {/* Tasks Section Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Available Tasks</h2>
          <div className="text-sm text-gray-400">
            {Object.values(taskCompletionMap).filter(Boolean).length} /{" "}
            {tasks.length} completed
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="flex flex-col gap-4  ">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <TaskCard
                icon={task.icon}
                task={task.task as unknown as TaskItem[]}
                points={task.points}
                completed={taskCompletionMap[task.id] || false}
                taskId={task.id}
              />
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No tasks available at the moment</p>
          </div>
        )}
      </main>
    </div>
  );
}
