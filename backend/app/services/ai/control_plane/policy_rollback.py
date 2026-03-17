"""Rollback helpers for environment policy snapshots."""

from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from app.schemas.policy_promotion import (
    EnvironmentType,
    PolicyRollbackRequest,
    PolicyRollbackResult,
    PromotionHistoryRecord,
)
from app.services.ai.control_plane.environment_policy_store import EnvironmentPolicyStore


class PolicyRollbackService:
    """Rollback an environment to its last-known-good policy snapshot."""

    def __init__(self, store: EnvironmentPolicyStore) -> None:
        self.store = store

    def rollback(
        self,
        *,
        environment: EnvironmentType,
        request: PolicyRollbackRequest,
    ) -> PolicyRollbackResult:
        """Rollback one environment if a last-known-good snapshot exists."""
        now = datetime.now(UTC).isoformat()
        current = self.store.get_snapshot(environment)
        previous = self.store.get_last_known_good_snapshot(environment)
        if previous is None:
            return PolicyRollbackResult(
                environment=environment,
                rolled_back=False,
                policy_version=current.version_info.policy_version,
                previous_policy_version=None,
                rollback_timestamp=now,
                actor_id=request.actor_id,
                reason="No last-known-good policy is available for rollback.",
            )

        self.store.set_snapshot(environment, previous, source_environment=environment)
        result = PolicyRollbackResult(
            environment=environment,
            rolled_back=True,
            policy_version=previous.version_info.policy_version,
            previous_policy_version=current.version_info.policy_version,
            rollback_timestamp=now,
            actor_id=request.actor_id,
            reason=request.reason,
        )
        self.store.append_history(
            PromotionHistoryRecord(
                promotion_id=f"policy-rollback-{uuid4().hex}",
                policy_version=previous.version_info.policy_version,
                source_environment=environment,
                target_environment=environment,
                promotion_timestamp=now,
                approved_by=request.actor_id,
                promotion_status="rolled_back",
                promotion_reason=request.reason or "Environment rollback executed.",
                gate_results=[],
            )
        )
        return result
