import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello from API gateway!");
});

app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL, {
  proxyReqPathResolver: req => `/api/auth${req.url}`,
}));

app.use("/api/chat", proxy(process.env.CHAT_SERVICE_URL, {
  proxyReqPathResolver: req => `/api/chat${req.url}`,
}));

app.use("/api/agent", proxy(process.env.AGENT_SERVICE_URL, {
  proxyReqPathResolver: req => `/api/agent${req.url}`,
}));

app.use("/documents", proxy(process.env.RAG_SERVICE_URL, {
  proxyReqPathResolver: req => `/documents${req.url}`,
}));

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});