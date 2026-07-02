"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, User, Settings, ShieldCheck, Moon, Palette } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsDialog({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("general");
  
  // Profile settings
  const [name, setName] = useState("Learner");
  const [email, setEmail] = useState("");
  
  // Model settings
  const [model, setModel] = useState("gemini-flash");
  const [temperature, setTemperature] = useState(0.7);

  // Preference settings
  const [accentColor, setAccentColor] = useState("cyan");

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Load existing profile from localStorage
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("coursify_user");
      if (stored) {
        try {
          const userObj = JSON.parse(stored);
          if (userObj.name) setName(userObj.name);
          if (userObj.email) setEmail(userObj.email);
        } catch (e) {
          console.error("Failed to parse user", e);
        }
      }
    }
  }, [isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg("");
    
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    try {
      // Save profile
      localStorage.setItem(
        "coursify_user",
        JSON.stringify({ name, email })
      );
      
      // Save specific preferences
      localStorage.setItem("coursify_model", model);
      localStorage.setItem("coursify_temp", temperature.toString());
      localStorage.setItem("coursify_accent", accentColor);
      
      setSuccessMsg("Settings updated successfully!");
      
      // Dispatch storage event to alert other components to re-read localStorage
      window.dispatchEvent(new Event("storage"));
      
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative z-50 w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[480px]"
          >
            {/* Sidebar Tabs */}
            <div className="w-full md:w-48 bg-gray-950/80 border-r border-gray-850 p-4 flex flex-row md:flex-col gap-1 md:gap-1.5 overflow-x-auto md:overflow-x-visible">
              <span className="hidden md:block text-xxs font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">
                Preferences
              </span>
              
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl cursor-pointer transition-colors w-full ${
                  activeTab === "general"
                    ? "bg-blue-600/90 text-white shadow-lg shadow-blue-500/10"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/60"
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>AI Model</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl cursor-pointer transition-colors w-full ${
                  activeTab === "profile"
                    ? "bg-blue-600/90 text-white shadow-lg shadow-blue-500/10"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/60"
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>Profile Settings</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("appearance")}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl cursor-pointer transition-colors w-full ${
                  activeTab === "appearance"
                    ? "bg-blue-600/90 text-white shadow-lg shadow-blue-500/10"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-900/60"
                }`}
              >
                <Palette className="w-4 h-4 shrink-0" />
                <span>Appearance</span>
              </button>
            </div>

            {/* Content Pane */}
            <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <h3 className="text-lg font-bold text-white capitalize flex items-center gap-2">
                    <Settings className="w-4.5 h-4.5 text-cyan-400" />
                    <span>{activeTab === "general" ? "AI Model Configuration" : activeTab === "profile" ? "Student Profile" : "Interface Customization"}</span>
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Success Alert */}
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    {successMsg}
                  </motion.div>
                )}

                {/* Tab Contents */}
                <div className="space-y-4">
                  {activeTab === "general" && (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="model-select" className="text-xs font-semibold text-gray-300">
                          Active recommendation model
                        </Label>
                        <select
                          id="model-select"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-800 text-gray-200 rounded-xl px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        >
                          <option value="gemini-flash">Gemini 1.5 Flash (Fast, responsive)</option>
                          <option value="gemini-pro">Gemini 1.5 Pro (Deep research, detailed path)</option>
                          <option value="gemini-thinking">Gemini 2.0 Flash-Thinking (Creative outline)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs">
                          <Label className="font-semibold text-gray-300">Creativity / Temperature</Label>
                          <span className="text-cyan-400 font-bold">{temperature}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.1"
                          value={temperature}
                          onChange={(e) => setTemperature(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500">
                          <span>Deterministic</span>
                          <span>Creative</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "profile" && (
                    <div className="space-y-3.5">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="pref-name" className="text-xs font-semibold text-gray-300">
                          Display Name
                        </Label>
                        <Input
                          id="pref-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your display name"
                          className="bg-gray-950/40 border-gray-800 focus:border-blue-500 rounded-xl py-4"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="pref-email" className="text-xs font-semibold text-gray-300">
                          Email Address
                        </Label>
                        <Input
                          id="pref-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="bg-gray-950/40 border-gray-800 focus:border-blue-500 rounded-xl py-4"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "appearance" && (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-gray-300">
                          Interface Theme
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            className="bg-gray-950 border border-blue-500 text-white rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Moon className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-semibold">Dark Mode (Active)</span>
                          </button>
                          <button
                            type="button"
                            disabled
                            className="bg-gray-950/40 border border-gray-850 text-gray-600 rounded-xl p-3 flex items-center justify-center gap-2 cursor-not-allowed"
                          >
                            <span>Light Mode (Soon)</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-gray-300">
                          Accent Color Palette
                        </Label>
                        <div className="flex gap-3">
                          {["cyan", "indigo", "emerald", "orange"].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setAccentColor(color)}
                              className={`w-8 h-8 rounded-full border cursor-pointer transition-all ${
                                color === "cyan" 
                                  ? "bg-cyan-500" 
                                  : color === "indigo" 
                                  ? "bg-indigo-500" 
                                  : color === "emerald" 
                                  ? "bg-emerald-500" 
                                  : "bg-orange-500"
                              } ${
                                accentColor === color 
                                  ? "ring-4 ring-blue-500/50 border-white scale-110" 
                                  : "border-transparent hover:scale-105"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-gray-800">
                <Button
                  onClick={onClose}
                  className="bg-transparent border border-gray-800 hover:bg-gray-850 text-gray-300 text-xs py-2 px-4 h-auto cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 h-auto cursor-pointer flex items-center gap-1.5 shadow-lg shadow-blue-500/10"
                >
                  {isSaving ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Save Changes</span>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
