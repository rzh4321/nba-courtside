"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { ScheduleBar } from "./ScheduleBar";
import useTheme from "@/hooks/useTheme";
import { Button } from "./ui/button";
import AuthDialog from "./AuthDialog";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

const NavBar = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    toast.success("Successfully logged out");
    logout();
  };

  return (
    <div className="w-full sticky top-0 left-0 z-50 shadow-md">
      <div className="bg-blue-500 dark:bg-gray-900 h-[65px] px-4 py-2">
        <div className="h-full flex justify-between items-center">
          <Link href="/" className="flex gap-2 items-center hover:no-underline">
            <Image
              alt="icon"
              src="/icon.ico"
              width={100}
              height={100}
              className="w-[40px] hidden sm:block"
            />
            <span className="text-2xl font-bold text-white">NBA CourtSide</span>
          </Link>

          <div className="flex gap-5 items-center">
            <Button
              asChild
              variant={"link"}
              className="font-semibold text-white"
            >
              <Link href="/standings">Standings</Link>
            </Button>
            {loading ? (
              <span className="animate-pulse bg-blue-300 rounded-full w-[40px] h-[20px]"></span>
            ) : isAuthenticated ? (
              <Button
                className="text-white font-semibold tracking-tight"
                onClick={handleLogout}
                variant={"link"}
              >
                Log Out
              </Button>
            ) : (
              <AuthDialog />
            )}

            {isDark !== undefined && (
              <Button
                onClick={toggleTheme}
                className="p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} fill="black" />}
              </Button>
            )}
          </div>
        </div>
      </div>
      <ScheduleBar />
    </div>
  );
};

export default NavBar;
