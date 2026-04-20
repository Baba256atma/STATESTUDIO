"""B.10.b — Real CSV connector: file → rows → text → shared ingestion."""

from __future__ import annotations

import csv
import io
from pathlib import Path
from typing import Any

from app.connectors.connector_contract import NexoraConnector, NormalizedIngestionInput

_MAX_CSV_BYTES = 2 * 1024 * 1024  # 2 MiB safety cap


def _resolve_file_path(config: dict[str, Any]) -> str:
    raw = config.get("file_path") or config.get("path")
    if not isinstance(raw, str) or not raw.strip():
        raise ValueError("config must include a non-empty 'file_path' (or legacy 'path')")
    return raw.strip()


def _row_to_phrase(row: dict[str, str]) -> str:
    parts: list[str] = []
    for key in sorted(row.keys()):
        val = row.get(key, "").strip()
        if not val:
            continue
        k = key.strip().replace("\n", " ").replace("=", "_") or "field"
        v = val.replace("\n", " ")
        parts.append(f"{k}={v}")
    return ", ".join(parts)


class CsvConnector(NexoraConnector):
    """Read a local CSV file, flatten rows to short phrases, ingest as text."""

    @property
    def id(self) -> str:
        return "csv_upload"

    @property
    def connector_type(self) -> str:
        return "csv"

    @property
    def description(self) -> str:
        return "CSV file upload: reads local file, maps rows to text, then B.1 text → signals."

    async def fetch(self, config: dict[str, Any]) -> dict[str, Any]:
        path_str = _resolve_file_path(config)
        path = Path(path_str).expanduser()
        if not path.is_file():
            raise ValueError(f"CSV file not found or not a file: {path}")
        size = path.stat().st_size
        if size > _MAX_CSV_BYTES:
            raise ValueError(f"CSV exceeds maximum size ({_MAX_CSV_BYTES} bytes): {path}")
        if size == 0:
            return {"rows": [], "columns": [], "file_path": str(path.resolve())}

        text = path.read_text(encoding="utf-8", errors="replace")
        if not text.strip():
            return {"rows": [], "columns": [], "file_path": str(path.resolve())}

        stream = io.StringIO(text)
        dialect = csv.get_dialect("excel")
        sample = text[:4096]
        if len(sample) >= 2:
            try:
                dialect = csv.Sniffer().sniff(sample, delimiters=",;\t")
            except csv.Error:
                dialect = csv.get_dialect("excel")

        stream.seek(0)
        rows: list[dict[str, str]] = []
        columns: list[str] = []
        try:
            reader = csv.DictReader(stream, dialect=dialect)
            columns = [h.strip() for h in (reader.fieldnames or []) if isinstance(h, str) and h.strip()]
            for raw_row in reader:
                if raw_row is None:
                    continue
                cleaned: dict[str, str] = {}
                for k, v in raw_row.items():
                    if k is None:
                        continue
                    key = str(k).strip()
                    if not key:
                        continue
                    cleaned[key] = "" if v is None else str(v).strip()
                if any(cleaned.values()):
                    rows.append(cleaned)
        except csv.Error:
            stream.seek(0)
            fallback = csv.reader(stream, dialect=dialect)
            grid = [list(r) for r in fallback if any((c or "").strip() for c in r)]
            if not grid:
                return {"rows": [], "columns": [], "file_path": str(path.resolve())}
            width = max(len(r) for r in grid)
            header = grid[0]
            if len(header) < width:
                header = header + [f"col_{i}" for i in range(len(header), width)]
            columns = [str(h).strip() or f"col_{i}" for i, h in enumerate(header[:width])]
            for parts in grid[1:]:
                row = {columns[i]: (parts[i] if i < len(parts) else "").strip() for i in range(len(columns))}
                if any(row.values()):
                    rows.append(row)

        return {"rows": rows, "columns": columns, "file_path": str(path.resolve())}

    async def normalize(self, raw: dict[str, Any], config: dict[str, Any]) -> NormalizedIngestionInput:
        rows = raw.get("rows")
        if not isinstance(rows, list):
            rows = []
        lines: list[str] = []
        for row in rows:
            if isinstance(row, dict):
                phrase = _row_to_phrase({str(k): str(v) for k, v in row.items()})
                if phrase:
                    lines.append(phrase)

        if not lines:
            body = (
                "CSV source contained no extractable data rows. "
                "File was read successfully but produced no non-empty field values."
            )
        else:
            body = "\n".join(lines)

        fp = raw.get("file_path")
        meta: dict[str, Any] = {
            "source": "csv_upload",
            "connector_id": self.id,
            "rows": len(rows),
        }
        if isinstance(fp, str) and fp:
            meta["file_path"] = fp
        cols = raw.get("columns")
        if isinstance(cols, list) and cols:
            meta["columns"] = cols[:32]

        return NormalizedIngestionInput(input_type="text", payload={"text": body}, metadata=meta)
