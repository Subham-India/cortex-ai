from app.services.embeddings import embed_query
from app.db.supabase import supabase


def retrieve_chunks(question: str, document_id: str, top_k: int = 5) -> list[dict]:
    query_embedding = embed_query(question)

    response = supabase.rpc(
        "match_document_chunks",
        {
            "query_embedding": query_embedding,
            "match_document_id": document_id,
            "match_count": top_k,
        },
    ).execute()

    return response.data or []