/**
 * NPA-T VAI:2 — bounded analysis context and role-resolution contracts.
 * Reuses VAI:1 roles. Does not attach roles to canonical Objects or Variables.
 */

import type { VaiConfidence, VaiContextualRole } from "./vaiContract.ts";
import { vaiObjectRoleResolutionIdentity } from "./vaiObjectRoleIdentity.ts";

export const VAI_OBJECT_FAMILIES = Object.freeze([
  "GOAL",
  "KPI",
  "PROBLEM",
  "RISK",
  "SCENARIO",
  "EXECUTION",
  "OTHER",
] as const);

export type VaiObjectFamily = (typeof VAI_OBJECT_FAMILIES)[number];

export const VAI_ANALYSIS_PURPOSES = Object.freeze([
  "WHY_WORSENING",
  "WHAT_CAN_MANAGEMENT_CHANGE",
  "HOLD_STABLE_FOR_COMPARISON",
  "UNSPECIFIED",
] as const);

export type VaiAnalysisPurpose = (typeof VAI_ANALYSIS_PURPOSES)[number];

export const VAI_ROLE_STATUSES = Object.freeze([
  "CONFIRMED",
  "SUPPORTED",
  "CANDIDATE",
  "AMBIGUOUS",
  "UNKNOWN",
  "CONFLICTING",
] as const);

export type VaiRoleStatus = (typeof VAI_ROLE_STATUSES)[number];

export const VAI_RELEVANCE_STATUSES = Object.freeze([
  "TRUSTED",
  "UNRESOLVED_CANDIDATE",
  "REJECTED",
] as const);

export type VaiRelevanceStatus = (typeof VAI_RELEVANCE_STATUSES)[number];

export const VAI_RELEVANCE_BASES = Object.freeze([
  "OBJECT_REFERENCE",
  "DATA_REALITY",
  "MANAGER_CONFIRMED_SEMANTICS",
  "KPI_ASSOCIATION",
  "EVIDENCE_ASSOCIATION",
  "SCENARIO_ASSUMPTION",
  "EXECUTION_OBSERVATION",
  "BCA_CONTEXT",
  "NAME_SIMILARITY",
] as const);

export type VaiRelevanceBasis = (typeof VAI_RELEVANCE_BASES)[number];

export type VaiManagerConfirmedConstraint = {
  readonly variableId: string;
  readonly role: VaiContextualRole;
  readonly sourceRef: string;
};

export type VaiObjectRoleAnalysisContext = {
  readonly analysisContextId: string;
  readonly purpose: VaiAnalysisPurpose;
  readonly purposeNote?: string;
  readonly focalObjectId: string;
  readonly focalObjectFamily: VaiObjectFamily;
  readonly relatedObjectIds?: readonly string[];
  readonly availableVariableIds: readonly string[];
  readonly trustedSourceRefs?: readonly string[];
  readonly managerConfirmedConstraints?: readonly VaiManagerConfirmedConstraint[];
};

export type VaiRelevanceLink = {
  readonly variableId: string;
  readonly objectId: string;
  readonly basis: VaiRelevanceBasis;
  readonly trusted: boolean;
  readonly sourceRef: string;
};

export type VaiRoleEvidence = {
  readonly variableId: string;
  readonly role: VaiContextualRole;
  readonly status: Extract<VaiRoleStatus, "CONFIRMED" | "SUPPORTED" | "CANDIDATE">;
  readonly basis: string;
  readonly sourceRef: string;
  readonly confidence?: VaiConfidence;
};

export type VaiResolvedRoleCandidate = {
  readonly role: VaiContextualRole;
  readonly status: Extract<VaiRoleStatus, "CONFIRMED" | "SUPPORTED" | "CANDIDATE">;
  readonly confidence: VaiConfidence;
  readonly basis: string;
  readonly sourceRef: string;
  readonly reasonCode: string;
};

export type VaiObjectVariableRoleItem = {
  readonly identity: typeof vaiObjectRoleResolutionIdentity;
  readonly analysisContextId: string;
  readonly purpose: VaiAnalysisPurpose;
  readonly focalObjectId: string;
  readonly focalObjectFamily: VaiObjectFamily;
  readonly variableId: string;
  readonly displayName: string;
  readonly relevant: boolean;
  readonly relevanceStatus: VaiRelevanceStatus;
  readonly relevanceReasonCode: string;
  readonly roleStatus: VaiRoleStatus;
  readonly primaryRole: VaiContextualRole | null;
  readonly candidateRoles: readonly VaiResolvedRoleCandidate[];
  readonly conflict: boolean;
  readonly confidence: VaiConfidence;
  readonly provenance: readonly string[];
  readonly reasonCodes: readonly string[];
  readonly causalAssertion: false;
  readonly objectTypeDeterminedRole: false;
};

export const VAI_OBJECT_ROLE_BOUNDARY = Object.freeze({
  identity: vaiObjectRoleResolutionIdentity,
  consumesVai1: true as const,
  parallelObjectResolver: false as const,
  parallelVariableStore: false as const,
  parallelCausalGraph: false as const,
  infersCausality: false as const,
  objectTypeDeterminesRole: false as const,
  keywordSimilarityIsBusinessTruth: false as const,
  lastWriteWins: false as const,
  writesCanonicalState: false as const,
  startsVai3: false as const,
});
