"""Helper utilities for consistent API responses."""
from __future__ import annotations

import logging
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


def ok(payload: Dict[str, Any], warnings: List[str] | None = None) -> Dict[str, Any]:
    body = dict(payload)
    if warnings:
        body["warnings"] = list(warnings)
    return body


def build_error_envelope(
    error_type: str,
    message: str,
    *,
    code: str | None = None,
    details: Any = None,
    status: int | None = None,
) -> Dict[str, Any]:
    normalized_message = str(message).strip() or "Request failed."
    body: Dict[str, Any] = {
        "ok": False,
        "error": {
            "type": str(error_type or "API_ERROR").strip() or "API_ERROR",
            "message": normalized_message,
            "code": str(code).strip() if isinstance(code, str) and str(code).strip() else None,
            "details": jsonable_encoder(details) if details is not None else None,
        },
    }
    if status is not None:
        body["status"] = status
    return body


def error(code: str, message: str, details: Any = None, status: int | None = None) -> Dict[str, Any]:
    return build_error_envelope(
        code,
        message,
        code=code,
        details=details,
        status=status,
    )


def error_response(
    status_code: int,
    error_type: str,
    message: str,
    *,
    code: str | None = None,
    details: Any = None,
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content=build_error_envelope(
            error_type,
            message,
            code=code,
            details=details,
            status=status_code,
        ),
    )


def http_error(
    status_code: int,
    error_type: str,
    message: str,
    *,
    code: str | None = None,
    details: Any = None,
) -> HTTPException:
    return HTTPException(
        status_code=status_code,
        detail=build_error_envelope(
            error_type,
            message,
            code=code,
            details=details,
            status=status_code,
        ),
    )


def normalize_error_detail(
    detail: Any,
    *,
    default_type: str,
    default_message: str,
    status_code: int | None = None,
) -> Dict[str, Any]:
    if isinstance(detail, dict) and detail.get("ok") is False and isinstance(detail.get("error"), dict):
        error_payload = detail["error"]
        return build_error_envelope(
            str(error_payload.get("type") or default_type),
            str(error_payload.get("message") or default_message),
            code=error_payload.get("code"),
            details=error_payload.get("details", error_payload.get("detail")),
            status=status_code if status_code is not None else detail.get("status"),
        )

    if isinstance(detail, dict) and isinstance(detail.get("error"), dict):
        error_payload = detail["error"]
        return build_error_envelope(
            str(error_payload.get("type") or error_payload.get("code") or default_type),
            str(error_payload.get("message") or default_message),
            code=error_payload.get("code"),
            details=error_payload.get("details", error_payload.get("detail")),
            status=status_code,
        )

    if isinstance(detail, dict):
        return build_error_envelope(
            str(detail.get("type") or default_type),
            str(detail.get("message") or detail.get("detail") or default_message),
            code=detail.get("code"),
            details=detail.get("details"),
            status=status_code,
        )

    if isinstance(detail, list):
        return build_error_envelope(
            default_type,
            default_message,
            details=detail,
            status=status_code,
        )

    if isinstance(detail, str) and detail.strip():
        return build_error_envelope(
            default_type,
            detail.strip(),
            status=status_code,
        )

    return build_error_envelope(default_type, default_message, status=status_code)


def _chat_error_payload(envelope: Dict[str, Any]) -> Dict[str, Any]:
    payload = dict(envelope)
    payload.update(
        {
            "user_id": None,
            "reply": "",
            "actions": [],
            "scene_json": None,
            "source": None,
            "analysis_summary": None,
            "context": {},
            "debug": None,
            "advice_slice": None,
            "timeline_slice": None,
            "war_room_slice": None,
            "scene_payload": None,
            "scene_overlay": None,
            "object_impacts": None,
            "drivers": [],
            "signals": [],
        }
    )
    return payload


def install_exception_handlers(app: FastAPI, logger: logging.Logger | None = None) -> None:
    active_logger = logger or logging.getLogger(__name__)

    @app.exception_handler(RequestValidationError)
    async def _handle_validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
        errors = jsonable_encoder(exc.errors())
        active_logger.warning(
            "request_validation_failed path=%s method=%s errors=%s",
            request.url.path,
            request.method,
            errors,
        )
        envelope = build_error_envelope(
            "VALIDATION_ERROR",
            "Request validation failed.",
            code="VALIDATION_ERROR",
            details=errors,
            status=422,
        )
        if request.url.path == "/chat":
            envelope = _chat_error_payload(envelope)
        return JSONResponse(status_code=422, content=envelope)

    @app.exception_handler(HTTPException)
    async def _handle_http_error(request: Request, exc: HTTPException) -> JSONResponse:
        normalized = normalize_error_detail(
            exc.detail,
            default_type="HTTP_ERROR",
            default_message="Request failed.",
            status_code=exc.status_code,
        )
        level = logging.WARNING if 400 <= exc.status_code < 500 else logging.ERROR
        active_logger.log(
            level,
            "http_error_response path=%s method=%s status=%s error_type=%s",
            request.url.path,
            request.method,
            exc.status_code,
            normalized["error"]["type"],
        )
        return JSONResponse(status_code=exc.status_code, content=normalized)

    @app.exception_handler(Exception)
    async def _handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
        active_logger.exception(
            "unhandled_api_error path=%s method=%s",
            request.url.path,
            request.method,
        )
        return error_response(
            500,
            "INTERNAL_ERROR",
            "An internal server error occurred.",
            code="INTERNAL_ERROR",
        )
