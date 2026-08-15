/**
 * CC:10 — Decision candidate + rationale contracts.
 */

import type { NexoraExecutiveEvidenceReference } from "./executiveRecommendation.ts";
import type { NexoraExecutiveDecisionStatus } from "./executiveDecisionTransition.ts";

export const NEXORA_DECISION_CANDIDATE_SOURCES = Object.freeze([
  "scenario",
  "recommendation",
  "existing-decision",
  "conversation",
] as const);

export type NexoraDecisionCandidateSource =
  (typeof NEXORA_DECISION_CANDIDATE_SOURCES)[number];

export const NEXORA_DECISION_CANDIDATE_STATUSES = Object.freeze([
  "candidate",
  "valid",
  "invalid",
  "confirmation-required",
] as const);

export type NexoraDecisionCandidateStatus =
  (typeof NEXORA_DECISION_CANDIDATE_STATUSES)[number];

export type NexoraDecisionCandidate = {
  readonly candidateId: string;
  readonly subjectId?: string;
  readonly scenarioId?: string;
  readonly recommendationId?: string;
  readonly decisionId?: string;
  readonly title: string;
  readonly source: NexoraDecisionCandidateSource;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly uncertaintyRefs: readonly string[];
  readonly status: NexoraDecisionCandidateStatus;
  readonly scenarioStatus?: string | null;
  readonly scenarioRevision?: number | null;
};

export type NexoraDecisionRationale = {
  readonly summary: string;
  readonly goalIds: readonly string[];
  readonly problemIds: readonly string[];
  readonly recommendationId?: string;
  readonly scenarioId?: string;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly uncertaintyRefs: readonly string[];
};

/**
 * Canonical conversational Decision — EXS1-compatible status/lock.
 * Identity is deterministic from candidate key (no Date.now()).
 */
export type NexoraExecutiveDecision = {
  readonly decisionId: string;
  readonly title: string;
  readonly status: NexoraExecutiveDecisionStatus;
  readonly locked: boolean;
  readonly subjectIds: readonly string[];
  readonly scenarioId?: string;
  readonly scenarioRevision?: number;
  readonly recommendationId?: string;
  readonly rationale?: NexoraDecisionRationale;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly uncertaintyRefs: readonly string[];
  readonly committedBy: "manager";
  readonly committedAt?: string;
  readonly source: "conversation";
  readonly workspaceId?: string | null;
  readonly modelId?: string | null;
  readonly candidateId?: string;
};

export function buildDeterministicDecisionId(candidateKey: string): string {
  const slug = candidateKey
    .toLowerCase()
    .replace(/[^a-z0-9:_-]+/g, "-")
    .replace(/^-|-$/g, "");
  return `cc10:decision:${slug || "unknown"}`;
}

export function buildDeterministicCandidateId(input: {
  readonly source: NexoraDecisionCandidateSource;
  readonly key: string;
}): string {
  const slug = input.key
    .toLowerCase()
    .replace(/[^a-z0-9:_-]+/g, "-")
    .replace(/^-|-$/g, "");
  return `cc10:candidate:${input.source}:${slug || "unknown"}`;
}
