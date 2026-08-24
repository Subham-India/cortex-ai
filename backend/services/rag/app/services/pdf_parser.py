import fitz


def extract_text_from_pdf(file_bytes: bytes):
    document = fitz.open(
        stream=file_bytes,
        filetype="pdf"
    )

    pages = []

    for page_number, page in enumerate(document):
        text = page.get_text()

        if text.strip():
            pages.append({
                "page": page_number + 1,
                "text": text.strip()
            })

    document.close()

    return pages