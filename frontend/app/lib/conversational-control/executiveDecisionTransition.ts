/**
 * CC:10 — Canonical Decision status + transition policy.
 *
 * Reuses EXS1 DecisionStatus vocabulary and lock semantics so conversational
 * commitment and UI Decision actions converge on one status machine.
 */

export const NEXORA_EXECUTIVE_DECISION_STATUSES = Object.freeze([
  "Draft",
  "Under Review",
  "Approved",
  "Rejected",
  "Archived",
] as const);

export type NexoraExecutiveDecisionStatus =
  (typeof NEXORA_EXECUTIVE_DECISION_STATUSES)[number];

export const NEXORA_DECISION_TRANSITION_ACTIONS = Object.freeze([
  "create",
  "approve",
  "reject",
  "defer",
  "reconsider",
  "archive",
] as const);

export type NexoraDecisionTransitionAction =
  (typeof NEXORA_DECISION_TRANSITION_ACTIONS)[number];

/**
 * Legal transitions aligned with EXS1 Runtime Store behavior:
 * - Draft → Under Review (review / defer park)
 * - Under Review → Approved | Rejected
 * - Approved → Archived (and locked while Approved)
 * - Rejected → Archived | Under Review (reconsider)
 * - Approved → Under Review (reconsider / return for analysis)
 * - Deferred conversationally: no invented status — park as Under Review
 */
export const NEXORA_DECISION_LEGAL_TRANSITIONS: Readonly<
  Record<
    NexoraExecutiveDecisionStatus,
    readonly NexoraExecutiveDecisionStatus[]
  >
> = Object.freeze({
  Draft: Object.freeze(["Under Review", "Approved", "Rejected"] as const),
  "Under Review": Object.freeze([
    "Approved",
    "Rejected",
    "Archived",
  ] as const),
  Approved: Object.freeze(["Under Review", "Archived"] as const),
  Rejected: Object.freeze(["Under Review", "Archived"] as const),
  Archived: Object.freeze([] as const),
});

export type NexoraDecisionTransitionRequest = {
  readonly decisionId?: string;
  readonly action: NexoraDecisionTransitionAction;
  readonly candidateId?: string;
  readonly targetStatus: NexoraExecutiveDecisionStatus;
  readonly source: "conversation";
};

export function resolveTargetStatusForAction(
  action: NexoraDecisionTransitionAction,
  current: NexoraExecutiveDecisionStatus | null,
): NexoraExecutiveDecisionStatus {
  switch (action) {
    case "create":
      return "Draft";
    case "approve":
      return "Approved";
    case "reject":
      return "Rejected";
    case "defer":
      return current === "Draft" || current == null
        ? "Under Review"
        : current;
    case "reconsider":
      return "Under Review";
    case "archive":
      return "Archived";
    default:
      return current ?? "Draft";
  }
}

export function isDecisionTransitionAllowed(input: {
  readonly currentStatus: NexoraExecutiveDecisionStatus | null;
  readonly locked: boolean;
  readonly action: NexoraDecisionTransitionAction;
  readonly targetStatus: NexoraExecutiveDecisionStatus;
}): { readonly allowed: boolean; readonly reason: string } {
  if (input.action === "create") {
    if (input.currentStatus == null) {
      return Object.freeze({ allowed: true, reason: "create-new" });
    }
    return Object.freeze({
      allowed: false,
      reason: "decision-already-exists",
    });
  }

  if (input.currentStatus == null) {
    // Approve/reject without existing Decision may create then transition.
    if (
      input.action === "approve" ||
      input.action === "reject" ||
      input.action === "defer"
    ) {
      return Object.freeze({ allowed: true, reason: "create-then-transition" });
    }
    return Object.freeze({
      allowed: false,
      reason: "missing-decision",
    });
  }

  if (input.currentStatus === "Archived") {
    return Object.freeze({
      allowed: false,
      reason: "archived-immutable",
    });
  }

  if (
    input.locked &&
    input.currentStatus === "Approved" &&
    input.action !== "reconsider" &&
    input.action !== "archive"
  ) {
    return Object.freeze({
      allowed: false,
      reason: "locked-decision",
    });
  }

  if (input.currentStatus === input.targetStatus) {
    return Object.freeze({
      allowed: true,
      reason: "already-at-target",
    });
  }

  const legal = NEXORA_DECISION_LEGAL_TRANSITIONS[input.currentStatus];
  if (!legal.includes(input.targetStatus)) {
    return Object.freeze({
      allowed: false,
      reason: "illegal-transition",
    });
  }

  return Object.freeze({ allowed: true, reason: "legal-transition" });
}
