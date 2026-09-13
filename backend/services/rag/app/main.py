from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.documents import router as documents_router
from app.routes import rag as rag_routes

# alongside your existing app.include_router(documents.router) line:


app = FastAPI(
    title="Cortex AI RAG Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your Vite dev server origin — adjust if different
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "rag"
    }

app.include_router(rag_routes.router)

app.include_router(documents_router)