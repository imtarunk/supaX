import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navbar";

export default async function Dashboard() {
  const user = await getCurrentUser();

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {user ? (
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center space-x-4">
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
                {user.twitterId && (
                  <p className="text-gray-400">Twitter ID: {user.twitterId}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>
    </div>
  );
}
