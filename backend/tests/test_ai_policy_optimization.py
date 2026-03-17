from __future__ import annotations

import json
from pathlib import Path

from fastapi.testclient import TestClient

import main
from app.core.config import LocalAISettings
from app.routers.ai_control_plane import get_ai_control_plane_service
from app.schemas.policy_optimization import (
    OptimizationDecision,
    OptimizationRiskAssessment,
    PolicyOptimizationProposal,
    PolicyOptimizationSignal,
)
from app.schemas.policy_overlays import PolicyOverlayPayload
from app.services.ai.control_plane.control_plane_service import AIControlPlaneService


def _write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def _base_policy() -> dict:
    return {
        "version_info": {
            "policy_version": "policy-v1",
            "source": "file",
        },
        "routing": {
            "cloud_fallback_enabled": True,
            "cloud_for_reasoning_enabled": True,
            "cloud_allowed_tasks": ["analyze_scenario"],
        },
        "provider": {
            "cloud_provider_enabled": True,
        },
        "privacy": {
            "strict_mode": True,
            "cloud_blocked_sensitivity_levels": ["confidential", "restricted"],
            "local_required_sensitivity_levels": ["restricted"],
        },
        "evaluation": {
            "use_mock_providers": True,
            "include_audit_checks": True,
            "regression_enabled": True,
            "optimization_auto_apply_enabled": False,
        },
        "audit": {
            "enabled": True,
            "redact_sensitive_fields": True,
        },
        "telemetry": {
            "enabled": True,
            "redact_sensitive_fields": True,
        },
    }


def _service(tmp_path: Path) -> AIControlPlaneService:
    policy_path = tmp_path / "ai_policy.json"
    env_policy_dir = tmp_path / "policies"
    optimization_state_path = tmp_path / "policies" / "optimization.json"
    _write_json(policy_path, _base_policy())
    return AIControlPlaneService(
        LocalAISettings(),
        policy_path=policy_path,
        env_policy_dir=env_policy_dir,
        optimization_state_path=optimization_state_path,
    )


def _proposal(
    service: AIControlPlaneService,
    *,
    patch: dict,
    optimization_type: str = "tighten_fallback_rules",
) -> PolicyOptimizationProposal:
    now = service.get_version_info().loaded_at
    proposal = PolicyOptimizationProposal(
        proposal_id="proposal-test",
        optimization_type=optimization_type,  # type: ignore[arg-type]
        current_policy_version=service.get_version_info().policy_version,
        proposed_policy_patch=PolicyOverlayPayload.model_validate(patch),
        source_signals=[
            PolicyOptimizationSignal(
                signal_type="high_fallback_rate",
                source_component="telemetry",
                metric_name="fallback_rate",
                current_value=0.5,
                threshold_value=0.25,
                decision_reason="fallback high",
            )
        ],
        expected_benefit="test",
        risk_assessment=OptimizationRiskAssessment(
            risk_level="low",
            approval_required=False,
            auto_apply_eligible=True,
            policy_change_risk_level="low",
            decision_reason="test",
        ),
        decision=OptimizationDecision(
            decision_reason="test",
            expected_benefit="test",
            approval_required=False,
            auto_apply_eligible=True,
        ),
        created_at=now,
        updated_at=now,
    )
    proposal.risk_assessment = service.optimization_risk_engine.assess(proposal)
    proposal.decision = OptimizationDecision(
        decision_reason=proposal.risk_assessment.decision_reason,
        expected_benefit=proposal.expected_benefit,
        approval_required=proposal.risk_assessment.approval_required,
        auto_apply_eligible=proposal.risk_assessment.auto_apply_eligible,
    )
    return proposal


def test_signal_normalization(tmp_path: Path):
    service = _service(tmp_path)
    for index in range(6):
        trace_id = f"trace-{index}"
        service._record_telemetry_event(
            trace_id=trace_id,
            stage="fallback_applied",
            task_type="policy_optimization",
            success=True,
            metadata={},
        )
        service._record_telemetry_event(
            trace_id=trace_id,
            stage="response_returned",
            task_type="policy_optimization",
            success=True,
            metadata={},
        )

    signals = service.optimization_signal_collector.collect()

    assert any(signal.signal_type == "high_fallback_rate" for signal in signals)


def test_proposal_generation_from_known_signal(tmp_path: Path):
    service = _service(tmp_path)
    signals = [
        PolicyOptimizationSignal(
            signal_type="high_fallback_rate",
            source_component="telemetry",
            metric_name="fallback_rate",
            current_value=0.4,
            threshold_value=0.25,
            decision_reason="high fallback",
        )
    ]

    proposals = service.policy_optimizer.generate(signals)

    assert any(proposal.optimization_type == "tighten_fallback_rules" for proposal in proposals)


def test_risk_classification_forbidden_patch(tmp_path: Path):
    service = _service(tmp_path)
    proposal = _proposal(
        service,
        patch={"privacy": {"cloud_blocked_sensitivity_levels": ["confidential"]}},
    )

    risk = service.optimization_risk_engine.assess(proposal)

    assert risk.risk_level == "forbidden"


def test_low_risk_proposal_auto_apply_eligibility(tmp_path: Path):
    service = _service(tmp_path)
    proposal = _proposal(
        service,
        patch={"routing": {"cloud_fallback_enabled": False}},
    )

    risk = service.optimization_risk_engine.assess(proposal)

    assert risk.risk_level == "low"
    assert risk.auto_apply_eligible is True


def test_forbidden_proposal_rejection(tmp_path: Path):
    service = _service(tmp_path)
    proposal = _proposal(
        service,
        patch={"provider": {"cloud_provider_enabled": True}},
    )
    proposal.proposal_id = "proposal-forbidden"
    service.optimization_store.save(proposal)

    try:
        service.approve_policy_optimization_proposal(
            "proposal-forbidden",
            {"actor_id": "operator", "reason": "approve"},
        )
        assert False, "forbidden proposal should not be approved"
    except ValueError:
        assert True


def test_integration_with_policy_change_workflow(tmp_path: Path):
    service = _service(tmp_path)
    proposal = _proposal(
        service,
        patch={"routing": {"cloud_fallback_enabled": False}},
    )
    proposal.proposal_id = "proposal-apply"
    service.optimization_store.save(proposal)

    result = service.apply_policy_optimization_proposal(
        "proposal-apply",
        {"actor_id": "operator", "reason": "apply"},
    )

    assert result.applied is True
    assert result.policy_change_status == "activated"
    assert service.get_snapshot().routing.cloud_fallback_enabled is False


def test_optimization_endpoints_return_expected_structure(tmp_path: Path):
    service = _service(tmp_path)
    service._snapshot.evaluation.optimization_auto_apply_enabled = True
    for index in range(6):
        trace_id = f"trace-{index}"
        service._record_telemetry_event(
            trace_id=trace_id,
            stage="fallback_applied",
            task_type="policy_optimization",
            success=True,
            metadata={},
        )
        service._record_telemetry_event(
            trace_id=trace_id,
            stage="response_returned",
            task_type="policy_optimization",
            success=True,
            metadata={},
        )

    main.app.dependency_overrides[get_ai_control_plane_service] = lambda: service

    with TestClient(main.app) as client:
        run_response = client.post("/ai/local/control-plane/policy/optimize/run")
        proposals_response = client.get("/ai/local/control-plane/policy/optimize/proposals")
        proposal_id = proposals_response.json()["proposals"][0]["proposal_id"]
        detail_response = client.get(f"/ai/local/control-plane/policy/optimize/proposals/{proposal_id}")

    main.app.dependency_overrides.clear()

    assert run_response.status_code == 200
    assert proposals_response.status_code == 200
    assert detail_response.status_code == 200
    assert "source_signals" in run_response.json()
    assert "risk_assessment" in detail_response.json()
