"""PDF extractor for Nexora ingestion."""

from __future__ import annotations

from pathlib import Path


def extract_text(payload: str) -> str:
    """Extract text from a PDF file path using available lightweight readers."""
    path = Path(payload).expanduser()
    if not path.exists() or not path.is_file():
        raise ValueError("PDF payload must be a valid file path.")

    reader_cls = None
    try:
        from pypdf import PdfReader as reader_cls  # type: ignore
    except Exception:
        try:
            from PyPDF2 import PdfReader as reader_cls  # type: ignore
        except Exception as exc:
            raise RuntimeError("PDF extraction requires pypdf or PyPDF2.") from exc

    reader = reader_cls(str(path))
    pages: list[str] = []
    for page in getattr(reader, "pages", []):
        try:
            page_text = page.extract_text() or ""
        except Exception:
            page_text = ""
        page_text = page_text.strip()
        if page_text:
            pages.append(page_text)
    return "\n\n".join(pages)

