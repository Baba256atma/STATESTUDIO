/**
 * NEX-EXP:9 — Outcome Monitoring & Goal Impact contracts.
 * Experience over CORE-OUT:1, CC:12, EI:6. Does not start NEX-EXP:10.
 */

export const nexoraOutcomeMonitoringIdentity =
  "NEX-EXP:9/OutcomeMonitoringGoalImpactExperience" as const;
export const nexoraOutcomeMonitoringVersion = "1.0.0" as const;
export const nexoraOutcomeMonitoringNamespace =
  "nexora.experience.outcome.monitoring-goal-impact" as const;

export const NEXORA_OUTCOME_MONITORING_BOUNDARY = Object.freeze({
  identity: nexoraOutcomeMonitoringIdentity,
  startsNexExp10: false as const,
  createsMo7: false as const,
  parallelOutcomeRuntime: false as const,
  parallelDataReality: false as const,
  parallelFollowUpMemory: false as const,
  parallelLearningEngine: false as const,
  parallelCausalEngine: false as const,
  parallelAdvisor: false as const,
  newStageRuntime: false as const,
  usesLlm: false as const,
  writesStageCoordinates: false as const,
  stealsCenter: false as const,
  writesDataReality: false as const,
  infersCausality: false as const,
  executionCompleteMeansGoalAchieved: false as const,
  progressMeansOutcome: false as const,
  coreOut1Authority: "CORE-OUT:1/LiveOutcomeIntelligence" as const,
  cc12Authority: "CC:12/ExecutionFollowUp" as const,
  ei6Authority: "EI:6/ExecutionOutcomeLearningLoop" as const,
  prod5Authority: "STAGE-PROD:5/ExecutiveStageDecisionMemory" as const,
});

export const OUTCOME_MONITORING_STATES = Object.freeze([
  "NOT_STARTED",
  "MONITORING_ACTIVE",
  "AWAITING_OBSERVATION",
  "OUTCOME_PARTIAL",
  "OUTCOME_OBSERVED",
  "OUTCOME_COMPARED",
  "GOAL_IMPACT_RESOLVED",
  "GOAL_IMPACT_UNKNOWN",
  "READY_FOR_LEARNING_REASSESSMENT",
] as const);

export type OutcomeMonitoringState =
  (typeof OUTCOME_MONITORING_STATES)[number];

export type OutcomeComparisonStatus =
  | "MATCHED"
  | "BETTER_THAN_EXPECTED"
  | "WORSE_THAN_EXPECTED"
  | "DIFFERENT"
  | "PARTIAL"
  | "UNKNOWN"
  | "NOT_COMPARABLE";

export type GoalImpactState =
  | "UNKNOWN"
  | "IMPROVING"
  | "UNCHANGED"
  | "WORSENING"
  | "ACHIEVED"
  | "MIXED";

export type ObservationPhase = "EARLY_SIGNAL" | "INTERIM" | "FINAL" | "UNKNOWN";

export type ExecutiveOutcomeObservationView = {
  readonly observationId: string;
  readonly executionId: string | null;
  readonly subjectId: string | null;
  readonly measure: string | null;
  readonly observedValue: string | null;
  readonly numericValue: number | null;
  readonly unit: string | null;
  readonly state: string | null;
  readonly timestamp: string | null;
  readonly source:
    | "data-reality"
    | "execution-runtime"
    | "cc12"
    | "manager-reported"
    | "unknown";
  readonly sourceAuthority: string;
  readonly provenance: string | null;
  readonly freshness: "current" | "stale" | "unknown";
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
  readonly goalRelevance: "relevant" | "unrelated" | "unknown";
  readonly phase: ObservationPhase;
};

export type ExecutiveOutcomeComparisonView = {
  readonly subject: string;
  readonly expected: string | null;
  readonly observed: string | null;
  readonly unit: string | null;
  readonly direction: string | null;
  readonly variance: number | null;
  readonly comparisonStatus: OutcomeComparisonStatus;
  readonly evidence: readonly string[];
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
};

export type ExecutiveGoalImpactView = {
  readonly goalId: string | null;
  readonly executionId: string | null;
  readonly state: GoalImpactState;
  readonly supportingObservations: readonly string[];
  readonly contradictingObservations: readonly string[];
  readonly currentValue: string | null;
  readonly targetValue: string | null;
  readonly gapBefore: number | null;
  readonly gapNow: number | null;
  readonly direction: string | null;
  readonly confidence: "LOW" | "MEDIUM" | "UNKNOWN";
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
  readonly attribution: "UNKNOWN" | "NOT_CONFIRMED";
};

export type ExecutiveOutcomeContextView = {
  readonly executionId: string | null;
  readonly decisionId: string | null;
  readonly goalId: string | null;
  readonly expectedOutcomes: readonly string[];
  readonly observedOutcomes: readonly ExecutiveOutcomeObservationView[];
  readonly comparisons: readonly ExecutiveOutcomeComparisonView[];
  readonly goalImpact: ExecutiveGoalImpactView;
  readonly evidence: readonly string[];
  readonly provenance: readonly string[];
  readonly unknowns: readonly string[];
  readonly freshness: "current" | "stale" | "unknown";
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
  readonly status: OutcomeMonitoringState;
};

export type NexoraLearningReassessmentHandoff = {
  readonly activeGoal: unknown;
  readonly committedDecision: unknown;
  readonly executionPlan: unknown;
  readonly executionRuntimeState: string | null;
  readonly expectedOutcomes: readonly string[];
  readonly observedOutcomes: readonly ExecutiveOutcomeObservationView[];
  readonly outcomeComparisons: readonly ExecutiveOutcomeComparisonView[];
  readonly goalImpact: ExecutiveGoalImpactView | null;
  readonly reassessmentSignals: readonly string[];
  readonly evidence: readonly string[];
  readonly provenance: readonly string[];
  readonly unknowns: readonly string[];
  readonly conversationContext: string;
  readonly startsLearning: false;
};

export type NexoraOutcomeMonitoringSession = {
  readonly state: OutcomeMonitoringState;
  readonly context: ExecutiveOutcomeContextView | null;
  readonly observations: readonly ExecutiveOutcomeObservationView[];
  readonly askedQuestionKeys: readonly string[];
  readonly introduced: boolean;
  readonly handoff: NexoraLearningReassessmentHandoff | null;
  readonly lastMutatedReality: null;
  readonly lastCreatedLearning: null;
};

export function getNexoraOutcomeMonitoringIdentity() {
  return Object.freeze({
    id: nexoraOutcomeMonitoringIdentity,
    version: nexoraOutcomeMonitoringVersion,
    namespace: nexoraOutcomeMonitoringNamespace,
  });
}

export function verifyNexoraOutcomeMonitoring(): { readonly ok: true } {
  if (
    getNexoraOutcomeMonitoringIdentity().id !==
    "NEX-EXP:9/OutcomeMonitoringGoalImpactExperience"
  ) {
    throw new Error("NEX-EXP:9 identity mismatch");
  }
  if (NEXORA_OUTCOME_MONITORING_BOUNDARY.startsNexExp10) {
    throw new Error("NEX-EXP:9 must not start NEX-EXP:10");
  }
  if (NEXORA_OUTCOME_MONITORING_BOUNDARY.infersCausality) {
    throw new Error("NEX-EXP:9 must not infer causality");
  }
  if (NEXORA_OUTCOME_MONITORING_BOUNDARY.executionCompleteMeansGoalAchieved) {
    throw new Error("NEX-EXP:9 must not equate completion with Goal success");
  }
  return Object.freeze({ ok: true as const });
}
