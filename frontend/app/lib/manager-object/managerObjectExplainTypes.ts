/**
 * MO:2 — Generic Explain Engine schemas.
 * Reader/composer only. Canonical Runtime Truth > MO Context > Explanation > Presentation.
 */

import type { ManagerObjectIntent } from "./managerObjectInteractionFoundation.ts";
import type { ManagerObjectKind } from "./managerObjectInteractionFoundation.ts";

export const genericExplainEngineIdentity = "MO:2/GenericExplainEngine" as const;
export const genericExplainEngineVersion = "1.0.0" as const;

export const EXPLANATION_DEPTHS = Object.freeze([
  "QUICK",
  "STANDARD",
  "DEEP",
] as const);
export type ExplanationDepth = (typeof EXPLANATION_DEPTHS)[number];

export const EXPLANATION_FOCUSES = Object.freeze([
  "overview",
  "significance",
  "drivers",
  "relationships",
  "evidence",
  "uncertainty",
  "implications",
  "recommendation",
] as const);
export type ExplanationFocus = (typeof EXPLANATION_FOCUSES)[number];

export const EXPLANATION_EPISTEMIC_STATUSES = Object.freeze([
  "KNOWN",
  "INFERRED",
  "UNKNOWN",
  "PREDICTED",
] as const);
export type ExplanationEpistemicStatus =
  (typeof EXPLANATION_EPISTEMIC_STATUSES)[number];

export const EXPLANATION_ACTIONS = Object.freeze([
  "INVESTIGATE",
  "VIEW_RELATIONSHIPS",
  "COMPARE_SCENARIOS",
  "RECOMMEND",
  "DECIDE",
  "VIEW_EXECUTION",
  "CHECK_OUTCOME",
] as const);
export type ExplanationActionId = (typeof EXPLANATION_ACTIONS)[number];

export const EXPLANATION_CAUSAL_CLAIMS = Object.freeze([
  "none",
  "possible-contributor",
  "confirmed",
] as const);
export type ExplanationCausalClaim = (typeof EXPLANATION_CAUSAL_CLAIMS)[number];

export const GENERIC_EXPLAIN_ENGINE_BOUNDARY = Object.freeze({
  identity: genericExplainEngineIdentity,
  readerComposer: true as const,
  redesignsStage: false as const,
  redesignsAdvisor: false as const,
  redesignsEiRuntime: false as const,
  writesStageCoordinates: false as const,
  createsParallelTruth: false as const,
  fabricatesMissingEvidence: false as const,
  inventsDecisions: false as const,
  startsExecution: false as const,
  usesLlm: false as const,
  perObjectExplanationBranches: false as const,
  truthPrecedence:
    "Canonical Runtime Truth > MO Context > Explanation > Presentation" as const,
  llmBoundary:
    "Optional future wording only. Must not invent KPI, state, relationships, causes, risks, scenarios, decisions, or outcomes." as const,
});

export type ExecutiveObjectExplanationSubject = {
  readonly id: string | null;
  readonly label: string | null;
  readonly kind: ManagerObjectKind | null;
};

export type ExecutiveObjectExplanationEvidenceItem = {
  readonly text: string;
  readonly support: ExplanationEpistemicStatus;
  readonly sourceAuthority: string | null;
};

export type ExecutiveObjectExplanationRelationship = {
  readonly text: string;
  readonly relationKind: string;
  readonly otherId: string | null;
  readonly otherLabel: string;
  readonly support: ExplanationEpistemicStatus;
  readonly causalClaim: ExplanationCausalClaim;
};

export type ExecutiveObjectExplanationDriver = {
  readonly text: string;
  readonly support: ExplanationEpistemicStatus;
  readonly causalClaim: ExplanationCausalClaim;
};

export type ExecutiveObjectExplanationImplication = {
  readonly text: string;
  readonly support: ExplanationEpistemicStatus;
};

export type ExecutiveObjectExplanationAction = {
  readonly id: ExplanationActionId;
  readonly label: string;
  readonly available: true;
};

export type ExecutiveObjectExplanation = {
  readonly engineId: typeof genericExplainEngineIdentity;
  readonly subject: ExecutiveObjectExplanationSubject;
  readonly intent: ManagerObjectIntent;
  readonly focus: ExplanationFocus;
  readonly depth: ExplanationDepth;
  readonly summary: string | null;
  readonly currentSituation: string | null;
  readonly significance: string | null;
  readonly evidence: readonly ExecutiveObjectExplanationEvidenceItem[];
  readonly relationships: readonly ExecutiveObjectExplanationRelationship[];
  readonly drivers: readonly ExecutiveObjectExplanationDriver[];
  readonly implications: readonly ExecutiveObjectExplanationImplication[];
  readonly uncertainty: string | null;
  readonly recommendedNextQuestions: readonly string[];
  readonly availableActions: readonly ExecutiveObjectExplanationAction[];
  readonly epistemicStatus: ExplanationEpistemicStatus;
  readonly managerFacingText: string;
  readonly handoffRecommendation: boolean;
  readonly commitsDecision: false;
  readonly startsExecution: false;
  readonly usesLlm: false;
  readonly languageComposer: "deterministic";
};
