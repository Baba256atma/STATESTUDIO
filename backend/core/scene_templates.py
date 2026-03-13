# backend/core/scene_templates.py
from datetime import datetime, timezone
from copy import deepcopy

BASE_SCENE = {
    "meta": {
        "schema_version": "1.0",
        "project_name": "StateStudio",
        "domain": "business",
        "timestamp": None,
    },
    "domain_model": {
        "business": {
            "labor": {"count": 5},
            "equipment": {"active": 3, "down": 0},
            "inventory": {"quantity": 120, "unit": "pcs", "status": "normal"},
            "quality": {"defect_rate": 0.02, "status": "ok"},
            "safety": {"risk_level": 0.2, "status": "acceptable"},
            "time": {"delay_days": 0, "schedule_status": "on_track"},
        },
        "spirit": None,
        "character": None,
        "chaos": None,
    },
    "state_vector": {
        "time_pressure": 0.2,
        "quality_risk": 0.2,
        "inventory_pressure": 0.2,
    },
    "scene": {
        "camera": {"pos": [0, 3, 8], "lookAt": [0, 0, 0]},
        "lights": [
            {"type": "ambient", "intensity": 0.6},
            {"type": "directional", "pos": [5, 8, 3], "intensity": 0.9},
        ],
        "objects": [],
        "animations": [],
    },
}

def new_scene(domain: str = "business") -> dict:
    data = deepcopy(BASE_SCENE)
    data["meta"]["domain"] = domain
    data["meta"]["timestamp"] = datetime.now(timezone.utc).isoformat()
    return data

# =========================
# Nexora MVP Mapping Layer
# =========================

def _clamp01(x: float) -> float:
    try:
        return max(0.0, min(1.0, float(x)))
    except Exception:
        return 0.0


def map_state_to_scene_objects(scene: dict) -> dict:
    """
    MVP mapping:
    - domain_model + state_vector
    → scene.objects (DecisionGraph3D compatible)

    This function mutates and returns the scene dict.
    No DB, no files, safe for MVP free version.
    """

    state = scene.get("state_vector", {}) or {}
    domain = scene.get("domain_model", {}).get("business", {}) or {}

    objects = []

    # ---- Time Pressure Object ----
    time_pressure = _clamp01(state.get("time_pressure", 0.0))
    time_status = domain.get("time", {}).get("schedule_status", "on_track")

    objects.append({
        "id": "obj_time",
        "label": "Time Pressure",
        "pos": [0, 0.8, 0],
        "state": "critical" if time_pressure > 0.7 else "warning" if time_pressure > 0.4 else "stable",
        "intensity": time_pressure,
    })

    # ---- Inventory Pressure Object ----
    inv_pressure = _clamp01(state.get("inventory_pressure", 0.0))
    inv_status = domain.get("inventory", {}).get("status", "normal")

    objects.append({
        "id": "obj_inventory",
        "label": "Inventory",
        "pos": [-1.2, -0.6, 0],
        "state": "critical" if inv_pressure > 0.7 else "warning" if inv_pressure > 0.4 else "stable",
        "intensity": inv_pressure,
    })

    # ---- Quality Risk Object ----
    quality_risk = _clamp01(state.get("quality_risk", 0.0))
    defect_rate = domain.get("quality", {}).get("defect_rate", 0.0)

    objects.append({
        "id": "obj_quality",
        "label": "Quality Risk",
        "pos": [1.2, -0.6, 0],
        "state": "critical" if quality_risk > 0.7 else "warning" if quality_risk > 0.4 else "stable",
        "intensity": quality_risk,
    })

    # Attach to scene
    scene.setdefault("scene", {})
    scene["scene"]["objects"] = objects

    return scene


def map_loops_from_state(scene: dict) -> dict:
    """
    Detect a simple reinforcing loop:
    Time Pressure → Quality Risk → Inventory Pressure → Time Pressure
    """

    state = scene.get("state_vector", {}) or {}

    tp = _clamp01(state.get("time_pressure", 0.0))
    qr = _clamp01(state.get("quality_risk", 0.0))
    ip = _clamp01(state.get("inventory_pressure", 0.0))

    loop_intensity = _clamp01((tp + qr + ip) / 3.0)

    loops = []

    if loop_intensity > 0.35:
        loops.append({
            "id": "loop_core_delivery",
            "label": "Reinforcing Delivery Loop",
            "path": ["obj_time", "obj_quality", "obj_inventory", "obj_time"],
            "intensity": loop_intensity,
            "pulseSpeed": 0.6 + loop_intensity,
            "active": True,
        })

    scene.setdefault("scene", {})
    scene["scene"]["loops"] = loops

    return scene
