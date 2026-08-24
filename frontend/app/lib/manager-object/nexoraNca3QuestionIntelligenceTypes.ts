/**
 * NCA:3 — Clarification, information-gap, and executive question contracts.
 * Conversation intelligence over NCA:1/NCA:2 and existing authorities.
 * Not a second evidence, uncertainty, goal, or decision system.
 */

export const nexoraNca3Identity =
  "NCA:3/ClarificationInformationGapExecutiveQuestionIntelligence" as const;
export const nexoraNca3Version = "1.0.0" as const;
export const nexoraNca3Namespace =
  "nexora.nca.clarification-information-gap-executive-question" as const;

export const NEXORA_NCA3_BOUNDARY = Object.freeze({
  identity: nexoraNca3Identity,
  createsSecondEvidenceStore: false as const,
  createsSecondUncertaintySystem: false as const,
  createsSecondGoalModel: false as const,
  createsSecondDecisionModel: false as const,
  createsSecondQuestionEngine: false as const,
  createsSurveyFramework: false as const,
  usesLiveLlm: false as const,
  startsExternalResearch: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  inventsBusinessTruth: false as const,
});

export const INFORMATION_GAP_CATEGORIES = Object.freeze([
  "MISSING_FACT",
  "MISSING_TIMEFRAME",
  "MISSING_TARGET",
  "MISSING_BASELINE",
  "MISSING_CONSTRAINT",
  "MISSING_CAUSAL_EVIDENCE",
  "MISSING_COST",
  "MISSING_RESOURCE",
  "MISSING_CAPACITY",
  "MISSING_PRIORITY",
  "MISSING_MANAGER_PREFERENCE",
  "MISSING_RISK_TOLERANCE",
  "MISSING_OPTION_DETAIL",
  "MISSING_ASSUMPTION",
  "MISSING_EXTERNAL_EVIDENCE",
  "MISSING_CONFIRMATION",
  "AMBIGUOUS_REFERENCE",
  "AMBIGUOUS_OBJECTIVE",
] as const);

export type InformationGapCategory =
  (typeof INFORMATION_GAP_CATEGORIES)[number];

export const INFORMATION_GAP_STATUSES = Object.freeze([
  "OPEN",
  "RESOLVED",
  "NOT_REQUIRED",
  "UNAVAILABLE",
  "DECLINED",
  "EXPIRED",
] as const);

export type InformationGapStatus = (typeof INFORMATION_GAP_STATUSES)[number];

export const KNOWLEDGE_SUFFICIENCY_STATES = Object.freeze([
  "INSUFFICIENT",
  "PARTIALLY_SUFFICIENT",
  "SUFFICIENT_WITH_UNCERTAINTY",
  "SUFFICIENT",
] as const);

export type KnowledgeSufficiencyState =
  (typeof KNOWLEDGE_SUFFICIENCY_STATES)[number];

export const EXECUTIVE_QUESTION_PURPOSES = Object.freeze([
  "RESOLVE_CAUSAL_UNCERTAINTY",
  "IDENTIFY_CONSTRAINT",
  "ESTABLISH_TARGET",
  "ESTABLISH_TIMEFRAME",
  "COMPARE_OPTIONS",
  "ESTABLISH_PREFERENCE",
  "ASSESS_RISK",
  "CONFIRM_FACT",
  "CLARIFY_REFERENCE",
  "CONFIRM_ACTION",
] as const);

export type ExecutiveQuestionPurpose =
  (typeof EXECUTIVE_QUESTION_PURPOSES)[number];

export const QUESTION_STRATEGY_MODES = Object.freeze([
  "ANSWER",
  "ASK",
  "PARTIAL_ANSWER",
] as const);

export type QuestionStrategyMode = (typeof QUESTION_STRATEGY_MODES)[number];

export type ExecutiveInformationGap = {
  readonly id: string;
  readonly category: InformationGapCategory;
  readonly questionBeingResolved: string;
  readonly purpose: ExecutiveQuestionPurpose;
  readonly expectedInformation: string;
  readonly status: InformationGapStatus;
  readonly relevanceToNeed: number;
  readonly relevanceToGoal: number;
  readonly relevanceToDecision: number;
  readonly couldChangeConclusion: boolean;
  readonly couldChangeRecommendation: boolean;
  readonly couldChangePriority: boolean;
  readonly couldChangeConfidence: boolean;
  readonly alreadyInNexora: boolean;
  readonly managerLikelyKnows: boolean;
  readonly externalSourceRequired: boolean;
  readonly questionValue: number;
  readonly managerQuestion: string;
};

export type ExecutiveQuestionStrategy = {
  readonly identity: typeof nexoraNca3Identity;
  readonly mode: QuestionStrategyMode;
  readonly shouldAsk: boolean;
  readonly sufficiency: KnowledgeSufficiencyState;
  readonly gap: ExecutiveInformationGap | null;
  readonly gaps: readonly ExecutiveInformationGap[];
  readonly question: string | null;
  readonly purpose: ExecutiveQuestionPurpose | null;
  readonly expectedInformation: string | null;
  readonly reason: string;
  readonly fallbackIfUnknown: string;
  readonly recomputeAfterAnswer: true;
};

export type Nca3KnownFacts = {
  readonly hasCurrentKpi: boolean;
  readonly hasTarget: boolean;
  readonly hasGoal: boolean;
  readonly goalProtectsDelivery: boolean;
  readonly demandPersistence: "unknown" | "continuing" | "temporary" | "unavailable";
  readonly managerDeclined: boolean;
};
