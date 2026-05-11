from __future__ import annotations

from copy import deepcopy
from typing import Any


def clone_scene_snapshot(scene_snapshot: dict[str, Any]) -> dict[str, Any]:
    """Create an isolated scene clone for sandbox-only analysis."""
    if not isinstance(scene_snapshot, dict):
        return {}
    return deepcopy(scene_snapshot)
