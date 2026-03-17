"""Optimization proposal lifecycle and safe application orchestration."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Callable
from uuid import uuid4

from app.schemas.policy_changes import PolicyChangeRequest
from app.schemas.policy_optimization import (
    OptimizationAction,
    OptimizationApplicationResult,
    OptimizationProposalListResponse,
    OptimizationProposalSet,
    PolicyOptimizationProposal,
)
from app.services.ai.control_plane.optimization_signals import OptimizationSignalCollector
from app.services.ai.control_plane.optimization_store import OptimizationStore
from app.services.ai.control_plane.policy_optimizer import PolicyOptimizer


class OptimizationService:
    """Manage optimization runs, proposal lifecycle, and governed application."""

    def __init__(
        self,
        *,
        store: OptimizationStore,
        signal_collector: OptimizationSignalCollector,
        optimizer: PolicyOptimizer,
        auto_apply_enabled_fn: Callable[[], bool],
        submit_policy_change_fn: Callable[[PolicyChangeRequest | dict], object],
        approve_policy_change_fn: Callable[[str, dict], object],
        activate_policy_change_fn: Callable[[str, dict], object],
    ) -> None:
        self.store = store
        self.signal_collector = signal_collector
        self.optimizer = optimizer
        self.auto_apply_enabled_fn = auto_apply_enabled_fn
        self.submit_policy_change_fn = submit_policy_change_fn
        self.approve_policy_change_fn = approve_policy_change_fn
        self.activate_policy_change_fn = activate_policy_change_fn
        self.store.reload()

    def run(self) -> OptimizationProposalSet:
        """Collect signals, create proposals, and auto-apply eligible low-risk proposals."""
        started_at = datetime.now(UTC).isoformat()
        signals = self.signal_collector.collect()
        proposals = [self.store.save(proposal) for proposal in self.optimizer.generate(signals)]
        auto_applied_results: list[OptimizationApplicationResult] = []
        if self.auto_apply_enabled_fn():
            for proposal in proposals:
                if proposal.risk_assessment.auto_apply_eligible and proposal.status == "proposed":
                    proposal.status = "approved"
                    proposal.approved_by = "optimizer"
                    proposal.updated_at = datetime.now(UTC).isoformat()
                    self.store.save(proposal)
                    auto_applied_results.append(
                        self.apply(proposal.proposal_id, OptimizationAction(actor_id="optimizer", reason="auto_apply"))
                    )
        completed_at = datetime.now(UTC).isoformat()
        return OptimizationProposalSet(
            run_id=f"optimization-run-{uuid4().hex}",
            started_at=started_at,
            completed_at=completed_at,
            source_signals=signals,
            proposals=self.list_proposals().proposals,
            auto_applied_results=auto_applied_results,
            decision_reason="Optimization run completed with deterministic heuristics.",
        )

    def list_proposals(self) -> OptimizationProposalListResponse:
        """Return stored optimization proposals."""
        return self.store.list()

    def get_proposal(self, proposal_id: str) -> PolicyOptimizationProposal:
        """Return one optimization proposal."""
        return self.store.get(proposal_id)

    def approve(self, proposal_id: str, action: OptimizationAction) -> PolicyOptimizationProposal:
        """Approve one proposal for application."""
        proposal = self.store.get(proposal_id)
        if proposal.risk_assessment.risk_level == "forbidden":
            raise ValueError("forbidden_optimization_proposal")
        proposal.status = "approved"
        proposal.approved_by = action.actor_id
        proposal.updated_at = datetime.now(UTC).isoformat()
        return self.store.save(proposal)

    def reject(self, proposal_id: str, action: OptimizationAction) -> PolicyOptimizationProposal:
        """Reject one proposal."""
        proposal = self.store.get(proposal_id)
        proposal.status = "rejected"
        proposal.rejected_by = action.actor_id
        proposal.updated_at = datetime.now(UTC).isoformat()
        return self.store.save(proposal)

    def apply(self, proposal_id: str, action: OptimizationAction) -> OptimizationApplicationResult:
        """Apply one approved or auto-eligible proposal through policy change workflow."""
        proposal = self.store.get(proposal_id)
        if proposal.risk_assessment.risk_level == "forbidden":
            raise ValueError("forbidden_optimization_proposal")
        if proposal.risk_assessment.approval_required and proposal.status != "approved":
            raise ValueError("optimization_proposal_requires_approval")

        change = self.submit_policy_change_fn(
            PolicyChangeRequest(
                title=f"Optimization: {proposal.optimization_type}",
                description=proposal.decision.decision_reason,
                scope_type=proposal.target_scope,
                tenant_id=proposal.tenant_id,
                workspace_id=proposal.workspace_id,
                proposed_by=action.actor_id,
                source="optimizer",
                payload=proposal.proposed_policy_patch,
            )
        )

        if getattr(change, "status", None) == "validation_failed":
            return OptimizationApplicationResult(
                proposal_id=proposal.proposal_id,
                applied=False,
                policy_change_id=change.change_id,
                policy_change_status=change.status,
                resulting_policy_version=change.resulting_policy_version,
                auto_applied=action.actor_id == "optimizer",
                decision_reason="Optimization proposal failed policy validation.",
            )

        if getattr(change, "status", None) == "pending":
            if action.actor_id == "optimizer":
                return OptimizationApplicationResult(
                    proposal_id=proposal.proposal_id,
                    applied=False,
                    policy_change_id=change.change_id,
                    policy_change_status=change.status,
                    resulting_policy_version=change.resulting_policy_version,
                    auto_applied=True,
                    decision_reason="Auto-apply stopped because downstream policy approval is required.",
                )
            change = self.approve_policy_change_fn(
                change.change_id,
                {"actor_id": action.actor_id, "reason": action.reason or "optimization_apply"},
            )

        if getattr(change, "status", None) in {"approved", "activated"}:
            change = self.activate_policy_change_fn(
                change.change_id,
                {"actor_id": action.actor_id, "reason": action.reason or "optimization_activate"},
            )

        proposal.status = "applied" if getattr(change, "status", None) == "activated" else proposal.status
        proposal.applied_by = action.actor_id if getattr(change, "status", None) == "activated" else proposal.applied_by
        proposal.linked_policy_change_id = change.change_id
        proposal.updated_at = datetime.now(UTC).isoformat()
        self.store.save(proposal)
        return OptimizationApplicationResult(
            proposal_id=proposal.proposal_id,
            applied=getattr(change, "status", None) == "activated",
            policy_change_id=change.change_id,
            policy_change_status=change.status,
            resulting_policy_version=change.resulting_policy_version,
            auto_applied=action.actor_id == "optimizer",
            decision_reason="Optimization proposal flowed through policy validation, approval, and activation.",
        )
