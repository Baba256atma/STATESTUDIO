from __future__ import annotations

from typing import Any, Dict, List


def _safe_dict(value: Any) -> Dict[str, Any]:
    return value if isinstance(value, dict) else {}


def _safe_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def _fnum(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except Exception:
        return float(default)


def _compact_list(values: List[Any], limit: int = 6) -> List[Any]:
    return list(values[: max(0, int(limit))]) if isinstance(values, list) else []


def build_backend_engine_roles() -> Dict[str, Any]:
    return {
        "version": "nexora_backend_alignment_v1",
        "entrypoint": "/chat",
        "roles": {
            "signal_engine": {
                "module": "backend.chaos_engine.core",
                "responsibility": "Deterministic signal and pressure interpretation from prompt text.",
            },
            "scene_adapter": {
                "module": "backend.chaos_engine.scene_adapter",
                "responsibility": "Maps signal outputs into additive scene actions.",
            },
            "structural_analysis": {
                "module": "backend.app.engines.fragility_v1 + backend.app.services.risk_propagation_v0",
                "responsibility": "Fragility scoring and cascade-path enrichment.",
            },
            "loop_kpi_sync": {
                "module": "backend.app.services.loop_engine + main._kpi_step",
                "responsibility": "Maintains KPI state and activates loop interpretations.",
            },
            "memory_replay": {
                "module": "backend.memory.engine + backend.app.services.replay_store",
                "responsibility": "Optional context persistence and replay capture.",
            },
            "strategy_extensions": {
                "module": "backend.app.services.game_theory_v0 + strategic_* + opponent_model_v0",
                "responsibility": "Optional strategic packaging layered on top of core chat output.",
            },
            "scanner_readiness": {
                "module": "backend.app.services.chat_contract_alignment",
                "responsibility": "Prepares source-normalization and runtime handoff semantics for future scanner services.",
            },
            "response_packaging": {
                "module": "backend.main + backend.app.services.chat_contract_alignment",
                "responsibility": "Preserves MVP payload while exposing contract-aligned additive fields.",
            },
        },
    }


def build_signal_analysis_payload(
    chaos: Any,
    *,
    mode: str,
    allowed_objects: List[str] | None = None,
) -> Dict[str, Any]:
    return {
        "layer": "signal_interpretation",
        "mode": mode,
        "dominant_signal": getattr(chaos, "dominant_signal", None),
        "intensity": _fnum(getattr(chaos, "intensity", 0.0)),
        "volatility": _fnum(getattr(chaos, "volatility", getattr(chaos, "intensity", 0.0))),
        "top_signals": _compact_list(list(getattr(chaos, "top_signals", []) or []), limit=5),
        "affected_objects": _compact_list(list(getattr(chaos, "affected_objects", []) or []), limit=8),
        "candidate_objects": [obj for obj in (allowed_objects or []) if isinstance(obj, str)],
        "domain_hint": getattr(chaos, "domain_hint", None),
        "explanation": getattr(chaos, "explanation", None),
        "handoff": _safe_dict(getattr(chaos, "risk_handoff", {})),
    }


def build_structural_analysis_payload(
    *,
    fragility: Dict[str, Any] | None,
    risk_propagation: Dict[str, Any] | None,
    loops: List[dict] | None,
    conflicts: List[dict] | None,
    active_loop: Any,
) -> Dict[str, Any]:
    fragility = _safe_dict(fragility)
    risk_propagation = _safe_dict(risk_propagation)
    loop_items = [loop for loop in _safe_list(loops) if isinstance(loop, dict)]
    conflict_items = [conflict for conflict in _safe_list(conflicts) if isinstance(conflict, dict)]
    return {
        "layer": "structural_analysis",
        "fragility_score": _fnum(fragility.get("score", 0.0)),
        "fragility_level": fragility.get("level"),
        "fragility_reasons": _compact_list(_safe_list(fragility.get("reasons")), limit=5),
        "drivers": _safe_dict(fragility.get("drivers")),
        "loops": {
            "count": len(loop_items),
            "active_loop": active_loop,
            "top": _compact_list(loop_items, limit=3),
        },
        "risk_propagation": {
            "sources": _compact_list(_safe_list(risk_propagation.get("sources")), limit=6),
            "edges": _compact_list(_safe_list(risk_propagation.get("edges")), limit=8),
            "summary": risk_propagation.get("summary"),
        },
        "conflicts": _compact_list(conflict_items, limit=6),
    }


def build_runtime_alignment_payload(
    *,
    scene_json: Dict[str, Any] | None,
    mode: str,
    allowed_objects: List[str] | None,
    focused_object_id: str | None,
) -> Dict[str, Any]:
    scene_json = _safe_dict(scene_json)
    state_vector = _safe_dict(scene_json.get("state_vector"))
    scene_section = _safe_dict(scene_json.get("scene"))
    return {
        "layer": "runtime_project_handoff",
        "mode": mode,
        "focused_object_id": focused_object_id,
        "allowed_objects": [obj for obj in (allowed_objects or []) if isinstance(obj, str)],
        "state_vector": {
            "intensity": _fnum(state_vector.get("intensity", 0.0)),
            "volatility": _fnum(state_vector.get("volatility", 0.0)),
            "inventory_pressure": _fnum(state_vector.get("inventory_pressure", 0.0)),
            "time_pressure": _fnum(state_vector.get("time_pressure", 0.0)),
            "quality_risk": _fnum(state_vector.get("quality_risk", 0.0)),
        },
        "scene_counts": {
            "objects": len(_safe_list(scene_section.get("objects"))),
            "loops": len(_safe_list(scene_section.get("loops"))),
        },
        "readiness": {
            "project_assembly": True,
            "runtime_integration": True,
            "scenario_simulation": True,
            "outcome_comparison": True,
        },
    }


def build_scanner_readiness_payload() -> Dict[str, Any]:
    return {
        "layer": "scanner_readiness",
        "supported_source_types": [
            "plain_text",
            "document_text",
            "webpage_text",
            "repository_summary",
            "structured_json",
            "dataset_summary",
            "api_snapshot",
        ],
        "prepared_handoffs": [
            "source_normalization",
            "entity_relation_loop_extraction",
            "domain_mapping",
            "project_assembly",
            "runtime_integration",
        ],
        "status": "ready_for_future_alignment",
    }


def build_executive_context_payload(
    *,
    analysis_summary: str | None,
    fragility: Dict[str, Any] | None,
    risk_propagation: Dict[str, Any] | None,
) -> Dict[str, Any]:
    fragility = _safe_dict(fragility)
    risk_propagation = _safe_dict(risk_propagation)
    reasons = _safe_list(fragility.get("reasons"))
    top_reason = reasons[0] if reasons and isinstance(reasons[0], dict) else {}
    return {
        "analysis_summary": analysis_summary,
        "headline": top_reason.get("message") or analysis_summary,
        "fragility_level": fragility.get("level"),
        "top_driver": top_reason.get("code"),
        "risk_summary": risk_propagation.get("summary"),
    }


def build_replay_system_state(
    *,
    mode: str,
    intent: str,
    allowed_objects: List[str] | None,
    focused_object_id: str | None,
    scene_json: Dict[str, Any] | None,
    source: str | None,
    chaos: Any,
    fragility: Dict[str, Any] | None,
    loops: List[dict] | None,
    risk_propagation: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    scene_json = _safe_dict(scene_json)
    scene_section = _safe_dict(scene_json.get("scene"))
    return {
        "mode": mode,
        "intent": intent,
        "allowed_objects": [obj for obj in (allowed_objects or []) if isinstance(obj, str)],
        "focused_object_id": focused_object_id,
        "kpi": _safe_dict(scene_section.get("kpi")) or None,
        "fragility": _safe_dict(fragility) or None,
        "loops": [loop for loop in _safe_list(loops) if isinstance(loop, dict)] or None,
        "risk_propagation": _safe_dict(risk_propagation) or None,
        "chaos": {
            "intensity": _fnum(getattr(chaos, "intensity", 0.0)),
            "volatility": _fnum(getattr(chaos, "volatility", getattr(chaos, "intensity", 0.0))),
            "dominant_signal": getattr(chaos, "dominant_signal", None),
            "top_signals": getattr(chaos, "top_signals", None),
            "affected_objects": getattr(chaos, "affected_objects", None),
            "explanation": getattr(chaos, "explanation", None),
        },
        "source": source,
    }


def package_chat_response(
    *,
    base_response: Dict[str, Any],
    scene_json: Dict[str, Any] | None,
    chaos: Any,
    mode: str,
    allowed_objects: List[str] | None,
    focused_object_id: str | None,
    fragility: Dict[str, Any] | None,
    risk_propagation: Dict[str, Any] | None,
    loops: List[dict] | None,
    conflicts: List[dict] | None,
    active_loop: Any,
    analysis_summary: str | None,
    engine_roles: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    response = dict(base_response)
    response["engine_stack"] = engine_roles or build_backend_engine_roles()
    response["signal_analysis"] = build_signal_analysis_payload(
        chaos,
        mode=mode,
        allowed_objects=allowed_objects,
    )
    response["structural_analysis"] = build_structural_analysis_payload(
        fragility=fragility,
        risk_propagation=risk_propagation,
        loops=loops,
        conflicts=conflicts,
        active_loop=active_loop,
    )
    response["runtime_alignment"] = build_runtime_alignment_payload(
        scene_json=scene_json,
        mode=mode,
        allowed_objects=allowed_objects,
        focused_object_id=focused_object_id,
    )
    response["scanner_readiness"] = build_scanner_readiness_payload()
    response["executive_context"] = build_executive_context_payload(
        analysis_summary=analysis_summary,
        fragility=fragility,
        risk_propagation=risk_propagation,
    )
    return response
