"""Deterministic policy optimization proposal generator."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Callable
from uuid import uuid4

from app.schemas.control_plane import AIPolicySnapshot
from app.schemas.policy_canary import CanaryReleaseState
from app.schemas.policy_experiments import ExperimentRunState
from app.schemas.policy_optimization import (
    OptimizationDecision,
    PolicyOptimizationProposal,
    PolicyOptimizationSignal,
)
from app.schemas.policy_overlays import PolicyOverlayPayload
from app.services.ai.control_plane.optimization_risk import OptimizationRiskEngine


class PolicyOptimizer:
    """Generate small, explainable policy optimization proposals."""

    def __init__(
        self,
        *,
        risk_engine: OptimizationRiskEngine,
        current_policy_fn: Callable[[], AIPolicySnapshot],
        canary_state_fn: Callable[[], CanaryReleaseState | None],
        experiments_fn: Callable[[], list[ExperimentRunState]],
        environment_snapshot_fn: Callable[[str], AIPolicySnapshot],
    ) -> None:
        self.risk_engine = risk_engine
        self.current_policy_fn = current_policy_fn
        self.canary_state_fn = canary_state_fn
        self.experiments_fn = experiments_fn
        self.environment_snapshot_fn = environment_snapshot_fn

    def generate(self, signals: list[PolicyOptimizationSignal]) -> list[PolicyOptimizationProposal]:
        """Generate proposals from normalized signals."""
        proposals: list[PolicyOptimizationProposal] = []
        snapshot = self.current_policy_fn()
        now = datetime.now(UTC).isoformat()

        by_type = {signal.signal_type: signal for signal in signals}

        if "high_fallback_rate" in by_type and snapshot.routing.cloud_fallback_enabled:
            proposals.append(
                self._proposal(
                    optimization_type="tighten_fallback_rules",
                    current_policy_version=snapshot.version_info.policy_version,
                    patch={"routing": {"cloud_fallback_enabled": False}},
                    signal=by_type["high_fallback_rate"],
                    expected_benefit="Reduce repeated fallback behavior by preferring deterministic local routing.",
                    created_at=now,
                )
            )

        if "high_routing_failure_rate" in by_type and snapshot.routing.cloud_for_reasoning_enabled:
            proposals.append(
                self._proposal(
                    optimization_type="reduce_cloud_reasoning",
                    current_policy_version=snapshot.version_info.policy_version,
                    patch={"routing": {"cloud_for_reasoning_enabled": False}},
                    signal=by_type["high_routing_failure_rate"],
                    expected_benefit="Reduce provider execution failures by disabling cloud reasoning until quality recovers.",
                    created_at=now,
                )
            )

        if "canary_promotion_ready" in by_type:
            canary_state = self.canary_state_fn()
            if canary_state is not None:
                patch = _build_patch(snapshot, canary_state.canary_snapshot)
                if _patch_not_empty(patch):
                    proposals.append(
                        self._proposal(
                            optimization_type="promote_canary_winner",
                            current_policy_version=snapshot.version_info.policy_version,
                            patch=patch,
                            signal=by_type["canary_promotion_ready"],
                            expected_benefit="Promote a healthy canary winner to the stable default policy.",
                            created_at=now,
                        )
                    )

        if "experiment_winner" in by_type:
            experiment_id = str(by_type["experiment_winner"].signal_metadata.get("experiment_id", ""))
            experiment = next((item for item in self.experiments_fn() if item.experiment_id == experiment_id), None)
            if experiment is not None and experiment.winning_variant is not None:
                variant = next(
                    (item for item in experiment.variants if item.variant_name == experiment.winning_variant),
                    None,
                )
                if variant is not None:
                    target_snapshot = self.environment_snapshot_fn(variant.source_environment.value)
                    patch = _build_patch(snapshot, target_snapshot)
                    if _patch_not_empty(patch):
                        proposals.append(
                            self._proposal(
                                optimization_type="promote_experiment_winner",
                                current_policy_version=snapshot.version_info.policy_version,
                                patch=patch,
                                signal=by_type["experiment_winner"],
                                expected_benefit="Promote a winning experiment variant with better measured quality.",
                                created_at=now,
                            )
                        )

        if "benchmark_weights_missing" in by_type:
            proposals.append(
                self._proposal(
                    optimization_type="adjust_benchmark_weights",
                    current_policy_version=snapshot.version_info.policy_version,
                    patch={"benchmark": {"weights": {"quality": 0.5, "latency": 0.3, "cost": 0.2}}},
                    signal=by_type["benchmark_weights_missing"],
                    expected_benefit="Restore benchmark tuning behavior with explicit optimization weights.",
                    created_at=now,
                )
            )

        return proposals

    def _proposal(
        self,
        *,
        optimization_type: str,
        current_policy_version: str,
        patch: dict,
        signal: PolicyOptimizationSignal,
        expected_benefit: str,
        created_at: str,
    ) -> PolicyOptimizationProposal:
        proposal = PolicyOptimizationProposal(
            proposal_id=f"policy-optimization-{uuid4().hex}",
            optimization_type=optimization_type,  # type: ignore[arg-type]
            current_policy_version=current_policy_version,
            proposed_policy_patch=PolicyOverlayPayload.model_validate(patch),
            source_signals=[signal],
            expected_benefit=expected_benefit,
            risk_assessment={
                "risk_level": "high",
                "approval_required": True,
                "auto_apply_eligible": False,
                "policy_change_risk_level": "high",
                "decision_reason": "pending_risk_assessment",
            },
            decision={
                "decision_reason": signal.decision_reason,
                "expected_benefit": expected_benefit,
                "approval_required": True,
                "auto_apply_eligible": False,
            },
            created_at=created_at,
            updated_at=created_at,
        )
        risk = self.risk_engine.assess(proposal)
        proposal.risk_assessment = risk
        proposal.decision = OptimizationDecision(
            decision_reason=risk.decision_reason,
            expected_benefit=expected_benefit,
            approval_required=risk.approval_required,
            auto_apply_eligible=risk.auto_apply_eligible,
        )
        return proposal


def _build_patch(current: AIPolicySnapshot, target: AIPolicySnapshot) -> dict:
    current_payload = current.model_dump()
    target_payload = target.model_dump()
    patch: dict = {}
    for field in ["enabled", "routing", "privacy", "provider", "model", "benchmark", "audit", "telemetry", "evaluation"]:
        if current_payload.get(field) != target_payload.get(field):
            patch[field] = target_payload.get(field)
    return patch


def _patch_not_empty(patch: dict) -> bool:
    return any(value not in ({}, [], None) for value in patch.values())
