/**
 * NEX-EXP:10 — Learning, Reassessment & Next Executive Cycle contracts.
 * Experience over EI:6, CORE-OUT:2, APP-4. Does not commit a new Decision.
 */

export const nexoraLearningReassessmentIdentity =
  "NEX-EXP:10/LearningReassessmentNextExecutiveCycle" as const;
export const nexoraLearningReassessmentVersion = "1.0.0" as const;
export const nexoraLearningReassessmentNamespace =
  "nexora.experience.learning.reassessment-next-cycle" as const;

export const NEXORA_LEARNING_REASSESSMENT_BOUNDARY = Object.freeze({
  identity: nexoraLearningReassessmentIdentity,
  createsMo7: false as const,
  parallelLearningEngine: false as const,
  parallelMemoryPlatform: false as const,
  parallelCausalEngine: false as const,
  parallelAdvisor: false as const,
  newStageRuntime: false as const,
  usesLlm: false as const,
  writesStageCoordinates: false as const,
  stealsCenter: false as const,
  commitsDecision: false as const,
  mutatesExecution: false as const,
  mutatesGoal: false as const,
  infersCausality: false as const,
  confirmsCauseWithoutAuthority: false as const,
  generalizesOneCase: false as const,
  ei6Authority: "EI:6/ExecutionOutcomeLearningLoop" as const,
  coreOut2Authority: "CORE-OUT:2/GroundedLearningIntelligence" as const,
  app4Authority: "APP-4/ExecutiveMemoryStorageEngine" as const,
});

export const LEARNING_REASSESSMENT_STATES = Object.freeze([
  "NOT_STARTED",
  "LEARNING_CONTEXT_READY",
  "ASSESSING_OUTCOME",
  "ASSUMPTIONS_REVIEWED",
  "LEARNING_PARTIAL",
  "LEARNING_AVAILABLE",
  "REASSESSMENT_REQUIRED",
  "REASSESSMENT_OPTIONAL",
  "CYCLE_COMPLETE",
  "READY_FOR_NEXT_EXECUTIVE_CYCLE",
] as const);

export type LearningReassessmentState =
  (typeof LEARNING_REASSESSMENT_STATES)[number];

export type AssumptionReviewStatus =
  | "SUPPORTED"
  | "NOT_SUPPORTED"
  | "PARTIAL"
  | "UNKNOWN"
  | "NOT_TESTED";

export type CausalLearningStatus =
  | "NONE"
  | "HYPOTHESIZED"
  | "SUPPORTED"
  | "CONFIRMED"
  | "UNKNOWN";

export type Generalizability =
  | "THIS_CASE_ONLY"
  | "SIMILAR_CONTEXTS"
  | "BROADER_CONTEXT_UNKNOWN"
  | "GENERALIZED"
  | "UNKNOWN";

export type DecisionOutcomeSupport =
  | "SUPPORTED_BY_OUTCOME"
  | "PARTIALLY_SUPPORTED"
  | "NOT_SUPPORTED"
  | "INCONCLUSIVE"
  | "UNKNOWN";

export type GoalReassessment =
  | "CONTINUE_GOAL"
  | "REFINE_GOAL"
  | "CHANGE_GOAL"
  | "GOAL_ACHIEVED"
  | "GOAL_NO_LONGER_RELEVANT"
  | "UNKNOWN";

export type DecisionReassessment =
  | "CONTINUE_CURRENT_DECISION"
  | "ADJUST_EXECUTION"
  | "REVISIT_DECISION"
  | "NEW_DECISION_REQUIRED"
  | "NO_DECISION_REQUIRED"
  | "UNKNOWN";

export type NextCycleRoute =
  | "GOAL"
  | "REALITY"
  | "ISSUE"
  | "SCENARIO"
  | "DECISION"
  | "EXECUTION"
  | "MONITOR"
  | "CLOSE";

export type CycleStatus =
  | "COMPLETE"
  | "COMPLETE_WITH_OPEN_QUESTIONS"
  | "REASSESSMENT_REQUIRED"
  | "ONGOING"
  | "UNKNOWN";

export type ExecutiveAssumptionReview = {
  readonly statement: string;
  readonly status: AssumptionReviewStatus;
  readonly tested: boolean;
  readonly evidence: readonly string[];
};

export type ExecutiveLearningStatement = {
  readonly statement: string;
  readonly source: "EI:6" | "CORE-OUT:2" | "NEX-EXP:10";
  readonly evidence: readonly string[];
  readonly scope: Generalizability;
  readonly epistemicStatus: "KNOWN" | "INFERRED" | "UNKNOWN";
  readonly causalStatus: CausalLearningStatus;
  readonly appliesToContext: string;
  readonly generalizationAllowed: false;
  readonly managerConfirmed: boolean;
};

export type ExecutiveLearningContext = {
  readonly learningId: string;
  readonly goalId: string | null;
  readonly decisionId: string | null;
  readonly executionId: string | null;
  readonly observations: readonly string[];
  readonly supportedLearnings: readonly ExecutiveLearningStatement[];
  readonly rejectedHypotheses: readonly string[];
  readonly assumptionReviews: readonly ExecutiveAssumptionReview[];
  readonly causalStatus: CausalLearningStatus;
  readonly generalizability: Generalizability;
  readonly confidence: "LOW" | "MEDIUM" | "UNKNOWN";
  readonly unknowns: readonly string[];
  readonly evidence: readonly string[];
  readonly provenance: readonly string[];
  readonly memoryStatus: "NOT_WRITTEN" | "WRITTEN" | "SUPERSEDED" | "INELIGIBLE";
};

export type ExecutiveCycleCompletion = {
  readonly cycleId: string;
  readonly goalId: string | null;
  readonly decisionId: string | null;
  readonly executionId: string | null;
  readonly outcomeSummary: string;
  readonly learningSummary: string;
  readonly resolvedItems: readonly string[];
  readonly unresolvedItems: readonly string[];
  readonly reassessmentRoute: NextCycleRoute;
  readonly nextExecutiveQuestion: string;
  readonly memoryWriteStatus: ExecutiveLearningContext["memoryStatus"];
  readonly cycleStatus: CycleStatus;
  readonly goalReassessment: GoalReassessment;
  readonly decisionReassessment: DecisionReassessment;
  readonly decisionOutcomeSupport: DecisionOutcomeSupport;
  readonly lastCommittedDecision: null;
  readonly lastMutatedExecution: null;
};

export type NexoraLearningReassessmentSession = {
  readonly state: LearningReassessmentState;
  readonly context: ExecutiveLearningContext | null;
  readonly cycle: ExecutiveCycleCompletion | null;
  readonly askedQuestionKeys: readonly string[];
  readonly introduced: boolean;
  readonly memoryId: string | null;
  readonly lastCommittedDecision: null;
  readonly lastMutatedExecution: null;
  readonly lastMutatedGoal: null;
};

export function getNexoraLearningReassessmentIdentity() {
  return Object.freeze({
    id: nexoraLearningReassessmentIdentity,
    version: nexoraLearningReassessmentVersion,
    namespace: nexoraLearningReassessmentNamespace,
  });
}

export function verifyNexoraLearningReassessment(): { readonly ok: true } {
  if (
    getNexoraLearningReassessmentIdentity().id !==
    "NEX-EXP:10/LearningReassessmentNextExecutiveCycle"
  ) {
    throw new Error("NEX-EXP:10 identity mismatch");
  }
  if (NEXORA_LEARNING_REASSESSMENT_BOUNDARY.commitsDecision) {
    throw new Error("NEX-EXP:10 must not commit a Decision");
  }
  if (NEXORA_LEARNING_REASSESSMENT_BOUNDARY.confirmsCauseWithoutAuthority) {
    throw new Error("NEX-EXP:10 must not confirm cause without authority");
  }
  if (NEXORA_LEARNING_REASSESSMENT_BOUNDARY.generalizesOneCase) {
    throw new Error("NEX-EXP:10 must not generalize one case");
  }
  return Object.freeze({ ok: true as const });
}
