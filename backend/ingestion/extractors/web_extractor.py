"""Web extractor for Nexora ingestion."""

from __future__ import annotations

import re
from html.parser import HTMLParser
from urllib.error import URLError
from urllib.request import Request, urlopen


class _MainContentExtractor(HTMLParser):
    """Lightweight HTML to text extractor that skips noisy tags."""

    _BLOCK_TAGS = {"p", "div", "article", "section", "li", "h1", "h2", "h3", "h4", "h5", "h6", "br"}
    _IGNORE_TAGS = {"script", "style", "nav", "footer", "header", "noscript", "svg"}

    def __init__(self) -> None:
        super().__init__()
        self._chunks: list[str] = []
        self._ignore_depth = 0

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag in self._IGNORE_TAGS:
            self._ignore_depth += 1
            return
        if self._ignore_depth == 0 and tag in self._BLOCK_TAGS:
            self._chunks.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in self._IGNORE_TAGS and self._ignore_depth > 0:
            self._ignore_depth -= 1
            return
        if self._ignore_depth == 0 and tag in self._BLOCK_TAGS:
            self._chunks.append("\n")

    def handle_data(self, data: str) -> None:
        if self._ignore_depth > 0:
            return
        text = data.strip()
        if text:
            self._chunks.append(text)

    def as_text(self) -> str:
        joined = " ".join(self._chunks)
        joined = re.sub(r"\s*\n\s*", "\n", joined)
        joined = re.sub(r"\n{2,}", "\n\n", joined)
        joined = re.sub(r"[ \t]{2,}", " ", joined)
        return joined.strip()


def extract_text(payload: str) -> str:
    """Fetch a webpage and return readable text only."""
    request = Request(
        payload,
        headers={
            "User-Agent": "NexoraIngestion/1.0 (+https://nexora.local)",
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    try:
        with urlopen(request, timeout=10) as response:
            html = response.read().decode("utf-8", errors="ignore")
    except URLError as exc:
        raise RuntimeError(f"Unable to fetch webpage content: {payload}") from exc

    parser = _MainContentExtractor()
    parser.feed(html)
    text = parser.as_text()
    return text
