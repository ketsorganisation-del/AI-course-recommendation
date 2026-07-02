"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users, Sparkles, Terminal, BarChart2, Shield, Settings2, Trash2,
  Search, ShieldAlert, Cpu, Database, Activity, RefreshCw, Send, PlayCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Mock database values
const INITIAL_USERS = [
  { id: 1, name: "Aniket", email: "aniket@coursify.com", role: "Admin", status: "Active", joined: "2026-06-01" },
  { id: 2, name: "Sarah Connor", email: "sarah@resistance.org", role: "User", status: "Active", joined: "2026-06-12" },
  { id: 3, name: "John Doe", email: "john@doe.com", role: "User", status: "Suspended", joined: "2026-06-14" },
  { id: 4, name: "Alice Smith", email: "alice@wonderland.net", role: "User", status: "Active", joined: "2026-06-20" }
];

const INITIAL_LOGS = [
  { time: "10:04:12", level: "INFO", message: "Database connection pools initialized." },
  { time: "10:05:30", level: "INFO", message: "Gemini API Client loaded successfully." },
  { time: "10:09:44", level: "INFO", message: "User session validated: Aniket." },
  { time: "10:10:02", level: "WARN", message: "Cache miss for query: 'Learn Kubernetes'." },
  { time: "10:12:15", level: "INFO", message: "AI recommendation compiled successfully in 450ms." }
];

const MOCK_EVENTS = [
  { level: "INFO", message: "User session created: Sarah Connor." },
  { level: "INFO", message: "AI recommendation compiled successfully in 312ms." },
  { level: "WARN", message: "Rate limit threshold reached for Guest IP: 192.168.1.55." },
  { level: "INFO", message: "Database tables optimized." },
  { level: "ERROR", message: "External URL validation failed for: 'https://broken-video-link.com'." },
  { level: "INFO", message: "User Sarah Connor bookmarked 'React Syllabus'." },
  { level: "INFO", message: "System configuration variables reloaded." }
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activePanel, setActivePanel] = useState("overview");

  // User management states
  const [users, setUsers] = useState(INITIAL_USERS);
  const [stats, setStats] = useState({ totalUsers: INITIAL_USERS.length, totalSyllabi: 0 });
  const [searchUser, setSearchUser] = useState("");
  const [dbStatus, setDbStatus] = useState({ status: "checking", message: "Checking database connection...", totalUsers: 0, totalSyllabi: 0, readyState: "connecting", latencyMs: null });
  const [dbLoading, setDbLoading] = useState(true);

  // AI parameters
  const [systemPrompt, setSystemPrompt] = useState(
    "You are Coursify AI, a personalized curriculum recommender. Compile a curriculum divided into weeks. For each week, provide a short summary description and list 2 hand-picked resource links (a YouTube video, an article, or a capstone project)."
  );
  const [activeModel, setActiveModel] = useState("gemini-pro");
  const [playgroundQuery, setPlaygroundQuery] = useState("");
  const [playgroundOutput, setPlaygroundOutput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  // Live logs states
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const logsContainerRef = useRef(null);

  // Periodically append new simulated log events
  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) return;
      const result = await response.json();
      setStats({
        totalUsers: result.totalUsers,
        totalSyllabi: result.totalSyllabi,
      });
      setUsers(result.usersList || []);
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    }
  };

  const loadDbStatus = async () => {
    setDbLoading(true);
    try {
      const response = await fetch("/api/db/check", { cache: "no-store" });
      const result = await response.json();
      setDbStatus({
        status: result.status || "error",
        message: result.message || "Unable to reach the database.",
        totalUsers: result.totalUsers ?? 0,
        totalSyllabi: result.totalSyllabi ?? 0,
        readyState: result.readyState ?? "unknown",
        latencyMs: result.latencyMs ?? null,
      });
    } catch (error) {
      setDbStatus({
        status: "error",
        message: error.message || "Unable to reach the database.",
        totalUsers: 0,
        totalSyllabi: 0,
        readyState: "disconnected",
        latencyMs: null,
      });
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadDbStatus();

    const interval = setInterval(() => {
      const randomEvent = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const newLog = {
        time: timeStr,
        level: randomEvent.level,
        message: randomEvent.message,
      };
      setLogs((prev) => [...prev, newLog]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Autoscroll logs window
  useEffect(() => {
    if (activePanel === "logs" && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs, activePanel]);

  // User directory handlers
  const handleToggleStatus = async (id) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;

    const newStatus = target.status === "Active" ? "Suspended" : "Active";
    try {
      const response = await fetch("/api/admin/stats", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status.");
      }
      await loadStats();
    } catch (error) {
      console.error("Toggle status error:", error);
    }
  };

  const handleToggleRole = async (id) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;

    const newRole = target.role === "Admin" ? "User" : "Admin";
    try {
      const response = await fetch("/api/admin/stats", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, role: newRole }),
      });
      if (!response.ok) {
        throw new Error("Failed to update role.");
      }
      await loadStats();
    } catch (error) {
      console.error("Toggle role error:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`/api/admin/stats?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }
      await loadStats();
    } catch (error) {
      console.error("Delete user error:", error);
    }
  };

  // AI sandbox prompt generator
  const runTestPrompt = async (e) => {
    e.preventDefault();
    if (!playgroundQuery.trim()) return;
    setIsPlaying(true);
    setPlaygroundOutput("");

    // Simulate generation latency
    await new Promise((resolve) => setTimeout(resolve, 1800));

    setPlaygroundOutput(
      `[AI RESPONSE COMPILING UNDER ACTIVE INSTRUCTION]\n\nModel Provider: ${activeModel}\nPrompt Input: "${playgroundQuery}"\n\n- Week 1: Introduction to ${playgroundQuery}\n  * Description: Dive deep into fundamental architectures and toolchains.\n  * Resource 1 (Video): https://youtube.com/search?q=${encodeURIComponent(playgroundQuery)}\n  * Resource 2 (Article): Official Setup documentation.\n\n- Week 2: Advanced Integrations\n  * Description: Build state management hooks and performance tracers.\n  * Resource 1 (Project): Interactive Capstone Repository.`
    );
    setIsPlaying(false);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-black text-gray-100 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Graphic Lines */}
      <BackgroundLines className="flex items-center justify-center w-full absolute inset-0 flex-col" />

      {/* Admin Panel Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 max-w-5xl w-full backdrop-blur-xl bg-gray-900/60 border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl flex flex-col gap-6"
      >
        {/* Upper Vitals bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-5 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-900/50 px-3 py-1 rounded-full">
              Control Panel
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3 flex items-center gap-2">
              <Shield className="w-7 h-7 text-cyan-400" />
              <span>Admin Console</span>
            </h2>
          </div>

          {/* Real-time Status Badges */}
          <div className="flex flex-wrap gap-2.5 bg-gray-950/80 p-3 rounded-2xl border border-gray-850">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 border-r border-gray-850 pr-3.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>API Health:</span>
              <span className="font-bold text-white">99.9%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 border-r border-gray-850 px-3.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Latency:</span>
              <span className="font-bold text-white">220ms</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 pl-3.5">
              <Database className={`w-3.5 h-3.5 ${dbStatus.status === "connected" ? "text-emerald-400" : "text-rose-400"}`} />
              <span>Database:</span>
              <span className="font-bold text-white">{dbStatus.status === "connected" ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>

        {/* Dashboard layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="w-full md:w-52 shrink-0 bg-gray-950/80 border border-gray-850 p-4.5 rounded-2xl flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible">
            <button
              onClick={() => setActivePanel("overview")}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-xl cursor-pointer w-full text-left transition-all shrink-0 ${activePanel === "overview"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
            >
              <BarChart2 className="w-4 h-4 shrink-0" />
              <span>Overview Metrics</span>
            </button>

            <button
              onClick={() => setActivePanel("users")}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-xl cursor-pointer w-full text-left transition-all shrink-0 ${activePanel === "users"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>User Directory</span>
            </button>

            <button
              onClick={() => setActivePanel("ai-config")}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-xl cursor-pointer w-full text-left transition-all shrink-0 ${activePanel === "ai-config"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
            >
              <Settings2 className="w-4 h-4 shrink-0" />
              <span>AI Configuration</span>
            </button>

            <button
              onClick={() => setActivePanel("database")}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-xl cursor-pointer w-full text-left transition-all shrink-0 ${activePanel === "database"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>Database Health</span>
            </button>

            <button
              onClick={() => setActivePanel("logs")}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-xl cursor-pointer w-full text-left transition-all shrink-0 ${activePanel === "logs"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <span>Server Event Logs</span>
            </button>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 bg-gray-950/20 border border-gray-900 rounded-2xl p-6 overflow-y-auto max-h-125">
            <AnimatePresence mode="wait">
              {/* OVERVIEW PANEL */}
              {activePanel === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-gray-900">
                    <h3 className="text-base font-bold text-white">System Metrics Summary</h3>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                      <span>Live Updating</span>
                    </span>
                  </div>

                  {/* Overview Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-950/60 border border-gray-850 rounded-xl space-y-1">
                      <span className="text-3xs font-bold uppercase tracking-wider text-gray-500">Cumulative Registered Users</span>
                      <h4 className="text-xl font-black text-white">1,482</h4>
                      <p className="text-3xs text-emerald-400">+12% from last month</p>
                    </div>
                    <div className="p-4 bg-gray-950/60 border border-gray-850 rounded-xl space-y-1">
                      <span className="text-3xs font-bold uppercase tracking-wider text-gray-500">Syllabi Generates</span>
                      <h4 className="text-xl font-black text-white">5,104</h4>
                      <p className="text-3xs text-emerald-400">+18% this week</p>
                    </div>
                    <div className="p-4 bg-gray-950/60 border border-gray-850 rounded-xl space-y-1">
                      <span className="text-3xs font-bold uppercase tracking-wider text-gray-500">Accumulated API Expenses</span>
                      <h4 className="text-xl font-black text-white">$145.80</h4>
                      <p className="text-3xs text-gray-500">Optimization: cached 40%</p>
                    </div>
                    <div className="p-4 bg-gray-950/60 border border-gray-850 rounded-xl space-y-1">
                      <span className="text-3xs font-bold uppercase tracking-wider text-gray-500">Active Daily Students</span>
                      <h4 className="text-xl font-black text-white">340 / day</h4>
                      <p className="text-3xs text-blue-400">Peak hours: 14:00 - 18:00</p>
                    </div>
                  </div>

                  {/* SVG Bar Chart representing daily generated curricula */}
                  <div className="p-4 bg-gray-950/60 border border-gray-850 rounded-xl space-y-3">
                    <span className="text-xxs font-bold text-gray-300 block">Weekly Curriculum Generation Requests</span>
                    <div className="h-28 flex items-end justify-between gap-2.5 pt-4 px-2">
                      {[35, 45, 30, 60, 85, 55, 95].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                          <div
                            className="w-full bg-linear-to-t from-blue-600 to-cyan-400 rounded-t-md transition-all duration-1000"
                            style={{ height: `${val}%` }}
                          />
                          <span className="text-[9px] text-gray-500">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* USER DIRECTORY PANEL */}
              {activePanel === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-900 gap-3">
                    <h3 className="text-base font-bold text-white">User Directory Moderation</h3>
                    <div className="relative flex items-center bg-gray-950 border border-gray-850 rounded-xl px-3 py-1">
                      <Search className="w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search student..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="bg-transparent border-0 focus:ring-0 text-xs text-white placeholder:text-gray-650 outline-none w-36 ml-1.5"
                      />
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto border border-gray-850 rounded-xl bg-gray-950/40">
                    <table className="min-w-full divide-y divide-gray-850 text-left text-xs">
                      <thead className="bg-gray-950 text-gray-400">
                        <tr>
                          <th className="p-3">User Details</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-850">
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-900/40">
                            <td className="p-3">
                              <p className="font-bold text-white">{u.name}</p>
                              <p className="text-[10px] text-gray-500">{u.email}</p>
                            </td>
                            <td className="p-3">
                              <span className={`text-[10px] font-semibold ${u.role === "Admin" ? "text-cyan-400" : "text-gray-400"}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${u.status === "Active"
                                ? "bg-emerald-950/40 border-emerald-800 text-emerald-400"
                                : "bg-red-950/40 border-red-800 text-red-400"
                                }`}>
                                {u.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1.5">
                              <button
                                onClick={() => handleToggleRole(u.id)}
                                className="px-2 py-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded text-[10px] text-gray-300 cursor-pointer"
                              >
                                Toggle Role
                              </button>
                              <button
                                onClick={() => handleToggleStatus(u.id)}
                                className="px-2 py-1 bg-gray-900 hover:bg-gray-850 border border-gray-800 rounded text-[10px] text-gray-300 cursor-pointer"
                              >
                                {u.status === "Active" ? "Suspend" : "Activate"}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1 hover:text-red-400 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-gray-500 italic">No users matching query</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* AI CONTROL PANEL */}
              {activePanel === "ai-config" && (
                <motion.div
                  key="ai-config"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h3 className="text-base font-bold text-white pb-2 border-b border-gray-900">AI Recommendation Engine Controls</h3>

                  {/* LLM parameters config */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="model-select" className="text-xs font-semibold text-gray-300">Default Model routing</Label>
                      <select
                        id="model-select"
                        value={activeModel}
                        onChange={(e) => setActiveModel(e.target.value)}
                        className="bg-gray-950 border border-gray-850 text-gray-200 text-xs rounded-xl p-2 focus:outline-none"
                      >
                        <option value="gemini-flash">Gemini 1.5 Flash (Default)</option>
                        <option value="gemini-pro">Gemini 1.5 Pro (Precision)</option>
                        <option value="gemini-thinking">Gemini 2.0 Thinking (In-depth)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-semibold text-gray-300">Model Status</Label>
                      <div className="flex items-center gap-2 p-2 bg-gray-950/60 border border-gray-850 rounded-xl text-xxs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-gray-300 font-medium">API Route Verified & Operational</span>
                      </div>
                    </div>
                  </div>

                  {/* System Prompt tuning */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="sys-prompt" className="text-xs font-semibold text-gray-300">System Instruction Prompt</Label>
                    <textarea
                      id="sys-prompt"
                      rows={3}
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      className="bg-gray-950 border border-gray-850 text-xxs text-white rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono leading-relaxed"
                    />
                  </div>

                  {/* LLM Playground Sandbox */}
                  <div className="border border-gray-850 p-4 rounded-xl bg-gray-950/40 space-y-3">
                    <span className="text-xxs font-bold text-gray-300 flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Model Generation Playground Sandbox</span>
                    </span>
                    <form onSubmit={runTestPrompt} className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Test prompt query (e.g. 'Docker for Node.js')..."
                        value={playgroundQuery}
                        onChange={(e) => setPlaygroundQuery(e.target.value)}
                        className="bg-gray-950 border-gray-800 text-xs rounded-xl"
                      />
                      <Button
                        type="submit"
                        disabled={isPlaying}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 h-auto rounded-xl flex items-center gap-1.5 shrink-0"
                      >
                        {isPlaying ? (
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Run</span>
                            <Send className="w-3 h-3" />
                          </>
                        )}
                      </Button>
                    </form>

                    {/* Output frame */}
                    {playgroundOutput && (
                      <div className="p-3 bg-gray-950 border border-gray-900 rounded-xl text-3xs font-mono text-gray-400 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                        {playgroundOutput}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* DATABASE HEALTH PANEL */}
              {activePanel === "database" && (
                <motion.div
                  key="database"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-3 pb-2 border-b border-gray-900 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Database Health Monitor</h3>
                      <p className="text-xs text-gray-500">Track the current MongoDB connection status from the admin console.</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={loadDbStatus}
                      disabled={dbLoading}
                      className="border-gray-700 bg-gray-950/70 text-gray-100 hover:bg-gray-800"
                    >
                      {dbLoading ? "Checking..." : "Refresh"}
                    </Button>
                  </div>

                  <div className={`rounded-2xl border px-4 py-4 ${dbStatus.status === "connected" ? "border-emerald-800 bg-emerald-950/40" : "border-rose-800 bg-rose-950/40"}`}>
                    <div className="flex items-center gap-3">
                      <Database className={`h-5 w-5 ${dbLoading ? "animate-spin" : ""}`} />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {dbLoading ? "Checking database connection..." : dbStatus.status === "connected" ? "Database connection is healthy" : "Database connection is unavailable"}
                        </p>
                        <p className="text-xs text-gray-300">{dbStatus.message}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Status</p>
                      <p className="mt-2 text-lg font-bold text-white">{dbStatus.status}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Ready State</p>
                      <p className="mt-2 text-lg font-bold text-white">{dbStatus.readyState}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Latency</p>
                      <p className="mt-2 text-lg font-bold text-white">{dbStatus.latencyMs !== null ? `${dbStatus.latencyMs}ms` : "—"}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-gray-400">Registered users</span>
                      <span className="font-semibold text-white">{dbStatus.totalUsers}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                      <span className="text-gray-400">Stored syllabi</span>
                      <span className="font-semibold text-white">{dbStatus.totalSyllabi}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => router.push("/check-db")}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm py-3 rounded-xl"
                  >
                    Open full database checker
                  </Button>
                </motion.div>
              )}

              {/* EVENT LOGS PANEL */}
              {activePanel === "logs" && (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-gray-900">
                    <h3 className="text-base font-bold text-white">System Console Stream</h3>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Streaming Logs</span>
                    </span>
                  </div>

                  {/* Logs Screen */}
                  <div
                    ref={logsContainerRef}
                    className="bg-black/80 border border-gray-900 rounded-xl p-4.5 font-mono text-[10px] leading-relaxed text-gray-300 space-y-2.5 h-64 overflow-y-auto max-h-64 shadow-inner"
                  >
                    {logs.map((log, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <span className="text-gray-500 shrink-0 select-none">[{log.time}]</span>
                        <span className={`font-semibold shrink-0 select-none ${log.level === "ERROR"
                          ? "text-red-500"
                          : log.level === "WARN"
                            ? "text-yellow-500"
                            : "text-blue-400"
                          }`}>
                          {log.level}
                        </span>
                        <span className="text-gray-350">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
