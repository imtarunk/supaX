"use client";
import React, { useState } from "react";
import { XIcon } from "./icons/icons";
import { Loader2 } from "lucide-react";

const XConnectPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    window.location.href = "/api/auth/signin";
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-xl p-8 space-y-8">
          {/* Card Header */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-100">
              <XIcon width={100} height={100} />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Connect with X
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Link your X account to continue
            </p>
          </div>

          {/* Connect Button */}
          <div className="mt-8">
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-black hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Connecting...
                </span>
              ) : (
                "Connect X Account"
              )}
            </button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-xs text-gray-500 mt-6">
            <p>We only request basic access to your X profile</p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Having trouble?{" "}
            <a
              href="#"
              className="font-medium text-blue-500 hover:text-blue-700"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default XConnectPage;
