import express from "express";

import { sendMessage } from "../controller/chat.controller.js";

const router = express.Router();

router.post("/", sendMessage);

export default router;