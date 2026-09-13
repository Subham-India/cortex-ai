import uuid
from app.services.embeddings import embed_texts
from app.db.supabase import supabase

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    chunks = []
    start = 0
    length = len(text)
    while start < length:
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return [c for c in chunks if c.strip()]


def ingest_pages(filename: str, storage_path: str, pages: list[dict]) -> dict:
    """
    pages: list of { "page": int, "text": str } from pdf_parser.py
    """
    document_id = str(uuid.uuid4())

    # 1. insert the parent document row first (FK requirement)
    supabase.table("documents").insert({
        "id": document_id,
        "filename": filename,
        "storage_path": storage_path,
    }).execute()

    # 2. build chunks
    all_chunks = []
    for page in pages:
        for chunk in chunk_text(page["text"]):
            all_chunks.append({
                "content": chunk,
                "page_number": page["page"],
            })

    if not all_chunks:
        raise ValueError("No text extracted from document")

    # 3. embed + insert chunks
    embeddings = embed_texts([c["content"] for c in all_chunks])

    rows = [
        {
            "document_id": document_id,
            "content": chunk["content"],
            "page_number": chunk["page_number"],
            "chunk_index": i,
            "metadata": {"filename": filename},
            "embedding": embedding,
        }
        for i, (chunk, embedding) in enumerate(zip(all_chunks, embeddings))
    ]

    supabase.table("document_chunks").insert(rows).execute()

    return {
        "document_id": document_id,
        "total_pages": len(pages),
        "total_chunks": len(rows),
    }