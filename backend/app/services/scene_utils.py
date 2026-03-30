"""Pure scene helper utilities extracted from the FastAPI entrypoint."""

from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any


def sync_intensity(scene_json: dict[str, Any], intensity: float, volatility: float | None = None) -> dict[str, Any]:
    """Keep intensity in sync to avoid UI mismatch."""
    try:
        if not isinstance(scene_json, dict):
            return scene_json
        vol_value = float(volatility) if volatility is not None else None

        sv = scene_json.get("state_vector")
        if not isinstance(sv, dict):
            sv = {}
            scene_json["state_vector"] = sv
        sv["intensity"] = float(intensity)
        if vol_value is not None:
            sv["volatility"] = vol_value

        scene = scene_json.get("scene")
        if not isinstance(scene, dict):
            scene = {}
            scene_json["scene"] = scene

        inner_sv = scene.get("state_vector")
        if not isinstance(inner_sv, dict):
            inner_sv = {}
            scene["state_vector"] = inner_sv
        inner_sv["intensity"] = float(intensity)
        if vol_value is not None:
            inner_sv["volatility"] = vol_value

        inner = scene.get("scene")
        if not isinstance(inner, dict):
            inner = {}
            scene["scene"] = inner
        inner["intensity"] = float(intensity)
        if vol_value is not None:
            inner["volatility"] = vol_value
        return scene_json
    except Exception:
        return scene_json


def sync_scene_state(scene_json: dict[str, Any] | None) -> dict[str, Any] | None:
    """Ensure nested scene state mirrors top-level state_vector."""
    if not isinstance(scene_json, dict):
        return scene_json
    sv = scene_json.get("state_vector")
    sc = scene_json.get("scene")
    if not isinstance(sv, dict) or not isinstance(sc, dict):
        return scene_json
    sc_scene = sc.get("scene")
    if not isinstance(sc_scene, dict):
        sc_scene = {}
        sc["scene"] = sc_scene
    sc_sv = sc.get("state_vector")
    if not isinstance(sc_sv, dict):
        sc_sv = {}
        sc["state_vector"] = sc_sv
    if "intensity" in sv:
        sc_scene["intensity"] = sv["intensity"]
        sc_sv["intensity"] = sv["intensity"]
    if "volatility" in sv:
        sc_scene["volatility"] = sv["volatility"]
        sc_sv["volatility"] = sv["volatility"]
    return scene_json


def clamp01(x: float) -> float:
    try:
        v = float(x)
    except Exception:
        return 0.0
    if v < 0.0:
        return 0.0
    if v > 1.0:
        return 1.0
    return v


def coerce_pos3(raw: Any) -> list[float] | None:
    if isinstance(raw, list) and len(raw) >= 3:
        try:
            return [float(raw[0]), float(raw[1]), float(raw[2])]
        except Exception:
            return None
    if isinstance(raw, dict):
        try:
            x = float(raw.get("x"))
            y = float(raw.get("y"))
            z = float(raw.get("z"))
            return [x, y, z]
        except Exception:
            return None
    return None


def semantic_zone_for_object(obj: dict[str, Any]) -> str:
    oid = str(obj.get("id") or "").lower()
    typ = str(obj.get("type") or "").lower()
    lbl = str(obj.get("label") or obj.get("name") or "").lower()
    tags = obj.get("tags")
    tag_text = " ".join(str(t).lower() for t in tags) if isinstance(tags, list) else ""
    txt = f"{oid} {typ} {lbl} {tag_text}"
    if any(k in txt for k in ["supplier", "source", "upstream", "procure"]):
        return "supplier"
    if any(k in txt for k in ["delivery", "transport", "ship", "flow"]):
        return "delivery"
    if any(k in txt for k in ["inventory", "warehouse", "stock", "buffer", "core"]):
        return "inventory"
    if any(k in txt for k in ["order", "customer", "demand"]):
        return "demand"
    if any(k in txt for k in ["risk", "delay", "issue", "price", "cash"]):
        return "risk"
    return "unknown"


def grid_fallback_position(index: int, *, row_size: int = 4, spacing: float = 3.0) -> list[float]:
    i = max(0, int(index))
    col = i % row_size
    row = i // row_size
    x = (col - ((row_size - 1) / 2.0)) * spacing
    z = ((1.0 - row) * spacing) * 0.7
    return [float(x), 0.0, float(z)]


def resolve_object_position(obj: dict[str, Any], fallback_index: int = 0) -> list[float]:
    pos = coerce_pos3(obj.get("position"))
    if pos is not None:
        return pos
    tr = obj.get("transform")
    if isinstance(tr, dict):
        tr_pos = coerce_pos3(tr.get("pos"))
        if tr_pos is not None:
            return tr_pos
    zone = semantic_zone_for_object(obj)
    zone_base: dict[str, list[float]] = {
        "supplier": [-6.0, 0.0, 0.0],
        "delivery": [-3.0, 0.0, 0.0],
        "inventory": [0.0, 0.0, 0.0],
        "demand": [3.0, 0.0, 0.0],
        "risk": [0.0, 0.0, -3.0],
    }
    if zone in zone_base:
        base = zone_base[zone]
        offset_x = ((fallback_index % 3) - 1) * 0.9
        offset_z = ((fallback_index // 3) % 2) * 0.8
        return [base[0] + offset_x, base[1], base[2] + offset_z]
    return grid_fallback_position(fallback_index)


def ensure_default_positions(objects: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Ensure objects have stable default positions for line/loop rendering."""
    if not isinstance(objects, list):
        return objects

    for idx, obj in enumerate(objects):
        if not isinstance(obj, dict):
            continue
        oid = obj.get("id")
        if not isinstance(oid, str) or not oid:
            continue
        resolved = resolve_object_position(obj, idx)
        obj["position"] = resolved
        tr = obj.get("transform")
        if isinstance(tr, dict):
            if coerce_pos3(tr.get("pos")) is None:
                tr["pos"] = list(resolved)
        else:
            obj["transform"] = {"pos": list(resolved)}

    return objects


def build_base_scene_json(
    mode: str,
    scene_actions: dict[str, Any] | None,
    intensity: float,
    volatility: float | None = None,
) -> dict[str, Any]:
    scene_json = {
        "meta": {
            "version": os.getenv("APP_VERSION", "dev"),
            "generated_at": datetime.now(timezone.utc).isoformat(),
        },
        "domain_model": {"mode": mode},
        "state_vector": {
            "intensity": float(intensity),
            "volatility": float(volatility if volatility is not None else intensity),
        },
        "scene": scene_actions or {},
    }
    scene_json = sync_intensity(scene_json, intensity, volatility)
    return sync_scene_state(scene_json) or scene_json


def scene_state_summary(
    scene_json: dict[str, Any] | None,
    fallback_intensity: float,
    fallback_volatility: float,
) -> str:
    try:
        sv = scene_json.get("state_vector", {}) if isinstance(scene_json, dict) else {}
        intensity = float(sv.get("intensity", fallback_intensity))
        volatility = float(sv.get("volatility", fallback_volatility))
        return f"intensity={intensity:.2f}, volatility={volatility:.2f}"
    except Exception:
        return f"intensity={float(fallback_intensity):.2f}, volatility={float(fallback_volatility):.2f}"


def bump_scene_intensity(scene: dict[str, Any], delta: float) -> float:
    try:
        sv = scene.get("state_vector") if isinstance(scene, dict) else None
        if not isinstance(sv, dict):
            sv = {}
            if isinstance(scene, dict):
                scene["state_vector"] = sv
        cur = float(sv.get("intensity", 0.34) or 0.34)
        nxt = max(0.0, min(1.0, cur + float(delta)))
        sv["intensity"] = nxt
        return nxt
    except Exception:
        return 0.34


def apply_intensity_to_objects(
    scene: dict[str, Any],
    intensity: float,
    allow_ids: list[str] | None = None,
) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    objects_local = None
    try:
        sc = scene.get("scene") if isinstance(scene, dict) else None
        if isinstance(sc, dict):
            objects_local = sc.get("objects")
        if not isinstance(objects_local, list):
            objects_local = scene.get("objects") if isinstance(scene, dict) else None
    except Exception:
        objects_local = None

    if not isinstance(objects_local, list):
        return out

    scale = 1.0 + (max(0.0, min(1.0, float(intensity))) * 0.8)
    allowed = set(allow_ids) if isinstance(allow_ids, list) and allow_ids else None

    for obj in objects_local:
        if not isinstance(obj, dict):
            continue
        oid = obj.get("id")
        if not isinstance(oid, str) or not oid:
            continue
        if allowed is not None and oid not in allowed:
            continue
        out.append(
            {
                "type": "applyObject",
                "object": oid,
                "value": {
                    "id": oid,
                    "scale": scale,
                    "color": obj.get("color") or "#3498db",
                    "emphasis": float(obj.get("emphasis", 0.0) or 0.0),
                },
            }
        )
    return out
