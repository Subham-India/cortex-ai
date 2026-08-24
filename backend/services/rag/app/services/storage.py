from app.db.supabase import supabase


BUCKET_NAME = "documents"


def upload_document(file, file_path: str, content_type: str):
    file_data = file.read()

    response = supabase.storage.from_(BUCKET_NAME).upload(
        path=file_path,
        file=file_data,
        file_options={
            "content-type": content_type,
            "upsert": "true"
        }
    )

    return response


def download_document(file_path: str):
    response = supabase.storage.from_(BUCKET_NAME).download(
        file_path
    )

    return response