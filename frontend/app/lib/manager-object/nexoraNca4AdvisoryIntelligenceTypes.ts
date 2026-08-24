/**
 * NCA:4 — Executive advisory reasoning and recommendation-dialogue contracts.
 * Conversation architecture over existing Goal / evidence / EI / NEX-EXP / Decision authorities.
 * Not a second recommendation, decision, scenario, or trade-off engine.
 */

export const nexoraNca4Identity =
  "NCA:4/ExecutiveAdvisoryReasoningRecommendationDialogueIntelligence" as const;
export const nexoraNca4Version = "1.0.0" as const;
export const nexoraNca4Namespace =
  "nexora.nca.executive-advisory-reasoning-recommendation-dialogue" as const;

export const NEXORA_NCA4_BOUNDARY = Object.freeze({
  identity: nexoraNca4Identity,
  createsSecondRecommendationEngine: false as const,
  createsSecondScenarioEngine: false as const,
  createsSecondDecisionEngine: false as const,
  createsSecondTradeoffModel: false as const,
  createsSecondRiskEngine: false as const,
  createsParallelAdvisor: false as const,
  usesLiveLlm: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  inventsBusinessTruth: false as const,
  inventsOptions: false as const,
});

export const RECOMMENDATION_STRENGTHS = Object.freeze([
  "NO_RECOMMENDATION",
  "LEAN_TOWARD",
  "RECOMMEND",
  "STRONGLY_RECOMMEND",
] as const);
export type RecommendationStrength = (typeof RECOMMENDATION_STRENGTHS)[number];

export const ADVISORY_CONFIDENCE_LEVELS = Object.freeze(["LOW", "MODERATE", "HIGH"] as const);
export type AdvisoryConfidence = (typeof ADVISORY_CONFIDENCE_LEVELS)[number];

export const ADVISORY_POSITION_STATUSES = Object.freeze([
  "NO_RECOMMENDATION",
  "PROVISIONAL",
  "SUPPORTED",
  "STRONG",
  "REVISED",
  "UNCHANGED",
  "WITHDRAWN",
] as const);
export type AdvisoryPositionStatus = (typeof ADVISORY_POSITION_STATUSES)[number];

export const ADVISORY_REASON_TYPES = Object.freeze([
  "GOAL_FIT",
  "EVIDENCE",
  "CONSTRAINT",
  "RISK",
  "TIME",
  "COST",
  "REVERSIBILITY",
  "OPTIONALITY",
  "UNCERTAINTY",
  "DEPENDENCY",
  "EXECUTION_READINESS",
] as const);
export type AdvisoryReasonType = (typeof ADVISORY_REASON_TYPES)[number];

export const ADVISORY_DIALOGUE_MOVES = Object.freeze([
  "NONE",
  "REQUEST",
  "WHY_THIS",
  "WHY_NOT_OTHER",
  "DOWNSIDE",
  "CONFIDENCE",
  "SENSITIVITY",
  "ASSUMPTION",
  "COUNTERARGUMENT",
  "PRIORITY_SHIFT",
  "NEW_EVIDENCE",
  "CHALLENGE",
  "DISAGREE",
  "OVERRIDE",
  "WALKTHROUGH",
  "SHORT",
  "PERSONAL",
  "DO_NOTHING",
] as const);
export type AdvisoryDialogueMove = (typeof ADVISORY_DIALOGUE_MOVES)[number];

export type AdvisoryReason = {
  readonly type: AdvisoryReasonType;
  readonly statement: string;
};

export type AdvisoryTradeoff = {
  readonly optionId: string;
  readonly gained: string;
  readonly givenUp: string;
};

export type AdvisoryAlternative = {
  readonly id: string;
  readonly label: string;
  readonly role: "recommended" | "alternative" | "fallback" | "do-nothing";
};

export type AdvisorySensitivity = {
  readonly variable: string;
  readonly currentAssumption: string;
  readonly trigger: string;
  readonly effect: string;
};

export type NcaAdvisoryPositionSnapshot = {
  readonly optionId: string;
  readonly optionLabel: string;
  readonly strength: RecommendationStrength;
  readonly confidence: AdvisoryConfidence;
  readonly status: AdvisoryPositionStatus;
  readonly fingerprint: string;
  readonly goal: string | null;
  readonly demandPersistence: string;
  readonly costPriority: boolean;
  readonly threadId: string | null;
};

export type ExecutiveAdvisoryPosition = {
  readonly identity: typeof nexoraNca4Identity;
  readonly subject: string;
  readonly goal: string | null;
  readonly question: string;
  readonly status: AdvisoryPositionStatus;
  readonly recommendation: {
    readonly optionId: string | null;
    readonly optionLabel: string | null;
    readonly strength: RecommendationStrength;
  };
  readonly rationale: readonly AdvisoryReason[];
  readonly evidence: readonly string[];
  readonly assumptions: readonly string[];
  readonly uncertainties: readonly string[];
  readonly constraints: readonly string[];
  readonly tradeoffs: readonly AdvisoryTradeoff[];
  readonly alternatives: readonly AdvisoryAlternative[];
  readonly confidence: {
    readonly level: AdvisoryConfidence;
    readonly reasons: readonly string[];
  };
  readonly sensitivity: readonly AdvisorySensitivity[];
  readonly counterargument: string | null;
  readonly revisionNote: string | null;
  readonly commitsDecision: false;
  readonly startsExecution: false;
};

export type ExecutiveAdvisoryStrategy = {
  readonly identity: typeof nexoraNca4Identity;
  readonly move: AdvisoryDialogueMove;
  readonly shouldAdvise: boolean;
  readonly position: ExecutiveAdvisoryPosition;
  readonly snapshot: NcaAdvisoryPositionSnapshot | null;
  readonly response: string | null;
  readonly reason: string;
};
