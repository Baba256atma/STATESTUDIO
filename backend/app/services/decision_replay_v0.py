from __future__ import annotations

from typing import Any, Dict, List


def _safe_dict(x: Any) -> Dict[str, Any]:
    return x if isinstance(x, dict) else {}


def _safe_list(x: Any) -> List[Any]:
    return x if isinstance(x, list) else []


def build_decision_replay_v0(store, episode_id):
    """Build a replayable step sequence from an existing episode."""
    episode = store.get_episode(episode_id)
    frames = episode.frames or []

    steps: List[Dict[str, Any]] = []
    for i, frame in enumerate(frames):
        sys_state = _safe_dict(getattr(frame, "system_state", None))
        visual = _safe_dict(getattr(frame, "visual", None))

        label = getattr(frame, "input_text", None) or sys_state.get("input_text") or f"Step {i + 1}"

        scene_json = _safe_dict(sys_state.get("scene_json")) if isinstance(sys_state.get("scene_json"), dict) else {}
        if not scene_json and isinstance(visual.get("scene_json"), dict):
            scene_json = _safe_dict(visual.get("scene_json"))

        fragility = _safe_dict(sys_state.get("fragility"))
        conflicts = _safe_list(sys_state.get("conflicts"))
        risk_propagation = _safe_dict(sys_state.get("risk_propagation"))
        object_selection = _safe_dict(sys_state.get("object_selection"))

        if not fragility and isinstance(visual.get("fragility"), dict):
            fragility = _safe_dict(visual.get("fragility"))
        if not conflicts and isinstance(visual.get("conflicts"), list):
            conflicts = _safe_list(visual.get("conflicts"))
        if not risk_propagation and isinstance(visual.get("risk_propagation"), dict):
            risk_propagation = _safe_dict(visual.get("risk_propagation"))
        if not object_selection and isinstance(visual.get("object_selection"), dict):
            object_selection = _safe_dict(visual.get("object_selection"))

        steps.append(
            {
                "index": i,
                "label": str(label),
                "scene_json": scene_json,
                "fragility": fragility,
                "conflicts": conflicts,
                "risk_propagation": risk_propagation,
                "object_selection": object_selection,
            }
        )

    return {
        "episode_id": episode_id,
        "steps": steps,
        "summary": f"{len(steps)} replayable decision steps loaded.",
    }
