"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { Sparkles, Compass, CheckCircle2, Bookmark, ArrowRight, Library, Users } from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: <Compass className="w-6 h-6 text-cyan-400" />,
    title: "Personalized Paths",
    description: "Input any goal—from beginner programming to mastering deep neural networks—and receive a structured, week-by-week curriculum custom-tailored to you."
  },
  {
    icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
    title: "AI Resource Aggregator",
    description: "No more searching through endless sites. We compile the highest-rated free YouTube videos, official documentation guides, and hands-on projects."
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
    title: "Interactive Checkpoints",
    description: "Check off your completed lessons to visualize your learning timeline. Watch your progress gauge automatically update as you level up."
  },
  {
    icon: <Bookmark className="w-6 h-6 text-orange-400" />,
    title: "Saved Library Store",
    description: "Keep track of active paths and catalog completed certifications. Save your customized roadmaps to your workspace database for seamless access."
  }
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-black text-gray-100 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      {/* Background line graphic effect */}
      <BackgroundLines className="flex items-center justify-center w-full absolute inset-0 flex-col" />

      {/* Main card panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 max-w-4xl w-full backdrop-blur-xl bg-gray-900/60 border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col gap-10"
      >
        {/* Header Block */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-900/50 px-3 py-1 rounded-full">
            Our Mission
          </span>
          <h2 className="text-4xl font-extrabold bg-linear-to-r from-orange-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent leading-tight pt-2">
            Recommending Knowledge. Simply.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Coursify is an advanced, personalized content recommendation workspace designed to clear the noise of learning online. We synthesize custom structured timelines tailored to your pace.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {FEATURES.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="p-6 bg-gray-950/40 hover:bg-gray-950/80 border border-gray-850 rounded-2xl flex items-start gap-4 transition-all duration-300 group hover:border-gray-700"
            >
              <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats segment */}
        <div className="grid grid-cols-3 gap-4 border-t border-b border-gray-800/80 py-8 text-center bg-gray-950/20 rounded-2xl">
          <div>
            <h4 className="text-2xl font-black text-cyan-400">10k+</h4>
            <p className="text-xxs text-gray-500 uppercase tracking-widest mt-1">Recommended Videos</p>
          </div>
          <div>
            <h4 className="text-2xl font-black text-indigo-400">5k+</h4>
            <p className="text-xxs text-gray-500 uppercase tracking-widest mt-1">Syllabi Compiled</p>
          </div>
          <div>
            <h4 className="text-2xl font-black text-emerald-400">99.8%</h4>
            <p className="text-xxs text-gray-500 uppercase tracking-widest mt-1">Satisfaction Rate</p>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-linear-to-r from-blue-950/30 to-indigo-950/30 border border-blue-900/30 rounded-2xl p-6">
          <div className="text-left">
            <h3 className="text-base font-bold text-white">Ready to construct your curriculum?</h3>
            <p className="text-xs text-gray-400 mt-1">Start a conversation with our recommender today.</p>
          </div>
          <Button
            onClick={() => router.push("/chat")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-5 px-5 h-auto rounded-xl flex items-center gap-1.5 shrink-0 shadow-lg shadow-blue-500/10 cursor-pointer transition-transform hover:scale-103"
          >
            <span>Ask Coursify</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
