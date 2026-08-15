/**
 * CC:8 — Recommendation and evidence contracts.
 */

import type { ExecutiveReasoningReasonCode } from "./executiveReasoning.ts";

export const NEXORA_EXECUTIVE_EVIDENCE_SOURCE_KINDS = Object.freeze([
  "data-reality",
  "kpi",
  "relationship",
  "goal",
  "problem",
  "scenario",
  "decision",
  "execution",
  "runtime",
] as const);

export type NexoraExecutiveEvidenceSourceKind =
  (typeof NEXORA_EXECUTIVE_EVIDENCE_SOURCE_KINDS)[number];

export type NexoraExecutiveEvidenceReference = {
  readonly sourceKind: NexoraExecutiveEvidenceSourceKind;
  readonly sourceId: string;
  readonly subjectId?: string;
  readonly factKey?: string;
};

export const NEXORA_EXECUTIVE_RELATION_SUPPORT_KINDS = Object.freeze([
  "related",
  "constraining",
  "correlated",
  "causal",
  "uncertain",
] as const);

export type NexoraExecutiveRelationSupportKind =
  (typeof NEXORA_EXECUTIVE_RELATION_SUPPORT_KINDS)[number];

export type NexoraExecutiveEvidenceFact = {
  readonly evidenceId: string;
  readonly subjectId: string;
  readonly subjectLabel?: string;
  readonly attention?: "normal" | "elevated" | "important" | "critical";
  readonly status?: "stable" | "watch" | "risk" | "unresolved";
  readonly factKey?: string;
  readonly factValue?: string | number | boolean | null;
  readonly freshness?: "current" | "stale" | "unknown";
  readonly source: NexoraExecutiveEvidenceReference;
};

export type NexoraExecutiveEvidenceRelationship = {
  readonly relationshipId: string;
  readonly sourceSubjectId: string;
  readonly targetSubjectId: string;
  readonly supportKind: NexoraExecutiveRelationSupportKind;
  readonly source: NexoraExecutiveEvidenceReference;
};

export type NexoraExecutiveReasoningEvidencePack = {
  readonly facts: readonly NexoraExecutiveEvidenceFact[];
  readonly relationships: readonly NexoraExecutiveEvidenceRelationship[];
  readonly scopeSubjectIds: readonly string[];
};

export type NexoraExecutiveReason = {
  readonly code: ExecutiveReasoningReasonCode | string;
  readonly summary: string;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
};

export const NEXORA_EXECUTIVE_TRADEOFF_DIMENSIONS = Object.freeze([
  "cost",
  "time",
  "risk",
  "capacity",
  "revenue",
  "customer",
  "execution",
  "strategic-fit",
  "other",
] as const);

export type NexoraExecutiveTradeoffDimension =
  (typeof NEXORA_EXECUTIVE_TRADEOFF_DIMENSIONS)[number];

export type NexoraExecutiveTradeoff = {
  readonly dimension: NexoraExecutiveTradeoffDimension;
  readonly upside: string;
  readonly downside: string;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
};

export type NexoraExecutiveUncertainty = {
  readonly kind: string;
  readonly description: string;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
};

export type NexoraExecutiveSuggestedAction = {
  readonly actionId: string;
  readonly label: string;
  readonly kind:
    | "inspect"
    | "monitor"
    | "prepare-scenario"
    | "review-decision"
    | "none";
  readonly subjectId: string | null;
};

export const NEXORA_EXECUTIVE_RECOMMENDATION_KINDS = Object.freeze([
  "prioritize",
  "investigate",
  "monitor",
  "mitigate",
  "defer",
  "compare-options",
  "prepare-scenario",
  "no-action",
] as const);

export type NexoraExecutiveRecommendationKind =
  (typeof NEXORA_EXECUTIVE_RECOMMENDATION_KINDS)[number];

export const NEXORA_EXECUTIVE_RECOMMENDATION_STATUSES = Object.freeze([
  "supported",
  "insufficient-evidence",
  "conflicted",
  "not-applicable",
] as const);

export type NexoraExecutiveRecommendationStatus =
  (typeof NEXORA_EXECUTIVE_RECOMMENDATION_STATUSES)[number];

export const NEXORA_RECOMMENDATION_STRENGTHS = Object.freeze([
  "weak",
  "moderate",
  "strong",
] as const);

export type NexoraRecommendationStrength =
  (typeof NEXORA_RECOMMENDATION_STRENGTHS)[number];

export type NexoraExecutiveRecommendation = {
  readonly recommendationId: string;
  readonly subjectIds: readonly string[];
  readonly summary: string;
  readonly recommendationKind: NexoraExecutiveRecommendationKind;
  /**
   * Deterministic evidence-support score in [0,1].
   * Not a probabilistic model confidence.
   */
  readonly confidence: number;
  readonly strength: NexoraRecommendationStrength;
  readonly rationale: readonly NexoraExecutiveReason[];
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly tradeoffs: readonly NexoraExecutiveTradeoff[];
  readonly uncertainties: readonly NexoraExecutiveUncertainty[];
  readonly nextBestActions: readonly NexoraExecutiveSuggestedAction[];
  readonly requiresScenarioAnalysis: boolean;
  readonly requiresDecisionCommitment: boolean;
  readonly status: NexoraExecutiveRecommendationStatus;
};

export type NexoraExecutiveRecommendationResult = {
  readonly primaryRecommendation: NexoraExecutiveRecommendation | null;
  readonly alternatives: readonly NexoraExecutiveRecommendation[];
  readonly assessment: import("./executiveAssessment.ts").NexoraExecutiveAssessment;
  readonly status: NexoraExecutiveRecommendationStatus;
  readonly trace: NexoraExecutiveRecommendationTrace;
};

export type NexoraExecutiveRecommendationTrace = {
  readonly scopeSubjectId: string | null;
  readonly evidenceFactIds: readonly string[];
  readonly relationshipIds: readonly string[];
  readonly assessmentSignalCodes: readonly string[];
  readonly policyMatches: readonly string[];
  readonly conflicts: readonly string[];
  readonly candidateKinds: readonly string[];
  readonly finalKind: NexoraExecutiveRecommendationKind | null;
  readonly finalStatus: NexoraExecutiveRecommendationStatus;
  readonly reasons: readonly string[];
};
