/**
 * NPA-T VAI:1 — canonical Variable contract.
 *
 * A Variable is a contextual analytical role over existing trusted information.
 * It is not an executive Object and not a causal conclusion.
 */

import { vaiFoundationIdentity } from "./vaiIdentity.ts";

export const VAI_CONTEXTUAL_ROLES = Object.freeze([
  "LEVER",
  "OUTCOME",
  "PATH_OF_EFFECT",
  "MODERATOR",
  "CONTROL",
  "CONFOUNDER",
] as const);

export type VaiContextualRole = (typeof VAI_CONTEXTUAL_ROLES)[number];

export const VAI_SEMANTIC_STATUSES = Object.freeze([
  "MANAGER_CONFIRMED",
  "CONFIRMED",
  "BOUNDED",
  "AMBIGUOUS",
  "UNKNOWN",
] as const);

export type VaiSemanticStatus = (typeof VAI_SEMANTIC_STATUSES)[number];

export const VAI_DIRECTIONS = Object.freeze([
  "INCREASING",
  "DECREASING",
  "STABLE",
  "UNKNOWN",
] as const);

export type VaiDirection = (typeof VAI_DIRECTIONS)[number];

export const VAI_CONFIDENCE = Object.freeze(["HIGH", "MEDIUM", "LOW", "UNKNOWN"] as const);
export type VaiConfidence = (typeof VAI_CONFIDENCE)[number];

export const VAI_SOURCE_KINDS = Object.freeze([
  "MANAGER_CONFIRMED_SEMANTICS",
  "DATA_REALITY",
  "DATA_OBJECT",
  "KPI_OBSERVATION",
  "EVIDENCE",
  "OBJECT_ATTRIBUTE",
  "SCENARIO_ASSUMPTION",
  "EXECUTION_OBSERVATION",
] as const);

export type VaiSourceKind = (typeof VAI_SOURCE_KINDS)[number];

export type VaiKnown<T> = { readonly kind: "KNOWN"; readonly value: T };
export type VaiUnknown = { readonly kind: "UNKNOWN" };
export type VaiKnownOrUnknown<T> = VaiKnown<T> | VaiUnknown;

export type VaiProvenance = {
  readonly sourceKind: VaiSourceKind;
  readonly authority: string;
  readonly sourceRef: string;
};

export type VaiVariable = {
  readonly identity: typeof vaiFoundationIdentity;
  readonly variableId: string;
  readonly displayName: string;
  readonly analysisContextId: string;
  readonly role: VaiContextualRole;
  readonly roleIsContextual: true;
  readonly roleIsPermanentClassification: false;
  readonly isExecutiveObject: false;
  readonly objectKind: null;
  readonly value: VaiKnownOrUnknown<number | string>;
  readonly unit: VaiKnownOrUnknown<string>;
  readonly direction: VaiDirection;
  readonly confidence: VaiConfidence;
  readonly semanticStatus: VaiSemanticStatus;
  readonly semanticMeaning: string | null;
  readonly provenance: VaiProvenance;
  readonly relatedObjectIds: readonly string[];
  readonly causalAssertion: false;
  readonly causalClaim: null;
  readonly canonicalMutation: false;
};

export const VAI_FOUNDATION_CONTRACT = Object.freeze({
  identity: vaiFoundationIdentity,
  roles: VAI_CONTEXTUAL_ROLES,
  roleCount: 6 as const,
  createsObjects: false as const,
  createsKpis: false as const,
  createsProblems: false as const,
  createsRisks: false as const,
  createsScenarios: false as const,
  createsStageObjects: false as const,
  writesSemantics: false as const,
  writesEvidence: false as const,
  writesDataReality: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesAdvisorMemory: false as const,
  infersCausality: false as const,
  infersMissingValue: false as const,
  infersMissingDirection: false as const,
  managerFacingUi: false as const,
});
