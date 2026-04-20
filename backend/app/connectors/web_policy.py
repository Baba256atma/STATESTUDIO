"""B.10.d — policy gate for web ingestion connectors."""

from __future__ import annotations

from dataclasses import dataclass, field
from urllib.parse import urlparse


@dataclass(frozen=True)
class WebIngestionPolicy:
    allowed_domains: set[str] = field(
        default_factory=lambda: {
            "reuters.com",
            "bbc.com",
            "wsj.com",
            "nytimes.com",
        }
    )
    blocked_domains: set[str] = field(
        default_factory=lambda: {
            "localhost",
            "127.0.0.1",
        }
    )
    max_url_length: int = 500


def extract_domain(url: str) -> str:
    netloc = urlparse(url).netloc.lower().strip()
    if ":" in netloc:
        netloc = netloc.split(":", 1)[0]
    return netloc


def _is_domain_match(host: str, domain: str) -> bool:
    host_norm = host.lstrip(".").lower()
    dom_norm = domain.lstrip(".").lower()
    return host_norm == dom_norm or host_norm.endswith(f".{dom_norm}")


def validate_url_policy(url: str, policy: WebIngestionPolicy) -> str:
    if len(url) > policy.max_url_length:
        raise ValueError("URL too long")

    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise ValueError("Invalid URL scheme")

    domain = extract_domain(url)
    if not domain:
        raise ValueError("Invalid URL domain")

    if any(_is_domain_match(domain, blocked) for blocked in policy.blocked_domains):
        raise ValueError("Blocked domain")

    if policy.allowed_domains and not any(_is_domain_match(domain, allowed) for allowed in policy.allowed_domains):
        raise ValueError(f"Domain not allowed: {domain}")

    return domain

