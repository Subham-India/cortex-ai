import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import "./config/redis.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,  // needed if you're sending cookies or Authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Hello from auth service!");
});

app.use("/api/auth", authRoutes);

// Start server
app.listen(port, () => {
  console.log(`Auth service running on port ${port}`);
});