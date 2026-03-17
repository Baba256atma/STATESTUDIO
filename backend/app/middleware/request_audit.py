"""Operational request audit middleware for the Nexora FastAPI backend."""

from __future__ import annotations

import logging
import time
from datetime import datetime, timezone

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


logger = logging.getLogger("nexora.request_audit")


def _get_client_ip(request: Request) -> str:
    """Return the best available client IP for safe request auditing."""
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    if request.client and request.client.host:
        return request.client.host

    return "unknown"


class RequestAuditMiddleware(BaseHTTPMiddleware):
    """Log request metadata for operational visibility and debugging."""

    async def dispatch(self, request: Request, call_next):
        # This middleware provides lightweight audit visibility for the MVP.
        # It is useful for debugging and operational trails, but must never
        # log request bodies, secrets, or other sensitive payload contents.
        started_at = time.perf_counter()
        timestamp = datetime.now(timezone.utc).isoformat()

        response = await call_next(request)

        duration_ms = round((time.perf_counter() - started_at) * 1000, 2)

        logger.info(
            "request_audit timestamp=%s method=%s path=%s client_ip=%s status_code=%s duration_ms=%s",
            timestamp,
            request.method,
            request.url.path,
            _get_client_ip(request),
            response.status_code,
            duration_ms,
        )

        return response
