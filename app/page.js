"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Settings, NotebookPenIcon, SearchIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SettingsDialog from "@/components/settings-dialog";

export function InputInline({ className, value, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className={`w-full max-w-xl relative z-20 px-4 ${className ?? ""}`}>
      <Field orientation="inline" className="mt-6 w-full flex flex-col sm:flex-row gap-3 items-stretch">
        <Input
          type="search"
          name="q"
          value={value}
          onChange={onChange}
          required
          className="w-full bg-gray-700/80 shadow-[0px_12px_60px_-6px_rgba(183,116,183,0.45)] border border-gray-600 focus:ring-2 focus:ring-blue-500 py-3 sm:py-5 text-white text-sm sm:text-base rounded-xl placeholder:text-gray-400"
          placeholder="What would you like to learn today? Ask Coursify..."
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-60"
        >
          {loading ? "Searching..." : "Ask"}
        </Button>
      </Field>
    </form>
  );
}

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("Learner");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("web development");

  useEffect(() => {
    const checkUser = () => {
      const loggedInUser = localStorage.getItem("coursify_user");
      if (loggedInUser) {
        try {
          const parsed = JSON.parse(loggedInUser);
          if (parsed && parsed.name) {
            setUsername(parsed.name);
          }
        } catch (e) {
          console.error("Failed to parse user", e);
        }
      } else {
        setUsername("Learner");
      }
    };

    checkUser();

    window.addEventListener("storage", checkUser);
    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return;
    }
    router.push(`/chat?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <BackgroundLines className="flex items-center justify-center w-full absolute inset-0 flex-col px-4">
        <main className="place-items-center flex flex-col items-center justify-center text-center max-w-3xl">
          <aside className="hidden md:flex fixed left-2 top-24 bottom-2 z-50 w-12 justify-between bg-transparent flex-col items-center py-6 gap-2 text-white backdrop-blur-sm">
            <div className="flex flex-col gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => router.push("/chat")}
                    className="rounded-full p-2 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <NotebookPenIcon size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>New chat</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => router.push("/chat")}
                    className="rounded-full p-2 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <SearchIcon size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Search chat</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-col gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="rounded-full p-2 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Settings size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </aside>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-30 send-flowers-regular font-bold bg-linear-to-r fade-in-top-normal from-orange-400 via-pink-500 to-indigo-500 text-transparent drop-shadow-[0px_0px_12px_rgba(227,227,227,0.25)] bg-clip-text leading-tight">
            Hello {username},
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl mt-4 text-gray-300 font-light fade-in-normal max-w-xl leading-relaxed">
            what content suggestions would you like to have today?
          </h2>
          <InputInline
            className="relative z-20 mt-6"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onSubmit={handleSearchSubmit}
            loading={false}
          />
        </main>
      </BackgroundLines>

      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}


