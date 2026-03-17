"""File-backed loading helpers for AI control plane policy snapshots."""

from __future__ import annotations

import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from app.core.config import LocalAISettings
from app.schemas.control_plane import AIPolicySnapshot
from app.services.ai.control_plane.default_policies import build_default_policy_snapshot


BACKEND_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_POLICY_PATH = BACKEND_ROOT / "config" / "ai_policy.json"


class PolicyLoader:
    """Load and validate AI policy snapshots from local storage."""

    def __init__(self, settings: LocalAISettings, policy_path: str | Path | None = None) -> None:
        self.settings = settings
        self.policy_path = Path(policy_path) if policy_path is not None else DEFAULT_POLICY_PATH

    def load(self) -> AIPolicySnapshot:
        """Load the effective policy snapshot or fall back to defaults."""
        defaults = build_default_policy_snapshot(self.settings)
        if not self.policy_path.exists():
            return defaults

        payload = self._read_payload(self.policy_path)
        merged_payload = _deep_merge(defaults.model_dump(), payload)
        snapshot = AIPolicySnapshot.model_validate(merged_payload)
        snapshot.version_info.loaded_at = datetime.now(UTC).isoformat()
        snapshot.version_info.source = "file"
        return snapshot

    def _read_payload(self, path: Path) -> dict[str, Any]:
        suffix = path.suffix.lower()
        raw_text = path.read_text(encoding="utf-8")
        if suffix == ".json":
            return self._ensure_mapping(json.loads(raw_text))
        if suffix in {".yaml", ".yml"}:
            try:
                import yaml
            except ImportError as exc:
                raise ValueError("yaml_support_not_installed") from exc
            return self._ensure_mapping(yaml.safe_load(raw_text))
        raise ValueError("unsupported_policy_format")

    @staticmethod
    def _ensure_mapping(payload: Any) -> dict[str, Any]:
        if not isinstance(payload, dict):
            raise ValueError("policy_payload_must_be_object")
        return payload


def _deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    merged = dict(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = _deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged
