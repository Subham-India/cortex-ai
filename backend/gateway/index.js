import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import morgan from "morgan";
import http from "node:http";

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

// ---------------------------------------------------------------
// Streaming (SSE) route. MUST be above the /api/chat proxy below,
// otherwise the proxy catches the request first and buffers it.
// ---------------------------------------------------------------
const streamAgent = new http.Agent({ keepAlive: false });

app.post("/api/chat/stream", (req, res) => {
  const target = new URL(process.env.CHAT_SERVICE_URL);

  // forward only what the chat service needs
  const headers = { host: target.host, connection: "close" };
  for (const h of ["content-type", "content-length", "authorization"]) {
    if (req.headers[h]) headers[h] = req.headers[h];
  }

  const proxyReq = http.request(
    {
      agent: streamAgent,
      hostname: target.hostname,
      port: target.port || 80,
      path: "/api/chat/stream",
      method: "POST",
      headers,
    },
    (proxyRes) => {
      // drop hop-by-hop headers; Node re-adds chunked encoding itself
      const {
        connection,
        "keep-alive": keepAlive,
        "transfer-encoding": transferEncoding,
        ...safeHeaders
      } = proxyRes.headers;

      res.writeHead(proxyRes.statusCode, safeHeaders);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on("error", (err) => {
    console.error("Stream proxy error:", err.message);
    if (!res.headersSent) {
      res.status(502).json({ success: false, message: "Chat service unavailable" });
    } else {
      res.end();
    }
  });

  res.on("close", () => proxyReq.destroy());
  req.pipe(proxyReq);
});

// ---------------------------------------------------------------
// Normal (buffered) proxies
// ---------------------------------------------------------------
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