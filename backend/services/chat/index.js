import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";

dotenv.config();

const app = express();

/* =========================
   CORS
========================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   Middleware
========================= */

app.use(express.json());

/* =========================
   Database
========================= */

connectDB();

/* =========================
   Routes
========================= */

app.use("/api/chat", chatRoutes);

app.use(
  "/api/chat/conversations",
  conversationRoutes
);

/* =========================
   Server
========================= */

const PORT = process.env.PORT || 8002;

app.listen(PORT, () => {
  console.log(`Chat Service running on port ${PORT}`);
});