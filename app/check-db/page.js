"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, CheckCircle2, DatabaseZap, RefreshCw } from "lucide-react";

const statusStyles = {
    connected: {
        badge: "border-emerald-800 bg-emerald-950/70 text-emerald-300",
        icon: CheckCircle2,
    },
    error: {
        badge: "border-rose-800 bg-rose-950/70 text-rose-300",
        icon: AlertCircle,
    },
    connecting: {
        badge: "border-amber-800 bg-amber-950/70 text-amber-300",
        icon: RefreshCw,
    },
    default: {
        badge: "border-gray-800 bg-gray-950/70 text-gray-300",
        icon: DatabaseZap,
    },
};

export default function CheckDbPage() {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const runCheck = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/db/check", { cache: "no-store" });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "The database check failed.");
            }

            setResult(data);
        } catch (err) {
            setError(err.message || "Could not reach the database status API.");
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        runCheck();
    }, []);

    const statusKey = result?.status || (loading ? "connecting" : "default");
    const statusConfig = statusStyles[statusKey] || statusStyles.default;
    const Icon = statusConfig.icon;
    const isConnected = result?.status === "connected";

    return (
        <div className="relative min-h-screen bg-black text-gray-100 flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
            <BackgroundLines className="absolute inset-0 flex items-center justify-center w-full flex-col" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="relative z-20 w-full max-w-3xl rounded-3xl border border-gray-800 bg-gray-900/70 p-8 shadow-2xl backdrop-blur-xl md:p-10"
            >
                <div className="mb-6 flex items-center justify-between gap-3">
                    <Link href="/help" className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Help
                    </Link>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={runCheck}
                        disabled={loading}
                        className="border-gray-700 bg-gray-950/70 text-gray-100 hover:bg-gray-800"
                    >
                        {loading ? "Checking..." : "Refresh"}
                    </Button>
                </div>

                <div className="space-y-6">
                    <div>
                        <span className="rounded-full border border-cyan-900/50 bg-cyan-950/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                            Database health
                        </span>
                        <h1 className="mt-3 text-3xl font-extrabold text-white">Check your MongoDB connection</h1>
                        <p className="mt-2 text-sm text-gray-400">
                            Verify that the application can reach the database and view basic counts for users and syllabi.
                        </p>
                    </div>

                    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${statusConfig.badge}`}>
                        <Icon className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                        <div>
                            <p className="text-sm font-semibold">
                                {loading
                                    ? "Checking database connection..."
                                    : isConnected
                                        ? "Database connection is healthy"
                                        : error
                                            ? "Database connection failed"
                                            : "Database status is available"}
                            </p>
                            <p className="text-xs opacity-80">
                                {error || (result?.message || "The latest status was fetched successfully.")}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Status</p>
                            <p className="mt-2 text-lg font-bold text-white">{result?.status || "checking"}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Users</p>
                            <p className="mt-2 text-lg font-bold text-white">{result?.totalUsers ?? "—"}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Syllabi</p>
                            <p className="mt-2 text-lg font-bold text-white">{result?.totalSyllabi ?? "—"}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-5">
                        <h2 className="text-sm font-semibold text-white">Connection details</h2>
                        <div className="mt-3 space-y-2 text-sm text-gray-400">
                            <div className="flex items-center justify-between gap-4">
                                <span>Database name</span>
                                <span className="font-medium text-gray-200">{result?.databaseName || "Unavailable"}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span>Ready state</span>
                                <span className="font-medium text-gray-200">{result?.readyState ?? "Unknown"}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span>Response time</span>
                                <span className="font-medium text-gray-200">{result?.latencyMs ? `${result.latencyMs}ms` : "—"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
