/**
 * DTH:7 — Decision Comparison presentation contract.
 * Read-oriented Theatre presentation. Not a source of business truth.
 */

export const nexoraDecisionTheatreDecisionComparisonIdentity =
  "DTH:7/DecisionComparison" as const;
export const nexoraDecisionTheatreDecisionComparisonVersion = "1.0.0" as const;

export const NEXORA_DECISION_THEATRE_COMPARISON_LEVELS = Object.freeze([
  "choice",
  "compare",
  "decide",
] as const);

export type NexoraDecisionTheatreComparisonLevel =
  (typeof NEXORA_DECISION_THEATRE_COMPARISON_LEVELS)[number];

export const NEXORA_DECISION_THEATRE_COMPARISON_ACTIONS = Object.freeze([
  "INVESTIGATE_CANDIDATE",
  "COMPARE_EVIDENCE",
  "COMPARE_RISK",
  "COMPARE_COST",
  "COMPARE_TIME",
  "COMPARE_GOAL_IMPACT",
  "SHOW_TRADE_OFFS",
  "SHOW_UNCERTAINTY",
  "EXPLAIN_RECOMMENDATION",
  "RETURN_TO_COMPARISON",
  "PROCEED_TO_DECISION",
] as const);

export type NexoraDecisionTheatreComparisonAction =
  (typeof NEXORA_DECISION_THEATRE_COMPARISON_ACTIONS)[number];

export type NexoraDecisionTheatreComparisonCriterionKey =
  | "goal-impact"
  | "evidence"
  | "risk"
  | "cost"
  | "time"
  | "reversibility"
  | "uncertainty"
  | "trade-off";

export type NexoraDecisionTheatreComparisonCandidate = Readonly<{
  id: string;
  label: string;
  kind: string;
  state: string;
  isDoNothing: boolean;
  evidence: string | null;
  cost: string | null;
  time: string | null;
  risk: string | null;
  reversibility: string | null;
  assumption: string | null;
  epistemicStatus: "known" | "inferred" | "unknown" | "predicted" | "unavailable" | "assumption";
}>;

export type NexoraDecisionTheatreComparisonCriterion = Readonly<{
  key: NexoraDecisionTheatreComparisonCriterionKey;
  label: string;
  available: boolean;
  reason: string;
}>;

export type NexoraDecisionTheatreComparisonActionAvailability = Readonly<{
  action: NexoraDecisionTheatreComparisonAction;
  available: boolean;
  reason: string;
}>;

export type NexoraDecisionTheatreAdvisorComparisonSummary = Readonly<{
  choice: string;
  candidates: string;
  differences: string;
  evidence: string;
  uncertainty: string;
  tradeOffs: string;
  recommendation: string | null;
  readiness: string | null;
  ambiguousBetter: string;
  mustNotInfer: readonly string[];
}>;

export type NexoraDecisionTheatreDecisionComparison = Readonly<{
  identity: typeof nexoraDecisionTheatreDecisionComparisonIdentity;
  version: typeof nexoraDecisionTheatreDecisionComparisonVersion;
  comparisonId: string;
  open: boolean;
  level: NexoraDecisionTheatreComparisonLevel;
  sceneIntentKind: string;
  sceneScriptId: string;
  membershipSource: "scene-intent" | "nca-active-comparison";
  focalGoal: Readonly<{ id: string; label: string }> | null;
  focalProblem: Readonly<{ id: string; label: string }> | null;
  candidates: readonly NexoraDecisionTheatreComparisonCandidate[];
  candidateIds: readonly string[];
  activeCandidateId: string | null;
  criterion: string | null;
  unresolvedCriteria: readonly string[];
  criteria: readonly NexoraDecisionTheatreComparisonCriterion[];
  tradeOffs: readonly string[];
  uncertainty: string;
  recommendation: Readonly<{
    candidateId: string;
    statement: string;
    source: string;
    isDecision: false;
  }> | null;
  readiness: string | null;
  suggestedQuestions: readonly string[];
  actions: readonly NexoraDecisionTheatreComparisonActionAvailability[];
  advisorReadable: NexoraDecisionTheatreAdvisorComparisonSummary;
  limitations: readonly string[];
  derivationMetadata: Readonly<{
    composer: "DTH:7/DecisionComparisonComposer";
    inventedCandidates: false;
    inventedScores: false;
    inventedRecommendation: false;
    approvedDecision: false;
    startedExecution: false;
    proximityInferred: false;
    unknownFlattenedToZero: false;
    mutatedStage: false;
    timestampUsed: false;
    randomUsed: false;
  }>;
}>;
