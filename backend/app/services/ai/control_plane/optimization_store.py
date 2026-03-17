"""File-backed storage for optimization proposals."""

from __future__ import annotations

import json
from pathlib import Path

from app.schemas.policy_optimization import (
    OptimizationProposalListResponse,
    PolicyOptimizationProposal,
)


BACKEND_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_OPTIMIZATION_STORE_PATH = BACKEND_ROOT / "config" / "policies" / "optimization_proposals.json"


class OptimizationStore:
    """Persist optimization proposals for the MVP."""

    def __init__(self, state_path: str | Path | None = None) -> None:
        self.state_path = Path(state_path) if state_path is not None else DEFAULT_OPTIMIZATION_STORE_PATH
        self._proposals: dict[str, PolicyOptimizationProposal] = {}
        self._last_error: str | None = None

    def reload(self) -> bool:
        """Reload proposals from disk."""
        try:
            if self.state_path.exists():
                payload = json.loads(self.state_path.read_text(encoding="utf-8"))
                proposals = payload.get("proposals", [])
                self._proposals = {
                    item["proposal_id"]: PolicyOptimizationProposal.model_validate(item)
                    for item in proposals
                }
            self._last_error = None
            return True
        except Exception as exc:
            self._last_error = str(exc)
            return False

    def save(self, proposal: PolicyOptimizationProposal) -> PolicyOptimizationProposal:
        """Store one proposal."""
        self._proposals[proposal.proposal_id] = proposal.model_copy(deep=True)
        self._persist()
        return self.get(proposal.proposal_id)

    def get(self, proposal_id: str) -> PolicyOptimizationProposal:
        """Return one proposal."""
        proposal = self._proposals.get(proposal_id)
        if proposal is None:
            raise KeyError("policy_optimization_proposal_not_found")
        return proposal.model_copy(deep=True)

    def list(self) -> OptimizationProposalListResponse:
        """Return all proposals."""
        proposals = sorted(
            (item.model_copy(deep=True) for item in self._proposals.values()),
            key=lambda item: item.created_at,
            reverse=True,
        )
        return OptimizationProposalListResponse(proposals=proposals)

    def _persist(self) -> None:
        self.state_path.parent.mkdir(parents=True, exist_ok=True)
        payload = {"proposals": [item.model_dump() for item in self._proposals.values()]}
        self.state_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
