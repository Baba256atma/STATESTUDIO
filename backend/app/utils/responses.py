"""Helper utilities for consistent API responses."""
from __future__ import annotations

from typing import Any, Dict, List


def ok(payload: Dict[str, Any], warnings: List[str] | None = None) -> Dict[str, Any]:
    body = dict(payload)
    if warnings:
        body["warnings"] = list(warnings)
    return body


def error(code: str, message: str, details: Any = None, status: int | None = None) -> Dict[str, Any]:
    body: Dict[str, Any] = {
        "error": {
            "code": code,
            "message": message,
        }
    }
    if details is not None:
        body["error"]["details"] = details
    if status is not None:
        body["status"] = status
    return body
