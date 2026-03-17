"""Forward-only environment promotion engine for AI policies."""

from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from app.schemas.policy_promotion import (
    EnvironmentType,
    PolicyPromotionRequest,
    PolicyPromotionResult,
    PromotionHistoryRecord,
)
from app.services.ai.control_plane.environment_policy_store import EnvironmentPolicyStore
from app.services.ai.control_plane.promotion_gates import PromotionGateEvaluator


VALID_PROMOTION_PATHS: dict[EnvironmentType, EnvironmentType] = {
    EnvironmentType.LOCAL: EnvironmentType.DEV,
    EnvironmentType.DEV: EnvironmentType.STAGING,
    EnvironmentType.STAGING: EnvironmentType.PRODUCTION,
}


class PolicyPromotionEngine:
    """Promote policy snapshots through explicit environments."""

    def __init__(
        self,
        store: EnvironmentPolicyStore,
        gates: PromotionGateEvaluator,
    ) -> None:
        self.store = store
        self.gates = gates

    def promote(self, request: PolicyPromotionRequest) -> PolicyPromotionResult:
        """Promote a policy to the next environment when all gates pass."""
        now = datetime.now(UTC).isoformat()
        promotion_id = f"policy-promotion-{uuid4().hex}"
        expected_target = VALID_PROMOTION_PATHS.get(request.source_environment)
        if expected_target != request.target_environment:
            result = PolicyPromotionResult(
                promotion_id=promotion_id,
                source_environment=request.source_environment,
                target_environment=request.target_environment,
                policy_version=self.store.get_snapshot(request.source_environment).version_info.policy_version,
                promotion_timestamp=now,
                approved_by=request.approved_by,
                promotion_status="blocked",
                promotion_reason="Direct or skipped-environment promotion is not allowed.",
                gate_results=[],
                activated=False,
                activation_allowed=False,
            )
            self.store.append_history(PromotionHistoryRecord(**result.model_dump()))
            return result

        source_snapshot = self.store.get_snapshot(request.source_environment)
        gate_results = self.gates.evaluate(request=request, snapshot=source_snapshot)
        activation_allowed = all(result.passed for result in gate_results)
        if not activation_allowed:
            result = PolicyPromotionResult(
                promotion_id=promotion_id,
                source_environment=request.source_environment,
                target_environment=request.target_environment,
                policy_version=source_snapshot.version_info.policy_version,
                promotion_timestamp=now,
                approved_by=request.approved_by,
                promotion_status="blocked",
                promotion_reason="Promotion was blocked by one or more gates.",
                gate_results=gate_results,
                activated=False,
                activation_allowed=False,
            )
            self.store.append_history(PromotionHistoryRecord(**result.model_dump()))
            return result

        target_state = self.store.set_snapshot(
            request.target_environment,
            source_snapshot,
            source_environment=request.source_environment,
        )
        result = PolicyPromotionResult(
            promotion_id=promotion_id,
            source_environment=request.source_environment,
            target_environment=request.target_environment,
            policy_version=target_state.policy_version,
            promotion_timestamp=now,
            approved_by=request.approved_by,
            promotion_status="promoted",
            promotion_reason=request.promotion_reason,
            gate_results=gate_results,
            activated=True,
            activation_allowed=True,
        )
        self.store.append_history(PromotionHistoryRecord(**result.model_dump()))
        return result
