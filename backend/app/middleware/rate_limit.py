"""Lightweight in-memory rate limiting middleware for the Nexora MVP."""

from __future__ import annotations

import time
from collections import defaultdict, deque
from collections.abc import Deque

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


class InMemoryRateLimiter:
    """Track request timestamps per client IP using a rolling window."""

    def __init__(self, max_requests: int = 60, window_seconds: int = 60) -> None:
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: dict[str, Deque[float]] = defaultdict(deque)

    def allow_request(self, client_ip: str) -> bool:
        now = time.time()
        window_start = now - self.window_seconds
        timestamps = self._requests[client_ip]

        while timestamps and timestamps[0] < window_start:
            timestamps.popleft()

        if len(timestamps) >= self.max_requests:
            return False

        timestamps.append(now)
        return True


class RateLimitMiddleware(BaseHTTPMiddleware):
    """MVP request limiter that applies simple per-IP rate limiting."""

    def __init__(
        self,
        app,
        *,
        max_requests: int = 60,
        window_seconds: int = 60,
    ) -> None:
        super().__init__(app)
        # This in-memory limiter is suitable for MVP and local deployments.
        # Future production systems may replace it with Redis or gateway limits.
        self.limiter = InMemoryRateLimiter(
            max_requests=max_requests,
            window_seconds=window_seconds,
        )

    async def dispatch(self, request: Request, call_next):
        client_ip = self._get_client_ip(request)

        if not self.limiter.allow_request(client_ip):
            return JSONResponse(
                status_code=429,
                content={
                    "ok": False,
                    "error": {
                        "type": "RATE_LIMIT_EXCEEDED",
                        "message": "Too many requests. Please try again later.",
                    },
                },
            )

        return await call_next(request)

    @staticmethod
    def _get_client_ip(request: Request) -> str:
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()

        if request.client and request.client.host:
            return request.client.host

        return "unknown"
