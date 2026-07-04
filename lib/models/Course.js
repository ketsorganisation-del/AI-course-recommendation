import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    level: {
        type: String,
        default: "Beginner",
    },
    duration: {
        type: String,
        default: "4 weeks",
    },
    university: {
        type: String,
        default: "",
    },
    membersPursuing: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    source: {
        type: String,
        default: "Coursify Catalog",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
