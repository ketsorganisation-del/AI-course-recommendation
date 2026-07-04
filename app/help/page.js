"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, ChevronDown, ChevronUp, Search, Mail, MessageSquare, BookOpen, Send, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const FAQS = [
  {
    q: "What is Coursify?",
    a: "Coursify is an AI-powered personalized content recommender. It takes a learning goal (e.g., 'React basics' or 'Machine Learning') and compiles a comprehensive week-by-week syllabus featuring top-rated video links, reading docs, and hands-on capstone projects."
  },
  {
    q: "Is Coursify free to use?",
    a: "Yes! Coursify searches and aggregates free high-quality educational resources from open platforms like YouTube, MDN, Kaggle, and official documentation libraries. You do not need any paid subscriptions to complete the paths."
  },
  {
    q: "How does the AI model build study tracks?",
    a: "Our system matches your search terms against cataloged structures of standard academic programs and industry certifications. It then gathers relevant learning resources and compiles estimated learning hours."
  },
  {
    q: "Can I customize the generated study plans?",
    a: "Yes. Once a plan is generated, you can use the chat interface to submit follow-up prompts (e.g., 'Can you explain week 2 in detail?' or 'Add a quiz about components'). The planner will adapt and expand the study path dynamically."
  },
  {
    q: "Where is my learning progress saved?",
    a: "Your checked-off timeline checkpoints, active chat sessions, and user profiles are stored locally in your browser's secure cache (`localStorage`). This keeps your study metrics personal, private, and loadable instantly."
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  // Contact Form states
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!email || !msg) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
    setEmail("");
    setMsg("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-100 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      {/* Background line graphic effect */}
      <BackgroundLines className="flex items-center justify-center w-full absolute inset-0 flex-col" />

      {/* Main Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 max-w-5xl w-full backdrop-blur-xl bg-gray-900/60 border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-8"
      >
        {/* Left Side: Search & FAQ Accordion */}
        <div className="flex-1 space-y-6">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-900/50 px-3 py-1 rounded-full">
              Support Desk
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3">
              How can we help?
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Search frequently asked questions or submit a question to the support inbox.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative flex items-center bg-gray-950/60 border border-gray-800 rounded-xl focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-950/50 transition-all">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5" />
            <Input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-transparent border-0 focus:ring-0 focus-visible:ring-0 text-white placeholder:text-gray-500 text-sm h-10 w-full"
            />
          </div>

          {/* FAQ Accordion list */}
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-gray-950/40 border border-gray-850 rounded-2xl overflow-hidden transition-colors hover:border-gray-800"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-4.5 text-left text-sm font-bold text-gray-200 hover:text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4.5 pb-4.5 text-xs text-gray-400 leading-relaxed border-t border-gray-900/60 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <p className="text-xs text-gray-500 py-6 text-center italic">
                No matching articles found. Try another keywords search.
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Quick Ticket Request */}
        <div className="w-full md:w-80 shrink-0 bg-gray-950/80 border border-gray-850 rounded-2xl p-6 flex flex-col gap-5 self-start">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-900">
            <Mail className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Ask a Question</h3>
          </div>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-950/60 border border-emerald-900 text-emerald-300 p-4 rounded-xl text-xs flex flex-col items-center justify-center text-center gap-2 py-8"
            >
              <ShieldCheck className="w-8 h-8 text-emerald-400 animate-bounce" />
              <span className="font-bold">Ticket Submitted</span>
              <p className="text-gray-400 text-xxs mt-1">Our support agent will respond to your email shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSupportSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="support-email" className="text-xxs font-bold text-gray-400 uppercase tracking-wider">
                  Your Email
                </label>
                <Input
                  id="support-email"
                  type="email"
                  placeholder="name@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-900 border-gray-800 text-xs focus:border-blue-500 rounded-xl"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="support-msg" className="text-xxs font-bold text-gray-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  id="support-msg"
                  rows={4}
                  placeholder="Detail your question..."
                  required
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="bg-gray-900 border border-gray-800 text-xs focus:border-blue-500 rounded-xl p-3 text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-blue-900/50"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-4.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Query</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="flex flex-col gap-3 border-t border-gray-900 pt-3">
            <Link href="/check-db" className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-900/50 bg-cyan-950/60 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-900/70">
              <ShieldCheck className="h-3.5 w-3.5" />
              Check database status
            </Link>

            <div className="flex items-center justify-between text-xxs text-gray-500">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-gray-600" />
                <span>Response: ~2h</span>
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-gray-600" />
                <span>Guides: 12</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
