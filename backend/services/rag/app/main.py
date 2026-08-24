from fastapi import FastAPI

from app.routes.documents import router as documents_router


app = FastAPI(
    title="Cortex AI RAG Service",
    version="1.0.0"
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "rag"
    }


app.include_router(documents_router)