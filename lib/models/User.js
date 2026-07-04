import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name."],
  },
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  status: {
    type: String,
    enum: ["Active", "Suspended"],
    default: "Active",
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// To prevent redefining the model in Next.js HMR environments
export default mongoose.models.User || mongoose.model("User", UserSchema);
