import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  loginUser,
  getMe,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post(
  "/login",
  authMiddleware,
  loginUser
);

router.get(
  "/me",
  authMiddleware,
  getMe
);

export default router;