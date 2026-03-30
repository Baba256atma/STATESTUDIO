"""CSV extractor for Nexora ingestion."""

from __future__ import annotations

import csv
import io
from pathlib import Path


def _read_csv_payload(payload: str) -> str:
    candidate_path = Path(payload).expanduser()
    if candidate_path.exists() and candidate_path.is_file():
        return candidate_path.read_text(encoding="utf-8")
    if "\n" in payload or "," in payload:
        return payload
    raise ValueError("CSV payload must be raw CSV content or a valid file path.")


def extract_text(payload: str) -> str:
    """Flatten CSV rows into deterministic readable text."""
    raw_csv = _read_csv_payload(payload)
    buffer = io.StringIO(raw_csv)
    reader = csv.reader(buffer)
    rows = [row for row in reader if any(str(cell).strip() for cell in row)]
    if not rows:
        return ""

    header = rows[0]
    body = rows[1:] if len(rows) > 1 else []
    if not body:
        return "Columns: " + ", ".join(str(cell).strip() for cell in header if str(cell).strip())

    fragments: list[str] = []
    for row in body:
        pairs: list[str] = []
        for index, cell in enumerate(row):
            key = str(header[index]).strip() if index < len(header) else f"column_{index + 1}"
            value = str(cell).strip()
            if not value:
                continue
            pairs.append(f"{key}: {value}")
        if pairs:
            fragments.append("; ".join(pairs))
    return "\n".join(fragments)
