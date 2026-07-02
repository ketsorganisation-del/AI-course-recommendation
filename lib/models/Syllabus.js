import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["video", "article", "project"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  duration: String,
  source: String,
  link: String,
});

const OutlineWeekSchema = new mongoose.Schema({
  week: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  details: String,
  completed: {
    type: Boolean,
    default: false,
  },
  resources: [ResourceSchema],
});

const SyllabusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  query: {
    type: String,
    required: true,
  },
  estimatedWeeks: {
    type: Number,
    required: true,
  },
  level: String,
  progress: {
    type: Number,
    default: 0,
  },
  outline: [OutlineWeekSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Syllabus || mongoose.model("Syllabus", SyllabusSchema);
