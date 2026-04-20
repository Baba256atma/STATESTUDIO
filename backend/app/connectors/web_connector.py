"""B.10.c — Real web/news connector using stdlib only."""

from __future__ import annotations

import re
from html import unescape
from html.parser import HTMLParser
from typing import Any
from urllib.error import URLError
from urllib.request import Request, urlopen

from app.connectors.connector_contract import NexoraConnector, NormalizedIngestionInput
from app.connectors.web_policy import WebIngestionPolicy, validate_url_policy

_FETCH_TIMEOUT_SECONDS = 6
_MAX_HTML_BYTES = 1_000_000
_MAX_INGEST_TEXT_CHARS = 4_000

_SCRIPT_STYLE_RE = re.compile(r"<(script|style)\b[^>]*>.*?</\1>", flags=re.IGNORECASE | re.DOTALL)
_TAG_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"\s+")
_WEB_POLICY = WebIngestionPolicy()


def _validate_url(config: dict[str, Any]) -> str:
    value = config.get("url")
    if not isinstance(value, str) or not value.strip():
        raise ValueError("config must include a non-empty 'url'")
    return value.strip()


class _NewsTextExtractor(HTMLParser):
    """Collect readable text from h1/h2/p while skipping script/style blocks."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._capture_tags = {"h1", "h2", "p"}
        self._skip_depth = 0
        self._active_capture_depth = 0
        self._parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:  # noqa: ARG002
        name = tag.lower()
        if name in {"script", "style"}:
            self._skip_depth += 1
            return
        if self._skip_depth == 0 and name in self._capture_tags:
            self._active_capture_depth += 1

    def handle_endtag(self, tag: str) -> None:
        name = tag.lower()
        if name in {"script", "style"}:
            if self._skip_depth > 0:
                self._skip_depth -= 1
            return
        if name in self._capture_tags and self._active_capture_depth > 0:
            self._active_capture_depth -= 1
            self._parts.append("\n")

    def handle_data(self, data: str) -> None:
        if self._skip_depth > 0 or self._active_capture_depth <= 0:
            return
        t = _WS_RE.sub(" ", data).strip()
        if t:
            self._parts.append(t)

    def text(self) -> str:
        return "\n".join([p.strip() for p in self._parts if p.strip()]).strip()


def _regex_fallback_extract(html: str) -> str:
    without_script = _SCRIPT_STYLE_RE.sub(" ", html)
    without_tags = _TAG_RE.sub(" ", without_script)
    return _WS_RE.sub(" ", unescape(without_tags)).strip()


def _extract_readable_text(html: str) -> str:
    parser = _NewsTextExtractor()
    try:
        parser.feed(html)
        parser.close()
        primary = parser.text()
    except Exception:
        primary = ""
    if primary:
        return primary
    return _regex_fallback_extract(html)


class WebConnector(NexoraConnector):
    """Fetch a single URL, extract readable text, pass through canonical ingestion."""

    @property
    def id(self) -> str:
        return "web_source"

    @property
    def connector_type(self) -> str:
        return "web"

    @property
    def description(self) -> str:
        return "Web / news connector: fetches URL content and extracts readable article text."

    async def fetch(self, config: dict[str, Any]) -> dict[str, Any]:
        url = _validate_url(config)
        domain = validate_url_policy(url, _WEB_POLICY)
        req = Request(
            url,
            headers={
                "User-Agent": "NexoraConnector/1.0 (+https://nexora.local)",
                "Accept": "text/html,application/xhtml+xml",
            },
        )
        try:
            with urlopen(req, timeout=_FETCH_TIMEOUT_SECONDS) as resp:
                raw = resp.read(_MAX_HTML_BYTES + 1)
                content_type = resp.headers.get("Content-Type", "")
                charset = resp.headers.get_content_charset() or "utf-8"
        except URLError as exc:
            raise ValueError(f"web fetch failed: {exc}") from exc
        except Exception as exc:  # Defensive against transport/runtime errors.
            raise ValueError(f"web fetch failed: {exc}") from exc

        if not raw:
            return {"html": "", "url": url, "domain": domain, "content_type": content_type, "truncated": False}

        truncated = len(raw) > _MAX_HTML_BYTES
        if truncated:
            raw = raw[:_MAX_HTML_BYTES]
        html = raw.decode(charset, errors="replace")
        return {"html": html, "url": url, "domain": domain, "content_type": content_type, "truncated": truncated}

    async def normalize(self, raw: dict[str, Any], config: dict[str, Any]) -> NormalizedIngestionInput:
        html = str(raw.get("html") or "")
        url = str(raw.get("url") or _validate_url(config))
        domain = str(raw.get("domain") or validate_url_policy(url, _WEB_POLICY))
        text = _extract_readable_text(html)
        if not text:
            text = "Web source fetched successfully but contained no readable article paragraphs."
        text = text[:_MAX_INGEST_TEXT_CHARS].strip()
        if not text:
            text = "Web source had empty content after extraction."

        trust_level = "verified" if domain in _WEB_POLICY.allowed_domains or any(
            domain.endswith(f".{d}") for d in _WEB_POLICY.allowed_domains
        ) else "unknown"
        meta: dict[str, Any] = {
            "source": "web_source",
            "connector_id": self.id,
            "url": url,
            "domain": domain,
            "content_type": raw.get("content_type") if isinstance(raw.get("content_type"), str) else None,
            "truncated": bool(raw.get("truncated")),
            "trust_level": trust_level,
        }
        print("[Nexora][Connector][Policy] validated", {"domain": domain, "trust": meta["trust_level"]})
        return NormalizedIngestionInput(input_type="text", payload={"text": text}, metadata=meta)

