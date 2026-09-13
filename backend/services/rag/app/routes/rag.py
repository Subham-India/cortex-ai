import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.retrieval import retrieve_chunks
from app.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-3.6-flash")
router = APIRouter(prefix="/rag", tags=["RAG"])


class RagQueryRequest(BaseModel):
    question: str
    document_id: str
    limit: int | None = 5


@router.post("/query")
async def rag_query(payload: RagQueryRequest):
    try:
        chunks = retrieve_chunks(payload.question, payload.document_id, payload.limit or 5)

        if not chunks:
            return {
                "answer": "I couldn't find relevant information in this document.",
                "sources": [],
                "document_id": payload.document_id,
            }

        context = "\n\n".join(c["content"] for c in chunks)
        prompt = f"""Answer the question using only the context below. If the answer isn't in the context, say so.

Context:
{context}

Question: {payload.question}

Answer:"""

        response = model.generate_content(prompt)

        return {
            "answer": response.text,
            "sources": chunks,
            "document_id": payload.document_id,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))