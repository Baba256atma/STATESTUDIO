/**
 * NEX-EXP:6 — Scenario Comparison, Trade-off & Recommendation contracts.
 * Experience projection over EI:4 / CC:8 / CC:9. Does not commit decisions.
 */

export const nexoraScenarioComparisonExperienceIdentity =
  "NEX-EXP:6/ScenarioComparisonTradeoffRecommendation" as const;
export const nexoraScenarioComparisonExperienceVersion = "1.0.0" as const;
export const nexoraScenarioComparisonExperienceNamespace =
  "nexora.experience.scenario.comparison-tradeoff-recommendation" as const;

export const NEXORA_SCENARIO_COMPARISON_BOUNDARY = Object.freeze({
  identity: nexoraScenarioComparisonExperienceIdentity,
  startsNexExp7: false as const,
  createsMo7: false as const,
  parallelComparisonEngine: false as const,
  parallelTradeoffEngine: false as const,
  parallelRecommendationEngine: false as const,
  parallelScenarioEngine: false as const,
  parallelDecisionRuntime: false as const,
  parallelExecutionRuntime: false as const,
  parallelGoalRanking: false as const,
  parallelAdvisor: false as const,
  newStageRuntime: false as const,
  usesLlm: false as const,
  writesStageCoordinates: false as const,
  stealsCenter: false as const,
  writesDataReality: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  changesExecution: false as const,
  inventsScores: false as const,
  inventsNumericEstimates: false as const,
  ei4Authority: "EI:4/ScenarioPriorityTradeoffIntelligence" as const,
  cc8Authority: "CC:8/ReasoningAndRecommendation" as const,
  cc9Authority: "CC:9/ScenarioConversation" as const,
  cc10rAuthority: "CC:10R/CanonicalDecisionRuntime" as const,
});

export const SCENARIO_COMPARISON_STATES = Object.freeze([
  "NOT_STARTED",
  "ASSESSING_COMPARABILITY",
  "COMPARISON_PARTIAL",
  "COMPARISON_READY",
  "TRADEOFFS_RESOLVED",
  "RECOMMENDATION_AVAILABLE",
  "RECOMMENDATION_WITHHELD",
  "READY_FOR_DECISION",
] as const);

export type ScenarioComparisonExperienceState =
  (typeof SCENARIO_COMPARISON_STATES)[number];

export type QualitativeLevel = "HIGH" | "MEDIUM" | "LOW" | "FAST" | "UNKNOWN";

export type RecommendationStatus =
  | "AVAILABLE"
  | "WITHHELD"
  | "TIED"
  | "INSUFFICIENT_EVIDENCE"
  | "CONFLICTING_GOALS"
  | "NO_VALID_SCENARIO"
  | "UNKNOWN";

export type ExecutiveComparisonDimension = {
  readonly id: string;
  readonly label: string;
  readonly source: string;
};

export type ExecutiveScenarioResult = {
  readonly scenarioId: string;
  readonly title: string;
  readonly letter: string;
  readonly ranked: boolean;
  readonly constrained: boolean;
  readonly dominated: boolean;
  readonly baseline: boolean;
  readonly levels: Readonly<Record<string, QualitativeLevel>>;
  readonly numericValues: Readonly<Record<string, string>>;
};

export type ExecutiveScenarioTradeoffView = {
  readonly scenarioId: string;
  readonly gains: readonly string[];
  readonly sacrifices: readonly string[];
  readonly affectedGoals: readonly string[];
  readonly affectedRisks: readonly string[];
  readonly affectedConstraints: readonly string[];
  readonly reversibility: string | null;
  readonly timeToValue: string | null;
  readonly uncertainty: QualitativeLevel;
  readonly evidence: readonly string[];
  readonly epistemicStatus: "INFERRED" | "UNKNOWN" | "PREDICTED";
};

export type ExecutiveScenarioComparisonView = {
  readonly comparisonId: string;
  readonly goalId: string | null;
  readonly scenarioIds: readonly string[];
  readonly dimensions: readonly ExecutiveComparisonDimension[];
  readonly scenarioResults: readonly ExecutiveScenarioResult[];
  readonly tradeoffs: readonly ExecutiveScenarioTradeoffView[];
  readonly dominance: readonly string[];
  readonly ties: readonly string[];
  readonly unknowns: readonly string[];
  readonly evidence: readonly string[];
  readonly provenance: readonly string[];
  readonly epistemicStatus: "INFERRED" | "UNKNOWN";
  readonly comparisonStatus: "READY" | "PARTIAL" | "NOT_COMPARABLE" | "STALE";
  readonly numericalScore: null;
};

export type ExecutiveScenarioRecommendationView = {
  readonly recommendationId: string;
  readonly recommendedScenarioId: string | null;
  readonly alternativeScenarioIds: readonly string[];
  readonly reasoningSummary: string;
  readonly goalFit: string;
  readonly tradeoffs: readonly string[];
  readonly risks: readonly string[];
  readonly constraints: readonly string[];
  readonly assumptions: readonly string[];
  readonly unknowns: readonly string[];
  readonly confidence: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  readonly epistemicStatus: "INFERRED" | "UNKNOWN";
  readonly recommendationStatus: RecommendationStatus;
  readonly requiresManagerDecision: true;
  readonly commitsDecision: false;
  readonly startsExecution: false;
  readonly sourceAuthorities: readonly string[];
};

export type NexoraDecisionExperienceHandoff = {
  readonly activeGoal: unknown;
  readonly realityContext: unknown;
  readonly issueContext: unknown;
  readonly scenarioComparison: ExecutiveScenarioComparisonView | null;
  readonly tradeoffs: readonly ExecutiveScenarioTradeoffView[];
  readonly recommendation: ExecutiveScenarioRecommendationView | null;
  readonly recommendedScenario: string | null;
  readonly alternatives: readonly string[];
  readonly decisionQuestion: string;
  readonly decisionEvidence: readonly string[];
  readonly unknowns: readonly string[];
  readonly conversationContext: string;
  readonly commitsDecision: false;
};

export type NexoraScenarioComparisonSession = {
  readonly state: ScenarioComparisonExperienceState;
  readonly comparison: ExecutiveScenarioComparisonView | null;
  readonly recommendation: ExecutiveScenarioRecommendationView | null;
  readonly managerPriority: "SPEED" | "COST" | "UNKNOWN";
  readonly fingerprint: string;
  readonly askedQuestionKeys: readonly string[];
  readonly introduced: boolean;
  readonly handoff: NexoraDecisionExperienceHandoff | null;
  readonly lastMutatedReality: null;
  readonly lastCommittedDecision: null;
};

export function getNexoraScenarioComparisonExperienceIdentity() {
  return Object.freeze({
    id: nexoraScenarioComparisonExperienceIdentity,
    version: nexoraScenarioComparisonExperienceVersion,
    namespace: nexoraScenarioComparisonExperienceNamespace,
  });
}

export function verifyNexoraScenarioComparisonExperience(): { readonly ok: true } {
  if (
    getNexoraScenarioComparisonExperienceIdentity().id !==
    "NEX-EXP:6/ScenarioComparisonTradeoffRecommendation"
  ) {
    throw new Error("NEX-EXP:6 identity mismatch");
  }
  if (NEXORA_SCENARIO_COMPARISON_BOUNDARY.startsNexExp7) {
    throw new Error("NEX-EXP:6 must not start NEX-EXP:7");
  }
  if (NEXORA_SCENARIO_COMPARISON_BOUNDARY.commitsDecision) {
    throw new Error("NEX-EXP:6 must not commit decisions");
  }
  return Object.freeze({ ok: true as const });
}
