/**
 * Nexora Constitution Rule #14 — Recommendation Ownership runtime guard.
 */

import {
  ADVISORY_ALLOWED_RECOMMENDATION_ACTIONS,
  GOVERNANCE_ALLOWED_APPROVAL_ACTIONS,
  NEXORA_RULE_14_ACTIVE_TAG,
  NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
  NEXORA_RULE_14_VERSION,
  RECOMMENDATION_OWNERSHIP_ACTOR_IDS,
  RULE_14_BLOCKED_VIOLATIONS_BY_ACTOR,
  RULE_14_PRIMARY_ACTOR_IDS,
  WAR_ROOM_ALLOWED_RULE_14_COMMITMENT_ACTIONS,
  type AdvisoryRecommendationAction,
  type GovernanceApprovalAction,
  type RecommendationOwnershipActorId,
  type Rule14CertificationResult,
  type Rule14RecommendationOwnershipAttempt,
  type Rule14RecommendationOwnershipGuardResult,
  type Rule14ViolationKind,
  type WarRoomCommitmentOwnershipAction,
} from "./nexoraRule14RecommendationOwnershipContract.ts";

const loggedGuardKeys = new Set<string>();
const loggedActiveKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logRecommendationOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG, detail);
}

function logActiveOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedActiveKeys.has(key)) return;
  loggedActiveKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_14_ACTIVE_TAG, detail);
}

function buildBlockedResult(
  attempt: Rule14RecommendationOwnershipAttempt,
  violationKind: Rule14ViolationKind,
  reason: string
): Extract<Rule14RecommendationOwnershipGuardResult, { allowed: false }> {
  return Object.freeze({
    allowed: false as const,
    tag: NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
    reason,
    violationKind,
    sourceActor: attempt.sourceActor,
  });
}

function violationReason(
  actor: RecommendationOwnershipActorId,
  violationKind: Rule14ViolationKind
): string {
  switch (violationKind) {
    case "issue_recommendations":
      return `${actor} must not issue recommendations — Advisory owns recommendation.`;
    case "approve_decisions":
      return `${actor} must not approve decisions — Governance owns approval.`;
    case "commit_decisions":
      return `${actor} must not commit decisions — War Room owns commitment.`;
    default:
      return "Rule #14 recommendation ownership contract violated.";
  }
}

function isViolationBlockedForActor(
  actor: RecommendationOwnershipActorId,
  violationKind: Rule14ViolationKind
): boolean {
  return (RULE_14_BLOCKED_VIOLATIONS_BY_ACTOR[actor] as readonly string[]).includes(
    violationKind
  );
}

export function guardNexoraRule14RecommendationOwnership(
  attempt: Rule14RecommendationOwnershipAttempt
): Rule14RecommendationOwnershipGuardResult {
  if (
    attempt.violationKind &&
    isViolationBlockedForActor(attempt.sourceActor, attempt.violationKind)
  ) {
    const result = buildBlockedResult(
      attempt,
      attempt.violationKind,
      violationReason(attempt.sourceActor, attempt.violationKind)
    );
    logRecommendationOnce(`${attempt.sourceActor}:${attempt.violationKind}`, {
      action: "recommendation_ownership_blocked",
      violationKind: attempt.violationKind,
      sourceActor: attempt.sourceActor,
      source: attempt.source ?? null,
    });
    return result;
  }

  if (
    attempt.sourceActor === "advisory" &&
    attempt.recommendationAction &&
    (ADVISORY_ALLOWED_RECOMMENDATION_ACTIONS as readonly string[]).includes(
      attempt.recommendationAction
    )
  ) {
    logRecommendationOnce(`allowed:recommendation:${attempt.recommendationAction}`, {
      action: "advisory_recommendation_allowed",
      recommendationAction: attempt.recommendationAction,
      source: attempt.source ?? null,
    });
    return Object.freeze({
      allowed: true as const,
      tag: NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
    });
  }

  if (
    attempt.sourceActor === "governance" &&
    attempt.approvalAction &&
    (GOVERNANCE_ALLOWED_APPROVAL_ACTIONS as readonly string[]).includes(attempt.approvalAction)
  ) {
    logRecommendationOnce(`allowed:approval:${attempt.approvalAction}`, {
      action: "governance_approval_allowed",
      approvalAction: attempt.approvalAction,
      source: attempt.source ?? null,
    });
    return Object.freeze({
      allowed: true as const,
      tag: NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
    });
  }

  if (
    attempt.sourceActor === "war_room" &&
    attempt.commitmentAction &&
    (WAR_ROOM_ALLOWED_RULE_14_COMMITMENT_ACTIONS as readonly string[]).includes(
      attempt.commitmentAction
    )
  ) {
    logRecommendationOnce(`allowed:commitment:${attempt.commitmentAction}`, {
      action: "war_room_commitment_allowed",
      commitmentAction: attempt.commitmentAction,
      source: attempt.source ?? null,
    });
    return Object.freeze({
      allowed: true as const,
      tag: NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
    });
  }

  if (attempt.sourceActor !== "advisory" && attempt.recommendationAction) {
    return guardNexoraRule14RecommendationOwnership({
      sourceActor: attempt.sourceActor,
      violationKind: "issue_recommendations",
      source: attempt.source ?? null,
    });
  }

  if (attempt.sourceActor !== "governance" && attempt.approvalAction) {
    return guardNexoraRule14RecommendationOwnership({
      sourceActor: attempt.sourceActor,
      violationKind: "approve_decisions",
      source: attempt.source ?? null,
    });
  }

  if (attempt.sourceActor !== "war_room" && attempt.commitmentAction) {
    return guardNexoraRule14RecommendationOwnership({
      sourceActor: attempt.sourceActor,
      violationKind: "commit_decisions",
      source: attempt.source ?? null,
    });
  }

  return Object.freeze({
    allowed: true as const,
    tag: NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
  });
}

export function guardAdvisoryRecommendationAction(input: {
  action: AdvisoryRecommendationAction;
  source?: string | null;
}): Rule14RecommendationOwnershipGuardResult {
  return guardNexoraRule14RecommendationOwnership({
    sourceActor: "advisory",
    recommendationAction: input.action,
    source: input.source ?? null,
  });
}

export function guardGovernanceApprovalAction(input: {
  action: GovernanceApprovalAction;
  source?: string | null;
}): Rule14RecommendationOwnershipGuardResult {
  return guardNexoraRule14RecommendationOwnership({
    sourceActor: "governance",
    approvalAction: input.action,
    source: input.source ?? null,
  });
}

export function guardWarRoomRecommendationOwnershipAction(input: {
  action: WarRoomCommitmentOwnershipAction | "issue_recommendation" | "approve_decision";
  source?: string | null;
}): Rule14RecommendationOwnershipGuardResult {
  if (input.action === "issue_recommendation") {
    return guardNexoraRule14RecommendationOwnership({
      sourceActor: "war_room",
      violationKind: "issue_recommendations",
      source: input.source ?? null,
    });
  }

  if (input.action === "approve_decision") {
    return guardNexoraRule14RecommendationOwnership({
      sourceActor: "war_room",
      violationKind: "approve_decisions",
      source: input.source ?? null,
    });
  }

  return guardNexoraRule14RecommendationOwnership({
    sourceActor: "war_room",
    commitmentAction: input.action,
    source: input.source ?? null,
  });
}

export function guardWorkspaceRecommendationOwnershipViolation(input: {
  actor: RecommendationOwnershipActorId;
  violationKind: Rule14ViolationKind;
  source?: string | null;
}): Rule14RecommendationOwnershipGuardResult {
  return guardNexoraRule14RecommendationOwnership({
    sourceActor: input.actor,
    violationKind: input.violationKind,
    source: input.source ?? null,
  });
}

export function verifyNexoraRule14CertificationCompliance(
  actorId: RecommendationOwnershipActorId
): Rule14CertificationResult {
  const violations: string[] = [];

  const assertBlocked = (
    attempt: Rule14RecommendationOwnershipAttempt,
    label: string
  ): void => {
    if (!attempt.violationKind) return;
    const result = guardNexoraRule14RecommendationOwnership(attempt);
    if (result.allowed) {
      violations.push(`${label} is not blocked by Rule #14 guard.`);
    }
  };

  for (const violationKind of RULE_14_BLOCKED_VIOLATIONS_BY_ACTOR[actorId]) {
    assertBlocked({ sourceActor: actorId, violationKind }, `${actorId} ${violationKind}`);
  }

  switch (actorId) {
    case "advisory":
      for (const action of ADVISORY_ALLOWED_RECOMMENDATION_ACTIONS) {
        const allowed = guardAdvisoryRecommendationAction({ action, source: "certification" });
        if (!allowed.allowed) {
          violations.push(`${action} is blocked but must be allowed under Rule #14.`);
        }
      }
      break;
    case "governance":
      for (const action of GOVERNANCE_ALLOWED_APPROVAL_ACTIONS) {
        const allowed = guardGovernanceApprovalAction({ action, source: "certification" });
        if (!allowed.allowed) {
          violations.push(`${action} is blocked but must be allowed under Rule #14.`);
        }
      }
      break;
    case "war_room":
      for (const action of WAR_ROOM_ALLOWED_RULE_14_COMMITMENT_ACTIONS) {
        const allowed = guardWarRoomRecommendationOwnershipAction({
          action,
          source: "certification",
        });
        if (!allowed.allowed) {
          violations.push(`${action} is blocked but must be allowed under Rule #14.`);
        }
      }
      break;
    default:
      break;
  }

  return Object.freeze({
    compliant: violations.length === 0,
    actorId,
    tag: NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
    violations: Object.freeze(violations),
  });
}

export function verifyAllRecommendationOwnershipActorsRule14Compliance(): Rule14CertificationResult[] {
  return RECOMMENDATION_OWNERSHIP_ACTOR_IDS.map((actorId) =>
    verifyNexoraRule14CertificationCompliance(actorId)
  );
}

export function verifyPrimaryRecommendationOwnershipRule14Compliance(): Rule14CertificationResult[] {
  return RULE_14_PRIMARY_ACTOR_IDS.map((actorId) =>
    verifyNexoraRule14CertificationCompliance(actorId)
  );
}

export function traceNexoraRule14ActiveOnce(scopeKey?: string | null): void {
  logActiveOnce(`active:${scopeKey ?? "default"}`, {
    action: "rule_14_active",
    version: NEXORA_RULE_14_VERSION,
    tag: NEXORA_RULE_14_ACTIVE_TAG,
    warRoomOwnsCommitment: true,
    advisoryOwnsRecommendation: true,
    governanceOwnsApproval: true,
    scopeKey: scopeKey ?? null,
  });
}

export function resetNexoraRule14RecommendationOwnershipRuntimeForTests(): void {
  loggedGuardKeys.clear();
  loggedActiveKeys.clear();
}
