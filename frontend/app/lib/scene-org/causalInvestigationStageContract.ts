/**
 * NexoCause stage presentation contract.
 * Review actions follow the canonical hypothesis lifecycle.
 */

import type { CausalHypothesisReviewAction, CausalHypothesisStatus } from "./canonicalCausalInvestigationDomain";

export const CAUSAL_INVESTIGATION_EMPTY =
  "No investigations have been created for this Deck." as const;

export const CAUSAL_INVESTIGATION_DEMO_NOTICE =
  "NexoCause is unavailable in a protected Demo. Demo data stays read-only, and no investigation is created." as const;

export const CAUSAL_INVESTIGATION_EXECUTIVE_NOTICE =
  "The Executive deck does not hold a NexoCause investigation. Choose a department Deck." as const;

export const CAUSAL_INVESTIGATION_REFERENCE_NOTICE =
  "These branches are investigation references. They are not established cause and effect." as const;

export const CAUSAL_REVIEW_ACTION_LABELS: Readonly<Record<CausalHypothesisReviewAction, string>> = Object.freeze({
  REQUEST_EVIDENCE: "Request More Evidence",
  START_REVIEW: "Start Review",
  REJECT: "Reject Hypothesis",
  RETURN_TO_INVESTIGATION: "Return to Investigation",
  ACCEPT_FOR_SCENARIO: "Accept for Scenario",
  REASSESS_EVIDENCE: "Reassess current evidence",
});

const ACTIONS: Readonly<Record<CausalHypothesisStatus, readonly CausalHypothesisReviewAction[]>> = Object.freeze({
  PROPOSED: Object.freeze(["REQUEST_EVIDENCE", "START_REVIEW"] as const),
  NEEDS_EVIDENCE: Object.freeze(["START_REVIEW"] as const),
  UNDER_REVIEW: Object.freeze(["REQUEST_EVIDENCE", "REJECT", "RETURN_TO_INVESTIGATION", "ACCEPT_FOR_SCENARIO"] as const),
  REJECTED: Object.freeze(["RETURN_TO_INVESTIGATION"] as const),
  ACCEPTED_FOR_SCENARIO: Object.freeze(["RETURN_TO_INVESTIGATION"] as const),
  ARCHIVED: Object.freeze([] as const),
});

export function causalReviewActionsForStatus(
  status: CausalHypothesisStatus,
): readonly CausalHypothesisReviewAction[] {
  return ACTIONS[status];
}

export function causalEvidenceStatusText(availability: string): string {
  const label = availability === "STALE_IMPORT"
    ? "Import replaced"
    : availability === "DETACHED" || availability === "MISSING" || availability === "DELETED" || availability === "MISSING_SOURCE" || availability === "MISSING_FIELD"
      ? "Source unavailable"
      : availability === "CURRENT" || availability === "CONFLICTING"
        ? "Current evidence"
        : availability.replaceAll("_", " ");
  return `${availability} · ${label}`;
}
