import axios from "axios";
import Chat from "../models/Chat.js";

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // User joins chat: send userId from frontend
    socket.on("chat:join", async ({ userId }) => {
      try {
        const history = await Chat.find({ userId }).sort({ createdAt: 1 });
        socket.emit("chat:history", history);
      } catch (err) {
        console.error("Error fetching chat history:", err.message);
      }
    });

    // User sends a message
    socket.on("chat:message", async ({ userId, message }) => {
      try {
        // Save user message
        const userMsg = await Chat.create({
          userId,
          sender: "user",
          text: message,
        });

        // Send to Python AI
        const response = await axios.post(process.env.PYTHON_AI_URL, { message });
        const aiReply = response.data.reply;

        // Save AI response
        const aiMsg = await Chat.create({
          userId,
          sender: "ai",
          text: aiReply,
        });

        // Emit AI response to the same user
        socket.emit("chat:response", aiMsg);
      } catch (err) {
        console.error("AI Error:", err.message);
        socket.emit("chat:response", {
          sender: "ai",
          text: "AI service is currently unavailable.",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export default setupSocket;
