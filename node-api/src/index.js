import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import setupSocket from "./sockets/socket.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  methods: ["GET", "POST"]
}));
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Proxy to Python AI
app.post("/api/chat", async (req, res) => {
  const response = await axios.post(process.env.PYTHON_AI_URL, req.body);
  res.json(response.data);
});

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Setup Socket.IO
import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

setupSocket(io);

// Start server
server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
