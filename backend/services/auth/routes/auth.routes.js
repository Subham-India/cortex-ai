import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { loginUser } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/login", authMiddleware, loginUser);

export default router;