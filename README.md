<div align="center">

# 🧠 Cortex AI

**A multi-agent AI assistant that chats, searches the live web, generates images, and answers questions from your own PDFs, built on a microservices architecture.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
![FastAPI](https://img.shields.io/badge/FastAPI-RAG-009688?logo=fastapi&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-Agents-1C3C3C)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-pgvector-3ECF8E?logo=supabase&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)
![License](https://img.shields.io/badge/License-ISC-blue)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started (without Docker)](#-getting-started-without-docker)
- [Running with Docker](#-running-with-docker)
- [Environment Variables](#-environment-variables)
- [Supabase Setup (RAG)](#-supabase-setup-rag)
- [API Reference](#-api-reference)
- [Troubleshooting](#-troubleshooting)
- [Known Limitations & Roadmap](#-known-limitations--roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Cortex AI is a ChatGPT-style assistant with one important difference: it isn't a single model behind a single endpoint. Every message is first read by a **Router Agent**, which decides which specialist agent should handle it:

| Agent | Handles | Powered by |
|---|---|---|
| 💬 **Chat** | Conversation, explanations, coding help | Groq (`openai/gpt-oss-20b`) |
| 🌐 **Search** | Latest news and current events, with cited sources | Tavily + Groq |
| 🖼️ **Photo** | "Create an image of…" | Hugging Face (FLUX.1-schnell) + Cloudinary |
| 📄 **RAG** | Questions about *your uploaded PDF* | Gemini embeddings + Supabase pgvector + Gemini |

The agents are orchestrated with **LangGraph**, and each concern (auth, chat history, agents, RAG) runs as its own service behind a single **API gateway**.

---

## 📸 Screenshots

| Login | Chat |
|---|---|
| ![Login](docs/screenshots/login.png) | ![Chat](docs/screenshots/chat.png) |

| Web Search | Image Generation |
|---|---|
| ![Search](docs/screenshots/search.png) | ![Image](docs/screenshots/image-gen.png) |

| Chat with PDF |
|---|
| ![RAG](docs/screenshots/rag.png) |

---

## ✨ Features

### 🤖 Multi-Agent Intelligence
- **Automatic routing:** an LLM-based router picks the right agent for each message. You never choose a mode.
- **Web search with sources:** live results from Tavily, summarized by the LLM with source links returned to the UI.
- **AI image generation:** prompts are rendered with FLUX.1-schnell and stored on Cloudinary, so images persist in your history.
- **LangGraph workflow:** a clear `router → agent → end` graph that is easy to extend with new agents.

### 📄 Chat with Your Documents (RAG)
- **Upload a PDF** from the paperclip button in the chat input and ask questions about it.
- **Retrieval-Augmented Generation:** the PDF is parsed page by page (PyMuPDF), split into overlapping chunks, embedded with Gemini (`gemini-embedding-001`, 768 dimensions), and stored in Supabase with pgvector.
- **Grounded answers:** questions are embedded, the closest chunks are retrieved by vector similarity, and the model answers *only* from that context. If the answer isn't in the document, it says so.
- **Source passages with page numbers** are returned with every answer.
- **Original files** are kept in Supabase Storage.

### 🔐 Authentication & Sessions
- **Google Sign-In** via Firebase Authentication.
- **Server-side token verification** with the Firebase Admin SDK.
- **Auto-registration:** first-time users are created in MongoDB on login.
- **7-day sessions:** sessions expire after a week on both client and server.
- **Redis caching** of user profiles for fast lookups.
- **Protected routes** on the frontend, with automatic session restore on reload.

### 💬 Conversations
- Multiple conversations per user, persisted in MongoDB.
- Sidebar with conversations **grouped by date** (Today, Yesterday, Previous 7 days, …).
- Create, switch between, and delete conversations.
- Full message history is passed to the model for context-aware replies.

### 🎨 Modern UI
- React 19 + Tailwind CSS 4 + shadcn/Base UI components.
- **Markdown rendering** with GitHub-flavored tables and lists.
- **Syntax-highlighted code blocks** (highlight.js).
- Responsive layout with a collapsible sidebar (works on mobile).
- Inline image rendering for generated pictures.

### 🏗️ Engineering
- **Microservices:** gateway, auth, chat, agent, and RAG run independently.
- **API Gateway** with a single public entry point for the frontend.
- **Docker Compose** files for local infrastructure and full production deployment.
- One-command dev mode (`npm run dev`) for the Node services and the frontend.

---

## ⚙️ How It Works

### Chat request flow

```
User message
   │
   ▼
Frontend ──► Gateway ──► Chat Service ──► Agent Service
                              │                │
                     saves messages        LangGraph
                      in MongoDB                │
                                          ┌─────▼─────┐
                                          │  Router   │  (Groq LLM picks one)
                                          └─────┬─────┘
                       ┌──────────┬─────────────┼──────────────┐
                       ▼          ▼             ▼              ▼
                     Chat       Search        Photo           RAG
                    (Groq)   (Tavily+Groq) (HF + Cloudinary)  (calls RAG service)
```

### Document Q&A (RAG) flow

```
 UPLOAD                                       ASK
 ──────                                       ───
 PDF ─► FastAPI /documents/upload             Question ─► /api/agent/run (+ documentId)
   │                                                │
   ├─► store file in Supabase Storage               ▼
   ├─► extract text per page (PyMuPDF)         embed question (Gemini)
   ├─► chunk (1000 chars, 150 overlap)              │
   ├─► embed each chunk (Gemini, 768-d)             ▼
   └─► save chunks + vectors (pgvector)        vector search in Supabase
                                                    │  (match_document_chunks)
        returns document_id ◄───────────────        ▼
                                              top chunks ─► Gemini answers from context
                                                    │
                                                    ▼
                                           answer + source passages
```

---

## 🏛️ Architecture

```mermaid
flowchart LR
    UI["React + Vite<br/>:5173 dev / :8080 Docker"] -->|"/api/*  /documents/*"| GW["API Gateway<br/>:8000"]

    GW -->|/api/auth| AUTH["Auth Service<br/>:8001"]
    GW -->|/api/chat| CHAT["Chat Service<br/>:8002"]
    GW -->|/api/agent| AGENT["Agent Service<br/>:8003"]
    GW -->|/documents| RAG["RAG Service (FastAPI)<br/>:8004"]

    AUTH --> FB[("Firebase Auth")]
    AUTH --> REDIS[("Redis")]
    AUTH --> MONGO[("MongoDB")]
    CHAT --> MONGO
    CHAT --> AGENT

    AGENT --> GROQ["Groq LLM"]
    AGENT --> TAV["Tavily Search"]
    AGENT --> HF["Hugging Face<br/>FLUX.1-schnell"]
    AGENT --> CLD["Cloudinary"]
    AGENT --> RAG

    RAG --> SUPA[("Supabase<br/>pgvector + Storage")]
    RAG --> GEM["Gemini<br/>embeddings + answers"]
```

| Service | Port | Language | Responsibility |
|---|---|---|---|
| **Frontend** | 5173 (dev) / 8080 (Docker) | React | UI, auth state, chat |
| **Gateway** | 8000 | Node / Express | Single entry point; reverse-proxies to services |
| **Auth** | 8001 | Node / Express | Firebase token verification, user records, Redis cache |
| **Chat** | 8002 | Node / Express | Conversations & messages in MongoDB; calls the agent |
| **Agent** | 8003 | Node / LangGraph | Router + Chat / Search / Photo / RAG agents |
| **RAG** | 8004 | Python / FastAPI | PDF ingestion, embeddings, vector retrieval, grounded answers |
| **Redis** | 6379 | — | User profile cache |

---

## 🧰 Tech Stack

**Frontend:** React 19 · Vite 8 · Redux Toolkit · React Router 7 · Tailwind CSS 4 · shadcn/Base UI · Axios · react-markdown · remark-gfm · rehype-highlight · Lucide icons · Firebase SDK

**Backend (Node):** Express 5 · Mongoose · node-redis · firebase-admin · express-http-proxy · LangGraph · Groq SDK · Tavily · Hugging Face Inference · Cloudinary · Google GenAI

**Backend (Python):** FastAPI · Uvicorn · PyMuPDF · Supabase client · google-generativeai

**Data & Infra:** MongoDB · Redis · Supabase (Postgres + pgvector + Storage) · Firebase Auth · Docker & Docker Compose · Nginx

---

## 📁 Project Structure

```
cortex-ai/
├── backend/
│   ├── gateway/                 # API gateway (reverse proxy)
│   └── services/
│       ├── auth/                # Firebase verification, users, Redis cache
│       │   ├── config/          #   db.js · redis.js · firebase.js
│       │   ├── controller/
│       │   ├── middleware/      #   authMiddleware.js
│       │   ├── models/
│       │   └── routes/
│       ├── chat/                # Conversations & messages (MongoDB)
│       │   ├── controller/
│       │   ├── models/
│       │   └── routes/
│       ├── agent/               # LangGraph multi-agent service
│       │   ├── agents/          #   router · chat · search · photo · rag
│       │   ├── graph/           #   agent.graph.js · state.js · nodes/ · edges/
│       │   ├── llms/            #   groq · gemini clients
│       │   ├── tools/           #   tavily search tool
│       │   ├── storage/         #   cloudinary upload
│       │   └── services/        #   agent runner · RAG client · image generator
│       └── rag/                 # FastAPI RAG service
│           └── app/
│               ├── routes/      #   documents.py · rag.py
│               ├── services/    #   pdf_parser · ingestion · embeddings · retrieval · storage
│               └── db/          #   supabase.py
├── frontend/
│   └── src/
│       ├── components/          #   chat/ · sidebar/ · ui/
│       ├── features/            #   Redux slices: auth, conversation
│       ├── hooks/               #   useConversations
│       ├── pages/               #   Login · Home
│       ├── services/            #   API clients
│       └── store/
├── docs/screenshots/            # README images
├── docker-compose.yaml          # Redis only (for local dev)
├── docker-compose.prod.yml      # Full stack
└── .env.example
```

---

## 🚀 Getting Started (without Docker)

### Prerequisites

| Requirement | Notes |
|---|---|
| **Node.js 20+** | |
| **Python 3.10+** | The Dockerfile uses 3.13 |
| **MongoDB** | Local `mongod` or a free [Atlas](https://www.mongodb.com/atlas) cluster |
| **Redis** | Local install, WSL, Memurai (Windows), a cloud Redis, or one container: `docker run -d -p 6379:6379 redis:7` |
| **Firebase project** | Google sign-in enabled + a service account key |
| **API keys** | [Groq](https://console.groq.com), [Google AI Studio (Gemini)](https://aistudio.google.com), [Tavily](https://tavily.com), [Hugging Face](https://huggingface.co/settings/tokens), [Cloudinary](https://cloudinary.com), [Supabase](https://supabase.com) |

### 1. Clone and install

```bash
git clone https://github.com/Subham-India/cortex-ai.git
cd cortex-ai

# Root (installs `concurrently`)
npm install

# Node services + frontend
npm install --prefix backend/gateway
npm install --prefix backend/services/auth
npm install --prefix backend/services/chat
npm install --prefix backend/services/agent
npm install --prefix frontend

# RAG service (Python virtual environment)
cd backend/services/rag
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ../../..
```

### 2. Configure environment variables

Each service reads a `.env` from **its own folder**. Create them using the table in [Environment Variables](#-environment-variables).

Also place your Firebase service account key at:

```
backend/services/auth/firebase-service-account.json
```

### 3. Set up Supabase

Create the tables, function, and storage bucket described in [Supabase Setup (RAG)](#-supabase-setup-rag).

### 4. Add the dev proxy to the frontend

The frontend calls relative paths such as `/api/...` and `/documents/...`. In Docker, Nginx forwards those to the gateway. In development, Vite must do it. Make sure `frontend/vite.config.js` contains:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8000",
      "/documents": "http://localhost:8000",
    },
  },
});
```

### 5. Start everything

Make sure **Redis** and **MongoDB** are running, then:

```bash
# Terminal 1: RAG service (Python)
cd backend/services/rag
source .venv/bin/activate            # Windows: .venv\Scripts\Activate.ps1
uvicorn app.main:app --port 8004 --reload

# Terminal 2: gateway + auth + chat + agent + frontend (from repo root)
npm run dev
```

Open **http://localhost:5173**, sign in with Google, and start chatting.

> `npm run dev` starts the four Node services and the frontend together. The Python RAG service is started separately.

---

## 🐳 Running with Docker

The repository includes two compose files.

**`docker-compose.yaml`: Redis only** (handy for local development):

```bash
docker compose up -d
```

**`docker-compose.prod.yml`: the full stack** (gateway, auth, chat, agent, RAG, Redis, frontend behind Nginx):

```bash
# 1. Create a .env in the repo root with the variables listed below
# 2. Place the Firebase key at backend/services/auth/firebase-service-account.json
docker compose -f docker-compose.prod.yml up --build -d
```

The app is then served at **http://localhost:8080**, and the gateway is also exposed on port `8000`.

The production compose file reads these variables from the root `.env`:

```env
AUTH_MONGO_URI=...
CHAT_MONGO_URI=...
GROQ_API_KEY=...
GEMINI_API_KEY=...
TAVILY_API_KEY=...
HF_TOKEN=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
```

---

## 🔑 Environment Variables

Create a `.env` file in **each** service folder. For local (non-Docker) development, use `localhost` URLs.

| Folder | Variable | Example / Description |
|---|---|---|
| `backend/gateway` | `PORT` | `8000` |
| | `AUTH_SERVICE_URL` | `http://localhost:8001` |
| | `CHAT_SERVICE_URL` | `http://localhost:8002` |
| | `AGENT_SERVICE_URL` | `http://localhost:8003` |
| | `RAG_SERVICE_URL` | `http://localhost:8004` |
| `backend/services/auth` | `PORT` | `8001` |
| | `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/cortex` |
| | `REDIS_URL` | `redis://localhost:6379` |
| `backend/services/chat` | `PORT` | `8002` |
| | `MONGO_URI` | Same database as above |
| | `AGENT_SERVICE_URL` | `http://localhost:8003` |
| `backend/services/agent` | `PORT` | `8003` |
| | `RAG_SERVICE_URL` | `http://localhost:8004` |
| | `GROQ_API_KEY` | Chat, routing, and search answers |
| | `GEMINI_API_KEY` | Gemini client |
| | `TAVILY_API_KEY` | Web search |
| | `HF_TOKEN` | Image generation |
| | `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Image storage |
| `backend/services/rag` | `SUPABASE_URL` | `https://<project>.supabase.co` |
| | `SUPABASE_SECRET_KEY` | Service-role / secret key (**server-side only**) |
| | `GEMINI_API_KEY` | Embeddings and answers |

> ⚠️ **Never commit `.env` files or `firebase-service-account.json`.** Both are already covered by `.gitignore`. The Supabase *secret* key and the Firebase service account grant full access, so keep them on the server.

---

## 🗄️ Supabase Setup (RAG)

The RAG service needs a pgvector-enabled Postgres schema, a Storage bucket, and a similarity-search function. The SQL below matches what the code expects (768-dimension vectors, the `match_document_chunks` RPC, a `documents` bucket). Run it in the Supabase **SQL Editor**.

```sql
-- 1. Enable pgvector
create extension if not exists vector;

-- 2. Documents (one row per uploaded PDF)
create table if not exists documents (
  id uuid primary key,
  filename text not null,
  storage_path text not null,
  created_at timestamptz default now()
);

-- 3. Chunks with embeddings (768 dims must match EMBEDDING_DIMENSIONS)
create table if not exists document_chunks (
  id bigint generated always as identity primary key,
  document_id uuid not null references documents(id) on delete cascade,
  content text not null,
  page_number int,
  chunk_index int,
  metadata jsonb default '{}'::jsonb,
  embedding vector(768)
);

create index if not exists document_chunks_embedding_idx
  on document_chunks using hnsw (embedding vector_cosine_ops);

-- 4. Similarity search used by retrieval.py
create or replace function match_document_chunks(
  query_embedding vector(768),
  match_document_id uuid,
  match_count int default 5
)
returns table (
  id bigint,
  document_id uuid,
  content text,
  page_number int,
  chunk_index int,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    c.id, c.document_id, c.content, c.page_number, c.chunk_index, c.metadata,
    1 - (c.embedding <=> query_embedding) as similarity
  from document_chunks c
  where c.document_id = match_document_id
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
```

Then create a **Storage bucket named `documents`** (Storage → New bucket). Keep it private.

> If you already have these tables, keep your existing schema. Just make sure the vector size is `768` and the function name and parameters match the above.

---

## 📡 API Reference

All requests go through the gateway (`http://localhost:8000`).

### Auth: `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Verify the Firebase ID token, create the user if new, return the profile. Header: `Authorization: Bearer <idToken>` |
| `GET` | `/api/auth/me` | Current user (served from Redis when cached) |

### Chat: `/api/chat`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send a message `{ userId, conversationId, message }`. Saves it, runs the agent, returns `{ response, type, image, selectedAgent, searchResults }` |
| `POST` | `/api/chat/conversations` | Create a conversation `{ userId, title }` |
| `GET` | `/api/chat/conversations?userId=` | List a user's conversations |
| `GET` | `/api/chat/conversations/:id/messages` | Get a conversation's messages |
| `DELETE` | `/api/chat/conversations/:id` | Delete a conversation and its messages |

### Agent: `/api/agent`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/agent/run` | Run the agent graph directly `{ message, documentId?, userId, conversationId, messages? }` |

### Documents (RAG): `/documents`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/documents/upload` | Upload a PDF (`multipart/form-data`, field `file`). Returns `{ document_id, filename, total_pages, total_chunks }` |
| `GET` | `/documents/extract/:filename` | Re-extract text from a stored PDF |

The RAG service also exposes `POST /rag/query` (`{ question, document_id, limit }`) and `GET /health` directly on port 8004. The agent service calls these internally.

### Example

```bash
curl -X POST http://localhost:8000/api/agent/run \
  -H "Content-Type: application/json" \
  -d '{
        "message": "Summarize the objectives of this report",
        "documentId": "3f6c1e1c-....",
        "userId": "u1",
        "conversationId": "c1"
      }'
```

---

## 🩺 Troubleshooting

| Symptom | Cause / Fix |
|---|---|
| `Redis Error: ECONNREFUSED` on auth start | Redis isn't running. Start it (`docker start cortex-redis`, WSL, or Memurai) before the auth service. |
| `POST /api/auth/login 404` in the browser | The Vite dev proxy is missing. Add the `server.proxy` block from [step 4](#4-add-the-dev-proxy-to-the-frontend) and restart Vite. |
| `AssertionError: Host should not be empty` (gateway) | A `*_SERVICE_URL` is missing or misspelled in `backend/gateway/.env`. All four are required. |
| `401 Invalid or expired token` | The service account JSON must be from the **same Firebase project** as `frontend/src/firebase.js`. Check the auth terminal for the real error. |
| `Failed to resolve import "./utils/session"` | `session.js` and `ProtectedRoute.jsx` must live under `frontend/src/` (not a root-level `src/`). |
| `uvicorn is not recognized` (Windows) | Activate the virtual environment first: `.venv\Scripts\Activate.ps1`. |
| `defineConfig is not defined` | `vite.config.js` is missing its `import` lines. Use the full file from step 4. |
| MongoDB connection fails on Atlas | Add your IP to Atlas → Network Access. |
| Document questions return "Failed to get an answer" | Upload a PDF first (a `documentId` is required), and confirm the Supabase function and bucket exist. |
| Gemini "model not found" | Run `python backend/services/rag/quick_check.py` to list the models your key can use, then update the model name in `app/routes/rag.py`. |

---

## 🗺️ Known Limitations & Roadmap

Cortex AI is under active development. Planned improvements:

- [ ] **Authorization hardening:** verify the Firebase token in the chat, agent, and RAG services and derive `userId` from it, with per-user ownership checks on conversations and messages
- [ ] **Persist document chats:** save document Q&A messages to conversation history and attach documents to conversations
- [ ] **Smarter routing:** force the RAG agent whenever a document is attached
- [ ] **Auto-generated conversation titles** from the first message
- [ ] **Per-user document storage paths** to avoid filename collisions
- [ ] **Batch embeddings and PDF validation** (file type and size limits)
- [ ] **Context window management** for long conversations
- [ ] **Streaming responses**
- [ ] Support for DOCX / TXT in RAG
- [ ] Automated tests and CI

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**.

---

<div align="center">

Built by [Subham](https://github.com/Subham-India)

⭐ If you find this project useful, consider giving it a star.

</div>
