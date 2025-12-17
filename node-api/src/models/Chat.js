import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // can be email or user._id
  sender: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", chatSchema);
