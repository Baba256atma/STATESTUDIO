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
