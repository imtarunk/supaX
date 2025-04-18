import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navbar";
import Image from "next/image";
import TaskCard from "@/components/taskcard";
import { tasks } from "@/lib/data";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function Dashboard() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen text-white z-10 relative">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Dashboard</h1>

        {/* Mobile Menu */}
        <div className="sm:hidden flex justify-end mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-gray-800">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] bg-black border-gray-800"
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
                          className="rounded-full object-cover"
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
                        <p className="text-gray-400 text-sm">
                          Twitter ID: {user.twitterId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Profile Section */}
        <div className="hidden sm:block">
          {user ? (
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {user.image && (
                  <div className="relative w-20 h-20 mx-auto sm:mx-0">
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      fill
                      sizes="(max-width: 64px) 100vw, 64px"
                      className="rounded-full object-cover"
                      priority
                    />
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {user.name}
                  </h2>
                  <p className="text-gray-400 text-sm break-words">
                    {user.email}
                  </p>
                  {user.twitterId && (
                    <p className="text-gray-400 text-sm">
                      Twitter ID: {user.twitterId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p>No user data available</p>
          )}
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div className="w-full" key={task.task}>
              <TaskCard {...task} icon={task.icon} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
