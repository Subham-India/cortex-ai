from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.storage import upload_document, download_document
from app.services.pdf_parser import extract_text_from_pdf


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


@router.post("/upload")
async def upload_document_route(
    file: UploadFile = File(...)
):

    try:
        file_path = f"uploads/{file.filename}"

        upload_document(
            file.file,
            file_path,
            file.content_type
        )

        return {
            "message": "File uploaded successfully",
            "filename": file.filename,
            "path": file_path
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/extract/{filename}")
def extract_document_text(filename: str):

    try:
        file_path = f"uploads/{filename}"

        file_bytes = download_document(file_path)

        pages = extract_text_from_pdf(file_bytes)

        return {
            "filename": filename,
            "pages": pages
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )