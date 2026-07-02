"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import {
  Library, Clock, BookOpen, CheckSquare, Award, ArrowUpRight, Plus,
  Trash2, RefreshCw, Sparkles, MessageSquare
} from "lucide-react";
import { motion } from "motion/react";

export default function LibraryPage() {
  const router = useRouter();

  // Dashboard states
  const [userName, setUserName] = useState("Learner");
  const [userId, setUserId] = useState(null);
  const [savedPaths, setSavedPaths] = useState([]);
  const [isLoadingPaths, setIsLoadingPaths] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("coursify_user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.name) setUserName(parsed.name);
        if (parsed.id) setUserId(parsed.id);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }

    const fetchSavedPaths = async (id) => {
      setIsLoadingPaths(true);
      setError("");

      try {
        const response = await fetch(`/api/syllabi?userId=${encodeURIComponent(id)}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to load saved paths.");
        }
        setSavedPaths(data);
      } catch (err) {
        console.error("Failed to load saved paths:", err);
        setError("Could not load saved paths. Please try again.");
      } finally {
        setIsLoadingPaths(false);
      }
    };

    if (user) {
      const parsed = JSON.parse(user);
      if (parsed?.id) {
        fetchSavedPaths(parsed.id);
      }
    }
  }, []);

  const handleOpenWorkspace = (query) => {
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  const handleDeletePath = async (idx, e) => {
    e.stopPropagation();
    const path = savedPaths[idx];
    const id = path._id || path.id;
    if (!id) {
      setSavedPaths((prev) => prev.filter((_, i) => i !== idx));
      return;
    }

    try {
      const response = await fetch(`/api/syllabi?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unable to delete roadmap.");
      }
      setSavedPaths((prev) => prev.filter((_, i) => i !== idx));
    } catch (err) {
      console.error("Delete path error:", err);
    }
  };

  const calculateOverallProgress = () => {
    if (savedPaths.length === 0) return 0;
    const sum = savedPaths.reduce((acc, curr) => acc + curr.progress, 0);
    return Math.round(sum / savedPaths.length);
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-100 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      {/* Background lines graphic */}
      <BackgroundLines className="flex items-center justify-center w-full absolute inset-0 flex-col" />

      {/* Main card panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 max-w-5xl w-full backdrop-blur-xl bg-gray-900/60 border border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col gap-8"
      >
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800/80 pb-5 gap-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-900/50 px-3 py-1 rounded-full">
              Workspace Database
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3 flex items-center gap-2">
              <Library className="w-7 h-7 text-cyan-400" />
              <span>{userName}&apos;s Library</span>
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Analyze learning time metrics, resume active courses, or compile new paths.
            </p>
          </div>
          <Button
            onClick={() => router.push("/chat")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-4 px-4 h-auto rounded-xl flex items-center gap-1.5 shrink-0 shadow-lg shadow-blue-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Study Path</span>
          </Button>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Overall Progress */}
          <div className="p-4 bg-gray-950/40 border border-gray-850 rounded-2xl flex flex-col justify-between h-32 hover:border-gray-800 transition-colors">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xxs font-bold uppercase tracking-wider">Overall Progress</span>
              <Award className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">{calculateOverallProgress()}%</h3>
              <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${calculateOverallProgress()}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Studying Hours */}
          <div className="p-4 bg-gray-950/40 border border-gray-850 rounded-2xl flex flex-col justify-between h-32 hover:border-gray-800 transition-colors">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xxs font-bold uppercase tracking-wider">Studying Hours</span>
              <Clock className="w-4 h-4 text-orange-400" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-white">12.5 hrs</h3>
              <p className="text-3xs text-gray-500">Total time spent on learning</p>
            </div>
          </div>

          {/* Card 3: Active Paths */}
          <div className="p-4 bg-gray-950/40 border border-gray-850 rounded-2xl flex flex-col justify-between h-32 hover:border-gray-800 transition-colors">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xxs font-bold uppercase tracking-wider">Enrolled roadmaps</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-white">{savedPaths.length} Active</h3>
              <p className="text-3xs text-gray-500">Currently running curricula</p>
            </div>
          </div>

          {/* Card 4: Milestones */}
          <div className="p-4 bg-gray-950/40 border border-gray-850 rounded-2xl flex flex-col justify-between h-32 hover:border-gray-800 transition-colors">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xxs font-bold uppercase tracking-wider">Checkpoints Met</span>
              <CheckSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-2xl font-black text-white">
                {savedPaths.reduce((acc, curr) => acc + (curr.progress > 0 ? 1 : 0), 0)} Week(s)
              </h3>
              <p className="text-3xs text-gray-500">Checked out syllabus weeks</p>
            </div>
          </div>
        </div>

        {/* Database List Segment */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
            Your Active Syllabus
          </span>
          <div className="overflow-hidden border border-gray-850 rounded-2xl bg-gray-950/30">
            {savedPaths.length > 0 ? (
              <div className="divide-y divide-gray-850">
                {savedPaths.map((path, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleOpenWorkspace(path.query)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-gray-900/60 cursor-pointer transition-colors gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-400">
                          {path.title}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-gray-900 border border-gray-800 text-gray-400">
                          {path.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xxs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{path.estimatedWeeks || path.weeks} Weeks syllabus</span>
                        </span>
                        <span>•</span>
                        <span>AI Compiled</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 justify-between sm:justify-end">
                      {/* Week progress card inside list row */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-24 bg-gray-900 h-2 rounded-full overflow-hidden hidden xs:block">
                          <div
                            className="bg-cyan-500 h-full rounded-full"
                            style={{ width: `${path.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-300 w-8 text-right">
                          {path.progress}%
                        </span>
                      </div>

                      {/* Row actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => handleDeletePath(idx, e)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/20 rounded-xl transition-colors cursor-pointer"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <Sparkles className="w-8 h-8 text-gray-600 mb-3 animate-pulse" />
                <span className="text-xs font-semibold text-gray-400">Your library dashboard is empty.</span>
                <p className="text-3xs text-gray-500 max-w-xxs mt-1">Prompt the model first to compile custom curriculums.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
