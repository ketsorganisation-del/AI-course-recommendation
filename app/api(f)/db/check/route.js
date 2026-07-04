import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import Syllabus from "@/lib/models/Syllabus";

export async function GET() {
    const startedAt = Date.now();

    try {
        await dbConnect();

        const totalUsers = await User.countDocuments();
        const totalSyllabi = await Syllabus.countDocuments();

        return Response.json({
            status: "connected",
            message: "MongoDB connection is active.",
            totalUsers,
            totalSyllabi,
            databaseName: process.env.MONGODB_DB || "mongodb",
            readyState: mongoose.connection.readyState,
            latencyMs: Date.now() - startedAt,
        });
    } catch (error) {
        console.error("DB check failed:", error);

        return Response.json(
            {
                status: "error",
                message: error.message || "Unable to connect to MongoDB.",
                totalUsers: 0,
                totalSyllabi: 0,
                databaseName: process.env.MONGODB_DB || "mongodb",
                readyState: mongoose.connection.readyState,
                latencyMs: Date.now() - startedAt,
            },
            { status: 500 }
        );
    }
}
