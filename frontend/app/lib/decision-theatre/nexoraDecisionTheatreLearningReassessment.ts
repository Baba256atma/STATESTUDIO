/**
 * DTH:12 — Learning & Reassessment Theatre presentation contract.
 * Theatre interpretation only. Does not write Learning, Decisions, or Goals.
 */

export const nexoraDecisionTheatreLearningReassessmentIdentity =
  "DTH:12/LearningReassessment" as const;
export const nexoraDecisionTheatreLearningReassessmentVersion = "1.0.0" as const;

export const NEXORA_DECISION_THEATRE_LEARNING_STATES = Object.freeze([
  "NO_LEARNING",
  "LEARNING_CANDIDATE",
  "LEARNING_SUPPORTED",
  "LEARNING_UNCERTAIN",
  "LEARNING_CONFIRMED",
] as const);

export type NexoraDecisionTheatreLearningObservationState =
  (typeof NEXORA_DECISION_THEATRE_LEARNING_STATES)[number];

export const NEXORA_DECISION_THEATRE_REASSESSMENT_STATES = Object.freeze([
  "NO_REASSESSMENT",
  "REASSESSMENT_AVAILABLE",
  "REASSESSMENT_RECOMMENDED",
  "REASSESSMENT_REQUIRED",
] as const);

export type NexoraDecisionTheatreReassessmentState =
  (typeof NEXORA_DECISION_THEATRE_REASSESSMENT_STATES)[number];

export const NEXORA_DECISION_THEATRE_LEARNING_EFFECTS = Object.freeze([
  "strengthened",
  "weakened",
  "unchanged",
  "unresolved",
] as const);

export type NexoraDecisionTheatreLearningEffect =
  (typeof NEXORA_DECISION_THEATRE_LEARNING_EFFECTS)[number];

export const NEXORA_DECISION_THEATRE_LEARNING_ACTIONS = Object.freeze([
  "VIEW_LEARNING",
  "VIEW_RELATED_OUTCOME",
  "VIEW_AUTHORIZING_DECISION",
  "SHOW_COMPARISON_HISTORY",
  "INSPECT_RELATED_OBJECT",
] as const);

export type NexoraDecisionTheatreLearningReassessmentAction =
  (typeof NEXORA_DECISION_THEATRE_LEARNING_ACTIONS)[number];

export type NexoraDecisionTheatreLearningActionAvailability = Readonly<{
  action: NexoraDecisionTheatreLearningReassessmentAction;
  available: boolean;
  reason: string;
}>;

export type NexoraDecisionTheatreLearningReference = Readonly<{
  kind: "target-expectation" | "assumption" | "hypothesis";
  id: string | null;
  statement: string;
  effect: NexoraDecisionTheatreLearningEffect;
  rewritten: false;
  judgedTrueFalse: false;
}>;

export type NexoraDecisionTheatreAdvisorLearningSummary = Readonly<{
  scene: string;
  learned: string;
  changed: string;
  reconsider: string;
  decisionJudgment: string;
  hindsight: string;
  evidence: string;
  assumption: string;
  uncertain: string;
  recommend: string;
  mustNotInfer: readonly string[];
}>;

export type NexoraDecisionTheatreLearningReassessment = Readonly<{
  identity: typeof nexoraDecisionTheatreLearningReassessmentIdentity;
  version: typeof nexoraDecisionTheatreLearningReassessmentVersion;
  learningReassessmentId: string;
  open: true;
  state: NexoraDecisionTheatreLearningObservationState;
  reassessmentState: NexoraDecisionTheatreReassessmentState;
  sceneIntentKind: string;
  sceneScriptId: string;
  outcomeId: string | null;
  executionId: string;
  decisionId: string;
  decisionTitle: string;
  outcomeState: string;
  outcomeDurability: "session";
  outcomeAuthority: string;
  learningAuthority: "CORE-OUT:2 interpretation rules (presentation only)";
  durable: false;
  evidenceQuality: "supported" | "uncertain" | "insufficient";
  causalSupport: false;
  belowTarget: boolean | null;
  targetLabel: string | null;
  observedLabel: string | null;
  baselineLabel: string | null;
  deltaLabel: string | null;
  affectedAssumptions: readonly NexoraDecisionTheatreLearningReference[];
  weakenedHypotheses: readonly NexoraDecisionTheatreLearningReference[];
  strengthenedHypotheses: readonly NexoraDecisionTheatreLearningReference[];
  unresolvedQuestions: readonly string[];
  contradictory: boolean;
  managerConsent: boolean;
  decisionJourneyReentered: false;
  comparisonMemberIds: readonly string[];
  unknowns: readonly string[];
  suggestedQuestions: readonly string[];
  actions: readonly NexoraDecisionTheatreLearningActionAvailability[];
  advisorReadable: NexoraDecisionTheatreAdvisorLearningSummary;
  limitations: readonly string[];
  derivationMetadata: Readonly<{
    composer: "DTH:12/LearningReassessmentComposer";
    inventedLearning: false;
    inventedAssumption: false;
    inventedCausality: false;
    outcomeBecameLearning: false;
    learningBecameDurable: false;
    learningBecameConfirmed: false;
    weakenedBecameFalse: false;
    strengthenedBecameTrue: false;
    mutatedGoal: false;
    mutatedDecision: false;
    mutatedScenario: false;
    mutatedExecution: false;
    mutatedOutcome: false;
    persistedApp4: false;
    clickMutatedLearning: false;
    automaticComparisonReopened: false;
    timestampUsed: false;
    randomUsed: false;
  }>;
}>;
