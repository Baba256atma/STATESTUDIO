/**
 * NPA-T VAI:3 — analytical relationship and evidence-ladder contracts.
 * Projections only. Not canonical Evidence, Objects, or causal truth.
 */

import { vaiCausalSafetyIdentity } from "./vaiCausalIdentity.ts";
import type { VaiConfidence, VaiSemanticStatus } from "./vaiContract.ts";

export const VAI_RELATIONSHIP_LADDER = Object.freeze([
  "OBSERVED_TOGETHER",
  "ASSOCIATED",
  "DIRECTIONALLY_ASSOCIATED",
  "CAUSAL_HYPOTHESIS",
  "MANAGER_ASSERTED_CAUSE",
  "EVIDENCE_SUPPORTED_CAUSAL",
  "INSUFFICIENT",
] as const);

export type VaiRelationshipLadder = (typeof VAI_RELATIONSHIP_LADDER)[number];

export const VAI_ASSOCIATION_STATUSES = Object.freeze([
  "NONE",
  "WEAK",
  "SUPPORTED",
  "STRONG",
  "CONFLICTING",
] as const);

export type VaiAssociationStatus = (typeof VAI_ASSOCIATION_STATUSES)[number];

export const VAI_DIRECTION_STATUSES = Object.freeze([
  "NONE",
  "UNKNOWN",
  "TEMPORAL_CONSISTENT",
  "DIRECTIONAL",
] as const);

export type VaiDirectionStatus = (typeof VAI_DIRECTION_STATUSES)[number];

export const VAI_CAUSAL_STATUSES = Object.freeze([
  "UNCONFIRMED",
  "HYPOTHESIS",
  "MANAGER_ASSERTED",
  "BOUNDED_UNRESOLVED",
  "EVIDENCE_SUPPORTED",
] as const);

export type VaiCausalStatus = (typeof VAI_CAUSAL_STATUSES)[number];

export const VAI_SAFE_STATEMENT_CLASSES = Object.freeze([
  "OBSERVATION",
  "ASSOCIATION",
  "HYPOTHESIS",
  "MANAGER_ASSERTION",
  "INSUFFICIENT",
  "CONFLICTING",
] as const);

export type VaiSafeStatementClass = (typeof VAI_SAFE_STATEMENT_CLASSES)[number];

export const VAI_EVIDENCE_REF_KINDS = Object.freeze([
  "CO_OBSERVATION",
  "ASSOCIATION",
  "DIRECTIONAL",
  "TEMPORAL",
  "CONTRADICTION",
  "SCENARIO_ASSUMPTION",
  "MANAGER_ASSERTION",
] as const);

export type VaiEvidenceRefKind = (typeof VAI_EVIDENCE_REF_KINDS)[number];

export type VaiRelationshipScope = {
  readonly businessContext?: string;
  readonly timeContext?: string;
  readonly sourceScope?: string;
  readonly objectScope?: string;
};

export type VaiRelationshipEvidenceRef = {
  readonly evidenceRef: string;
  readonly kind: VaiEvidenceRefKind;
  readonly polarity: "SUPPORTING" | "CONFLICTING" | "NEUTRAL";
  readonly authority: "CC:8";
  readonly semanticStatus?: VaiSemanticStatus;
  readonly scope?: VaiRelationshipScope;
};

export type VaiManagerCausalAssertion = {
  readonly statement: string;
  readonly sourceRef: string;
  readonly assertedCauseVariableId?: string;
};

export type VaiCoreInt3CausalGate = {
  readonly relationKind: string;
  readonly causeEstablished: boolean;
};

export type VaiAnalyticalRelationship = {
  readonly identity: typeof vaiCausalSafetyIdentity;
  readonly relationshipId: string;
  readonly analysisContextId: string;
  readonly sourceVariableId: string;
  readonly targetRef: string;
  readonly targetKind: "VARIABLE" | "OBJECT";
  readonly relationshipStatus: VaiRelationshipLadder;
  readonly associationStatus: VaiAssociationStatus;
  readonly directionStatus: VaiDirectionStatus;
  readonly causalStatus: VaiCausalStatus;
  readonly confidence: VaiConfidence;
  readonly evidenceRefs: readonly string[];
  readonly provenance: readonly string[];
  readonly managerAssertion: VaiManagerCausalAssertion | null;
  readonly evidenceSupportedCausal: false | true;
  readonly alternativeExplanations: readonly string[];
  readonly unresolvedConfounders: readonly string[];
  readonly moderatorsConsidered: readonly string[];
  readonly moderationProven: false;
  readonly pathOfEffectCandidate: boolean;
  readonly mediationEstablished: false;
  readonly leverIdentified: boolean;
  readonly interventionEffectivenessClaimed: false;
  readonly temporalRelevance: boolean;
  readonly semanticCertainty: VaiSemanticStatus | "NOT_APPLICABLE";
  readonly conflictingEvidence: boolean;
  readonly scope: VaiRelationshipScope;
  readonly safeStatementClass: VaiSafeStatementClass;
  readonly safeStatement: string;
  readonly reasonCodes: readonly string[];
  readonly causalAssertion: false;
};

export const VAI_CAUSAL_SAFETY_BOUNDARY = Object.freeze({
  identity: vaiCausalSafetyIdentity,
  evidenceOwner: "CC:8" as const,
  causalImplicationOwner: "CORE-INT:3" as const,
  semanticOwner: "DATA-ADV" as const,
  parallelEvidenceStore: false as const,
  parallelCausalTruthStore: false as const,
  parallelCausalGraph: false as const,
  correlationEqualsCausation: false as const,
  temporalEqualsCausation: false as const,
  managerBeliefEqualsCausation: false as const,
  leverEqualsInterventionEffect: false as const,
  pathEqualsMediator: false as const,
  roleEqualsCause: false as const,
  scenarioAssumptionEqualsCause: false as const,
  countEqualsCausation: false as const,
  writesCanonicalState: false as const,
  startsVai4: false as const,
});
