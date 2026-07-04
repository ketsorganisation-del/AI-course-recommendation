"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState("login");
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const mode = searchParams.get("mode");
    const token = searchParams.get("token") || "";
    setResetToken(token);

    if (mode === "signup") {
      setView("signup");
    } else if (mode === "forgot") {
      setView("forgot");
    } else if (mode === "reset") {
      setView("reset");
    } else {
      setView("login");
    }
  }, [searchParams]);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isLogin = view === "login";
  const isSignup = view === "signup";
  const isForgot = view === "forgot";
  const isReset = view === "reset";

  const handleToggle = (nextView) => {
    setView(nextView);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (isForgot) {
      if (!email) {
        setError("Please enter your email address.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();
        if (!response.ok) {
          setError(result.error || "Unable to send a reset link. Please try again.");
        } else {
          setSuccess(result.message || "If an account exists, a reset link has been prepared.");
          if (result.resetToken) {
            router.push(`/auth?mode=reset&token=${encodeURIComponent(result.resetToken)}`);
          }
        }
      } catch (err) {
        console.error("Forgot password error:", err);
        setError("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (isReset) {
      if (!resetToken) {
        setError("Reset token is missing. Please request a new link.");
        setIsLoading(false);
        return;
      }

      if (!password || !confirmPassword) {
        setError("Please fill in both password fields.");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: resetToken, password }),
        });

        const result = await response.json();
        if (!response.ok) {
          setError(result.error || "Unable to reset your password.");
        } else {
          setSuccess("Password reset successful. You can now sign in.");
          setTimeout(() => {
            router.push("/auth?mode=login");
          }, 1200);
        }
      } catch (err) {
        console.error("Reset password error:", err);
        setError("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Form validation
    if (!email || !password) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (isSignup && !name) {
      setError("Please enter your name.");
      setIsLoading(false);
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        if (!response.ok) {
          setError(result.error || "Unable to login. Please try again.");
        } else {
          const user = result.user;
          localStorage.setItem(
            "coursify_user",
            JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role })
          );
          setSuccess("Login successful! Redirecting...");
          window.dispatchEvent(new Event("storage"));
          setTimeout(() => {
            router.push("/");
          }, 1000);
        }
      } else {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();
        if (!response.ok) {
          setError(result.error || "Unable to sign up. Please try again.");
        } else {
          const user = result.user;
          localStorage.setItem(
            "coursify_user",
            JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role })
          );
          setSuccess("Registration successful! Welcome to Coursify.");
          window.dispatchEvent(new Event("storage"));
          setTimeout(() => {
            router.push("/");
          }, 1500);
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-20 max-w-md w-full backdrop-blur-xl bg-gray-900/70 border border-gray-800 rounded-3xl p-8 shadow-[0_20px_50px_rgba(8,112,184,0.15)] flex flex-col gap-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-extrabold bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
          {isLogin ? "Welcome Back" : isForgot ? "Reset Password" : isReset ? "Set New Password" : "Create Account"}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          {isLogin ? "Simplify your learning journey with Coursify" : isForgot ? "We will help you create a new password securely" : isReset ? "Choose a strong password to continue" : "Start your personalized study journey today"}
        </p>
      </div>

      {/* Dynamic Tab Switcher */}
      {!isForgot && !isReset && (
        <div className="relative flex p-1 bg-gray-950 rounded-xl border border-gray-800/85">
          <button
            type="button"
            onClick={() => handleToggle("login")}
            className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg relative z-10 transition-colors duration-300 cursor-pointer ${isLogin ? "text-white" : "text-gray-400 hover:text-gray-200"
              }`}
          >
            Login
            {isLogin && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-blue-600/90 rounded-lg -z-10 shadow-lg"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => handleToggle("signup")}
            className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-lg relative z-10 transition-colors duration-300 cursor-pointer ${isSignup ? "text-white" : "text-gray-400 hover:text-gray-200"
              }`}
          >
            Sign Up
            {isSignup && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-blue-600/90 rounded-lg -z-10 shadow-lg"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        </div>
      )}

      {/* Error / Success Alerts */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-955/60 border border-red-800 text-red-300 px-4 py-3 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-955/60 border border-emerald-800 text-emerald-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
          >
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Forms */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {isSignup && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-1.5"
            >
              <Label htmlFor="name" className="text-xs font-semibold text-gray-300">
                Full Name
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <User className="h-4.5 w-4.5" />
                </span>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 bg-gray-950/40 border-gray-800 focus:border-blue-500 rounded-xl py-5"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isForgot && !isReset && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-gray-300">
              Email Address
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-11 bg-gray-955/40 border-gray-800 focus:border-blue-500 rounded-xl py-5"
              />
            </div>
          </div>
        )}

        {isForgot && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-gray-300">
              Email Address
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-11 bg-gray-955/40 border-gray-800 focus:border-blue-500 rounded-xl py-5"
              />
            </div>
          </div>
        )}

        {(!isForgot && !isReset) && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-gray-300">
              Password
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-11 pr-11 bg-gray-955/40 border-gray-800 focus:border-blue-500 rounded-xl py-5"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>
        )}

        {isReset && (
          <>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-gray-300">
                New Password
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11 pr-11 bg-gray-955/40 border-gray-800 focus:border-blue-500 rounded-xl py-5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-300">
                Confirm New Password
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-11 bg-gray-955/40 border-gray-800 focus:border-blue-500 rounded-xl py-5"
                />
              </div>
            </div>
          </>
        )}

        <AnimatePresence mode="wait">
          {isSignup && (
            <motion.div
              key="confirm-password-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-1.5"
            >
              <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-300">
                Confirm Password
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-11 bg-gray-955/40 border-gray-800 focus:border-blue-500 rounded-xl py-5"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLogin && (
          <div className="flex items-center justify-between text-xs mt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300 transition-colors">
              <input type="checkbox" className="rounded bg-gray-900 border-gray-800 text-blue-500 focus:ring-0" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => handleToggle("forgot")}
              className="text-blue-400 hover:underline transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        )}

        {isForgot && (
          <button
            type="button"
            onClick={() => handleToggle("login")}
            className="text-sm text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer text-left"
          >
            Back to sign in
          </button>
        )}

        {isReset && (
          <button
            type="button"
            onClick={() => handleToggle("login")}
            className="text-sm text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer text-left"
          >
            Back to sign in
          </button>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 py-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50 transition-all duration-300"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{isForgot ? "Send Reset Link" : isReset ? "Reset Password" : isLogin ? "Sign In" : "Sign Up"}</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-gray-400 mt-2">
        By continuing, you agree to Coursify's {" "}
        <a href="#" className="text-blue-400 hover:underline">
          Terms of Service
        </a>{" "}
        and {" "}
        <a href="#" className="text-blue-400 hover:underline">
          Privacy Policy
        </a>
        .
      </div>
    </motion.div>
  );
}

export default function AuthPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background line graphic effect */}
      <BackgroundLines className="flex items-center justify-center w-full absolute inset-0 flex-col" />

      {/* Wrapping in Suspense since useSearchParams is used */}
      <Suspense fallback={
        <div className="relative z-20 text-white flex flex-col items-center gap-2">
          <span className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading form...</p>
        </div>
      }>
        <AuthForm />
      </Suspense>
    </div>
  );
}
