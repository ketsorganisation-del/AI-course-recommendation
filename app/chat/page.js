"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Send, Sparkles, Plus, BookOpen, Clock, PlayCircle, FileText, CheckCircle2,
  ArrowLeft, Brain, Award, ChevronRight, MessageSquare, Trash2, HelpCircle,
  User, CheckSquare, Square, Search, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SettingsDialog from "@/components/settings-dialog";

// Initial Suggestion Cards
const SUGGESTIONS = [
  { icon: "⚛️", title: "React for Beginners", description: "Master components, hooks & state", query: "Learn React for beginners step by step" },
  { icon: "🐍", title: "Python for Data Science", description: "Learn NumPy, Pandas & Matplotlib", query: "Data science track using Python" },
  { icon: "🤖", title: "Machine Learning Essentials", description: "Regression, classification & neural networks", query: "Machine Learning syllabus from scratch" },
  { icon: "🎨", title: "Figma UI/UX Design", description: "Wireframes, prototyping & design systems", query: "Figma design roadmap" }
];

// Curated mock data generator based on prompt search terms
function getCurriculumData(topic) {
  const cleanTopic = topic.toLowerCase();

  if (cleanTopic.includes("react") || cleanTopic.includes("front") || cleanTopic.includes("web")) {
    return {
      title: "React & Frontend Development Roadmap",
      subtitle: "From Zero to Building Production React Apps",
      estimatedWeeks: 4,
      level: "Beginner to Intermediate",
      author: "Coursify AI Agent",
      outline: [
        {
          week: "Week 1",
          topic: "HTML, CSS & Modern JavaScript Fundamentals",
          details: "Master ES6+ syntax (destructuring, arrow functions, promises), DOM manipulation, and responsive flexbox layouts.",
          completed: false,
          resources: [
            { type: "video", title: "Modern JavaScript Tutorial", duration: "1h 45m", source: "YouTube (freeCodeCamp)", link: "https://youtube.com" },
            { type: "article", title: "MDN Web Docs - JavaScript Guide", duration: "25m read", source: "MDN Docs", link: "https://developer.mozilla.org" }
          ]
        },
        {
          week: "Week 2",
          topic: "Introduction to React Core Concepts",
          details: "Learn JSX, Component Architecture, Props, State, and handling User Interactions.",
          completed: false,
          resources: [
            { type: "video", title: "React Beginners Crash Course", duration: "2h 10m", source: "YouTube (Programming with Mosh)", link: "https://youtube.com" },
            { type: "project", title: "Build a Task Organizer App", duration: "Hands-on project", source: "Coursify Labs", link: "#" }
          ]
        },
        {
          week: "Week 3",
          topic: "Hooks & Component Lifecycle",
          details: "Master useEffect for API requests, useContext for global themes, and useRef for DOM selection.",
          completed: false,
          resources: [
            { type: "video", title: "Deep Dive: React Hooks Explained", duration: "45m", source: "YouTube (Academind)", link: "https://youtube.com" },
            { type: "article", title: "React Dev - Synchronizing with Effects", duration: "15m read", source: "React.dev", link: "https://react.dev" }
          ]
        },
        {
          week: "Week 4",
          topic: "State Management & Next.js Framework",
          details: "Introduction to Tailwind CSS styling, Zustand state management, and Server Side Rendering with Next.js App Router.",
          completed: false,
          resources: [
            { type: "video", title: "Next.js 15 Full Tutorial", duration: "3h 15m", source: "YouTube (JS Mastery)", link: "https://youtube.com" },
            { type: "project", title: "E-Commerce Frontend Showcase", duration: "Capstone project", source: "Coursify Capstone", link: "#" }
          ]
        }
      ]
    };
  }

  if (cleanTopic.includes("machine") || cleanTopic.includes("learn") || cleanTopic.includes("ml") || cleanTopic.includes("data science") || cleanTopic.includes("ai")) {
    return {
      title: "Foundations of Machine Learning",
      subtitle: "A Mathematical and Practical Guide to Artificial Intelligence",
      estimatedWeeks: 5,
      level: "Intermediate (Python required)",
      author: "Coursify AI Agent",
      outline: [
        {
          week: "Week 1",
          topic: "Prerequisite Mathematics & Python Tools",
          details: "Review linear algebra (matrices, vectors), calculus derivatives, and basic statistics. Set up Jupyter notebooks with NumPy and Pandas.",
          completed: false,
          resources: [
            { type: "video", title: "Essence of Linear Algebra", duration: "2h (series)", source: "YouTube (3Blue1Brown)", link: "https://youtube.com" },
            { type: "article", title: "Pandas Cheat Sheet for Data Science", duration: "10m read", source: "Towards Data Science", link: "https://medium.com" }
          ]
        },
        {
          week: "Week 2",
          topic: "Supervised Learning: Regression",
          details: "Understand cost functions, gradient descent, linear regression, and polynomial features.",
          completed: false,
          resources: [
            { type: "video", title: "Machine Learning: Linear Regression", duration: "1h 12m", source: "Coursera (Andrew Ng)", link: "https://coursera.org" },
            { type: "project", title: "House Pricing Predictor", duration: "Hands-on project", source: "Kaggle Dataset", link: "https://kaggle.com" }
          ]
        },
        {
          week: "Week 3",
          topic: "Supervised Learning: Classification & SVMs",
          details: "Explore Logistic Regression, Decision Trees, Random Forests, and Support Vector Machines.",
          completed: false,
          resources: [
            { type: "video", title: "Decision Trees & Random Forests Explained", duration: "35m", source: "YouTube (StatQuest)", link: "https://youtube.com" },
            { type: "article", title: "Intro to SVM Hyperplanes", duration: "15m read", source: "Analytics Vidhya", link: "https://analyticsvidhya.com" }
          ]
        },
        {
          week: "Week 4",
          topic: "Unsupervised Learning & Clustering",
          details: "Understand K-means clustering, Principal Component Analysis (PCA) for dimensional reduction, and anomaly detection.",
          completed: false,
          resources: [
            { type: "video", title: "K-Means Clustering Tutorial", duration: "25m", source: "YouTube (Sentdex)", link: "https://youtube.com" }
          ]
        },
        {
          week: "Week 5",
          topic: "Deep Learning & Neural Networks",
          details: "Build and train a simple neural network using PyTorch to classify handwritten digits.",
          completed: false,
          resources: [
            { type: "video", title: "PyTorch for Beginners", duration: "4h", source: "YouTube (freeCodeCamp)", link: "https://youtube.com" },
            { type: "project", title: "Digit Recognizer Capstone", duration: "Capstone project", source: "MNIST Database", link: "#" }
          ]
        }
      ]
    };
  }

  // Fallback dynamic generator
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  return {
    title: `${capitalizedTopic} Custom Learning Path`,
    subtitle: `AI-Compiled Curriculum for mastering ${capitalizedTopic}`,
    estimatedWeeks: 3,
    level: "All Levels Welcome",
    author: "Coursify AI Agent",
    outline: [
      {
        week: "Week 1",
        topic: `Fundamentals of ${capitalizedTopic}`,
        details: `Introduction to core definitions, environment setup, and basic syntax/principles of ${capitalizedTopic}.`,
        completed: false,
        resources: [
          { type: "video", title: `Introduction to ${capitalizedTopic}`, duration: "45m", source: "YouTube Search", link: "https://youtube.com" },
          { type: "article", title: `Getting Started with ${capitalizedTopic}`, duration: "10m read", source: "Official Docs", link: "#" }
        ]
      },
      {
        week: "Week 2",
        topic: "Core Abstractions & Practical Building Blocks",
        details: `Work with structured exercises, explore common tools/libraries, and build first-stage mockups.`,
        completed: false,
        resources: [
          { type: "video", title: `${capitalizedTopic} Intermediate Concepts`, duration: "1h 15m", source: "Udemy Free Tier", link: "https://udemy.com" },
          { type: "project", title: "Interactive Workshop Practice", duration: "Hands-on project", source: "GitHub Starter Template", link: "#" }
        ]
      },
      {
        week: "Week 3",
        topic: "Advanced Integrations & Production Deployment",
        details: `Optimize workflow performance, explore industry-standard debugging patterns, and publish a capstone assignment.`,
        completed: false,
        resources: [
          { type: "article", title: `Advanced Optimization in ${capitalizedTopic}`, duration: "20m read", source: "Medium article", link: "#" },
          { type: "project", title: "Complete Deployment Capstone", duration: "Final evaluation", source: "Vercel / GitHub", link: "#" }
        ]
      }
    ]
  };
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef(null);

  // States
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: "1", title: "React & Next.js Path", active: false },
    { id: "2", title: "Python Data Science", active: false }
  ]);
  const [userName, setUserName] = useState("Learner");
  const [userId, setUserId] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [revealedRecommendations, setRevealedRecommendations] = useState([]);
  const [typingRecommendationIndex, setTypingRecommendationIndex] = useState(null);
  const revealTimersRef = useRef([]);
  const messageTypeIntervalRef = useRef(null);

  // Read login state and initial query
  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem("coursify_user");
      if (stored) {
        try {
          const userObj = JSON.parse(stored);
          if (userObj.name) {
            setUserName(userObj.name);
          }
          setUserId(userObj.id || null);
        } catch (e) {
          console.error("Failed to parse stored user", e);
          setUserName("Learner");
          setUserId(null);
        }
      } else {
        setUserName("Learner");
        setUserId(null);
      }
    };

    checkUser();
    window.addEventListener("storage", checkUser);

    const query = searchParams.get("q");
    if (query) {
      triggerBotResponse(query);
    }

    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, [searchParams]);

  // Scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      revealTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      revealTimersRef.current = [];
      if (messageTypeIntervalRef.current) {
        window.clearInterval(messageTypeIntervalRef.current);
        messageTypeIntervalRef.current = null;
      }
    };
  }, []);

  // Trigger simulated AI response
  const triggerBotResponse = async (promptText) => {
    // User message
    const userMsg = { id: Date.now().toString(), sender: "user", text: promptText };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Save prompt to history list if it's new
    const trimmedTitle = promptText.length > 25 ? promptText.slice(0, 25) + "..." : promptText;
    setChatHistory((prev) => {
      // Check if already exists to prevent duplicate entries
      if (prev.some((c) => c.title.toLowerCase() === trimmedTitle.toLowerCase())) return prev;
      return [{ id: Date.now().toString(), title: trimmedTitle, active: true }, ...prev];
    });

    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let serverRecommendations = [];
    try {
      const response = await fetch(`/api/recommendations?q=${encodeURIComponent(promptText)}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data.recommendations)) {
        serverRecommendations = data.recommendations;
      }
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
    }

    setRecommendations(serverRecommendations);
    setRevealedRecommendations([]);
    setTypingRecommendationIndex(null);
    revealTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    revealTimersRef.current = [];
    if (messageTypeIntervalRef.current) {
      window.clearInterval(messageTypeIntervalRef.current);
      messageTypeIntervalRef.current = null;
    }

    const curriculum = getCurriculumData(promptText);
    curriculum.query = promptText;
    curriculum.recommendations = serverRecommendations;
    curriculum.title = serverRecommendations.length > 0
      ? `Recommended Courses for ${promptText}`
      : curriculum.title;
    curriculum.subtitle = serverRecommendations.length > 0
      ? `Top matches from the server recommendation engine for "${promptText}"`
      : curriculum.subtitle;
    curriculum.estimatedWeeks = serverRecommendations.length > 0 ? 1 : curriculum.estimatedWeeks;
    curriculum.level = serverRecommendations.length > 0 ? "Server-powered recommendations" : curriculum.level;

    setIsTyping(false);
    const textMsgId = (Date.now() + 1).toString();
    const fullBotText = serverRecommendations.length > 0
      ? `I found ${serverRecommendations.length} matching courses for "${promptText}" from the server.`
      : `I couldn’t find matching courses for "${promptText}" right now.`;
    const botTextMsg = {
      id: textMsgId,
      sender: "bot",
      text: "",
      roadmap: curriculum,
    };

    setMessages((prev) => [...prev, botTextMsg]);
    setActiveRoadmap(curriculum);

    let typedChars = 0;
    messageTypeIntervalRef.current = window.setInterval(() => {
      setMessages((prev) => prev.map((msg) => msg.id === textMsgId ? { ...msg, text: fullBotText.slice(0, typedChars + 1) } : msg));
      typedChars += 1;

      if (typedChars >= fullBotText.length) {
        window.clearInterval(messageTypeIntervalRef.current);
        messageTypeIntervalRef.current = null;
      }
    }, 24);

    window.setTimeout(() => {
      if (serverRecommendations.length > 0) {
        serverRecommendations.forEach((_, index) => {
          const typingTimer = window.setTimeout(() => {
            setTypingRecommendationIndex(index);
          }, 700 + index * 800);

          const revealTimer = window.setTimeout(() => {
            setRevealedRecommendations((prev) => [...prev, serverRecommendations[index]]);
            setTypingRecommendationIndex(null);
          }, 1200 + index * 800);

          revealTimersRef.current.push(typingTimer, revealTimer);
        });
      }
    }, fullBotText.length * 24 + 250);

    if (userId) {
      saveRoadmap(curriculum);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const q = inputValue;
    setInputValue("");
    triggerBotResponse(q);
  };

  const saveRoadmap = async (roadmap) => {
    if (!userId) {
      setSaveStatus("Login to save your roadmap.");
      return;
    }

    if (!roadmap || !roadmap.title) {
      return;
    }

    setSaveLoading(true);
    setSaveStatus("");

    try {
      const response = await fetch("/api/syllabi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title: roadmap.title,
          subtitle: roadmap.subtitle,
          query: roadmap.query,
          estimatedWeeks: roadmap.estimatedWeeks,
          level: roadmap.level,
          outline: roadmap.outline,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to save roadmap.");
      }

      setSaveStatus("Roadmap saved to your library.");
    } catch (error) {
      console.error("Save roadmap error:", error);
      setSaveStatus("Failed to save roadmap. Please try again.");
    } finally {
      setSaveLoading(false);
      window.setTimeout(() => setSaveStatus(""), 4000);
    }
  };

  // Toggle chapter completion
  const handleToggleWeek = (msgIndex, weekIndex) => {
    setMessages((prev) => {
      const copy = [...prev];
      const msg = { ...copy[msgIndex] };
      if (msg.roadmap && msg.roadmap.outline) {
        const outlineCopy = [...msg.roadmap.outline];
        outlineCopy[weekIndex] = {
          ...outlineCopy[weekIndex],
          completed: !outlineCopy[weekIndex].completed
        };
        msg.roadmap = { ...msg.roadmap, outline: outlineCopy };
        copy[msgIndex] = msg;

        // Sync with active display
        if (activeRoadmap && activeRoadmap.title === msg.roadmap.title) {
          setActiveRoadmap(msg.roadmap);
        }
      }
      return copy;
    });
  };

  const deleteHistory = (id, e) => {
    e.stopPropagation();
    setChatHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveRoadmap(null);
    router.push("/chat");
  };

  return (
    <div className="flex min-h-screen bg-black text-gray-100 font-sans pt-18">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-gray-950/90 border-r border-gray-900 flex-col justify-between hidden md:flex shrink-0">
        <div className="p-4 flex flex-col gap-4 overflow-y-auto">
          {/* New Chat Button */}
          <Button
            onClick={startNewChat}
            className="w-full justify-start gap-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white rounded-xl py-5 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>New Study Path</span>
          </Button>

          {/* Search filter in Sidebar */}
          <div className="relative flex items-center bg-gray-900 border border-gray-850 rounded-xl px-3 py-1.5 focus-within:border-cyan-500/50">
            <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchHistoryQuery}
              onChange={(e) => setSearchHistoryQuery(e.target.value)}
              className="bg-transparent border-0 focus:ring-0 text-xs text-white placeholder:text-gray-600 outline-none w-full ml-2"
            />
          </div>

          {/* History Section */}
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
              Recent Paths
            </span>
            <div className="flex flex-col gap-1.5">
              {chatHistory
                .filter((item) => item.title.toLowerCase().includes(searchHistoryQuery.toLowerCase()))
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => triggerBotResponse(`Master ${item.title}`)}
                    className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-900 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MessageSquare className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
                      <span className="text-sm truncate text-gray-300 group-hover:text-white">
                        {item.title}
                      </span>
                    </div>
                    <button
                      onClick={(e) => deleteHistory(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 rounded transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              {chatHistory.filter((item) => item.title.toLowerCase().includes(searchHistoryQuery.toLowerCase())).length === 0 && (
                <p className="text-xs text-gray-650 px-2 mt-1 italic">No roadmaps match</p>
              )}
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-gray-900 bg-gray-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-white text-xs shadow-inner">
              {userName[0].toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-gray-200 truncate">{userName}</span>
              <span className="text-xxs text-gray-500 truncate">Coursify Student</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-gray-500 hover:text-cyan-400 p-1.5 rounded-lg transition-colors cursor-pointer animate-none bg-transparent border-0 outline-none"
            >
              <Settings className="w-4 h-4" />
            </button>
            <Brain className="w-4 h-4 text-cyan-400 animate-pulse hidden" />
          </div>
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col justify-between relative bg-radial-at-t from-gray-900 via-black to-black">
        {/* Top bar */}
        <div className="md:hidden p-4 border-b border-gray-900 bg-gray-950 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>
          <span className="font-bold text-cyan-400 text-sm">Coursify Chat</span>
          <Button
            onClick={startNewChat}
            className="p-2 h-auto rounded-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 space-y-6 max-w-4xl w-full mx-auto">
          {messages.length === 0 ? (
            /* Welcome / Initial empty state */
            <div className="flex flex-col justify-center items-center h-full text-center py-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-3xl bg-linear-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
              >
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Design Your Learning Journey
              </h2>
              <p className="mt-2 text-gray-400 max-w-md text-sm">
                Enter a topic, job title, or skill you want to acquire. We’ll build a personalized study guide for you.
              </p>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full max-w-2xl">
                {SUGGESTIONS.map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    onClick={() => triggerBotResponse(card.query)}
                    className="p-4 bg-gray-900/40 hover:bg-gray-900/80 border border-gray-800/80 rounded-2xl cursor-pointer text-left hover:border-cyan-500/40 transition-all duration-300 group flex items-start gap-3.5 shadow-md shadow-black/10"
                  >
                    <span className="text-2xl mt-0.5">{card.icon}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            /* Render messages */
            <div className="space-y-8">
              {messages.map((msg, msgIdx) => (
                <div key={msg.id} className="flex flex-col gap-4">
                  {/* Sender Label */}
                  <div className={`flex items-center gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "bot" && (
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {msg.sender === "user" ? userName : "Coursify AI"}
                    </span>
                    {msg.sender === "user" && (
                      <div className="w-6 h-6 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center">
                        <User className="w-3 h-3 text-blue-400" />
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-3xl rounded-2xl px-5 py-4 text-sm leading-relaxed ${msg.sender === "user"
                        ? "bg-blue-600/90 text-white rounded-br-none shadow-md shadow-blue-600/10"
                        : "bg-gray-900/60 border border-gray-800 text-gray-200 rounded-bl-none shadow-md"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Roadmap Widget (If attached to message) */}
                  {msg.sender === "bot" && msg.roadmap && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-2 bg-gray-900/40 border border-gray-900 rounded-3xl p-6 shadow-2xl space-y-6"
                    >
                      {/* Roadmap Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800/80 pb-5 gap-4">
                        <div>
                          <span className="text-xxs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950 border border-cyan-900/80 px-2.5 py-1 rounded-full">
                            Server Recommendations
                          </span>
                          <h3 className="text-xl font-bold text-white mt-3">
                            {msg.roadmap.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1 italic">
                            {msg.roadmap.subtitle}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <Button
                            onClick={() => saveRoadmap(msg.roadmap)}
                            disabled={saveLoading}
                            className="bg-cyan-500 hover:bg-cyan-600 text-black rounded-xl px-4 py-2 text-xs font-semibold"
                          >
                            {saveLoading ? "Saving..." : "Save Recommendations"}
                          </Button>
                          {saveStatus && (
                            <span className="text-xxs text-cyan-300">{saveStatus}</span>
                          )}
                        </div>
                      </div>

                      {msg.roadmap.recommendations && msg.roadmap.recommendations.length > 0 && (
                        <div className="bg-gray-950/50 border border-gray-850 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Recommended Courses</span>
                            <span className="text-2xs text-gray-500">Directly from the server</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {msg.roadmap.recommendations.map((course, index) => {
                              const isVisible = index < revealedRecommendations.length;
                              const isTypingThis = typingRecommendationIndex === index;
                              return (
                                <div key={`${course.title}-${index}`} className="space-y-2">
                                  {isTypingThis && (
                                    <div className="flex justify-start">
                                      <div className="rounded-2xl border border-gray-800 bg-gray-900/70 px-3 py-2 text-xs text-gray-400 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" />
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200" />
                                        <span>Bot is preparing this recommendation</span>
                                      </div>
                                    </div>
                                  )}
                                  <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 12 }}
                                    transition={{ duration: 0.25, delay: index * 0.08 }}
                                    className="rounded-xl border border-gray-800 bg-gray-900/70 p-3"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <p className="text-sm font-semibold text-white">{course.title}</p>
                                        <p className="text-2xs text-gray-500 mt-1">{course.category || "Course"}</p>
                                      </div>
                                      <span className="text-2xs rounded-full bg-cyan-950 px-2 py-1 text-cyan-400">
                                        {course.rating}/5
                                      </span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2 text-2xs text-gray-400">
                                      {course.university ? (
                                        <span className="rounded-full border border-gray-800 bg-gray-950/70 px-2 py-1">{course.university}</span>
                                      ) : null}
                                      {course.students ? (
                                        <span className="rounded-full border border-gray-800 bg-gray-950/70 px-2 py-1">{course.students} studying</span>
                                      ) : null}
                                    </div>
                                    <p className="text-2xs text-gray-500 mt-2">Similarity score: {course.score}</p>
                                  </motion.div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {(!msg.roadmap.recommendations || msg.roadmap.recommendations.length === 0) && (
                        <div className="rounded-2xl border border-gray-800 bg-gray-950/50 p-4 text-sm text-gray-400">
                          No recommendations were returned for this request.
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}

              {/* Bot typing state */}
              {isTyping && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 justify-start">
                    <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Coursify AI
                    </span>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-900/60 border border-gray-800 text-gray-200 rounded-2xl rounded-bl-none px-5 py-4 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200" />
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* INPUT PROMPT FORM */}
        <div className="p-4 border-t border-gray-900 bg-gray-950/80 backdrop-blur-sm sticky bottom-0">
          <form
            onSubmit={handleSend}
            className="max-w-4xl w-full mx-auto flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-2xl p-1.5 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-950 transition-all duration-300"
          >
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask for a study topic (e.g., 'React Hooks', 'Fullstack Python', 'Kubernetes')"
              className="bg-transparent border-0 focus:ring-0 focus-visible:ring-0 text-white placeholder:text-gray-500 h-10 px-3 text-sm flex-1"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-cyan-500 hover:bg-cyan-600 text-black cursor-pointer rounded-xl h-10 w-10 flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="max-w-4xl w-full mx-auto text-3xs text-gray-500 text-center mt-2.5">
            Coursify can compile content from multiple web resources. Double check critical resources.
          </div>
        </div>
      </div>

      {/* Settings Dialog Overlay */}
      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
        <span className="text-sm text-gray-400">Initializing study workspace...</span>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
