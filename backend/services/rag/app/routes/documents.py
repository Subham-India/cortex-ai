import io
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.storage import upload_document, download_document
from app.services.pdf_parser import extract_text_from_pdf
from app.services.ingestion import ingest_pages



router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload")
async def upload_document_route(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        file_path = f"uploads/{file.filename}"

        upload_document(io.BytesIO(file_bytes), file_path, file.content_type)  # <-- wrapped in BytesIO

        pages = extract_text_from_pdf(file_bytes)

        result = ingest_pages(file.filename, file_path, pages)
        return {
            "message": "Document processed successfully",
            "document_id": result["document_id"],
            "filename": file.filename,
            "total_pages": result["total_pages"],
            "total_chunks": result["total_chunks"],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/extract/{filename}")
def extract_document_text(filename: str):
    try:
        file_path = f"uploads/{filename}"
        file_bytes = download_document(file_path)
        pages = extract_text_from_pdf(file_bytes)

        return {
            "filename": filename,
            "pages": pages,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))