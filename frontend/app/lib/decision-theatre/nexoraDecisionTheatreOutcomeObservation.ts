/**
 * DTH:11 — Outcome Observation Theatre presentation contract.
 * Theatre interpretation only. Does not write Outcome or Learning.
 */

export const nexoraDecisionTheatreOutcomeObservationIdentity =
  "DTH:11/OutcomeObservation" as const;
export const nexoraDecisionTheatreOutcomeObservationVersion = "1.0.0" as const;

export const NEXORA_DECISION_THEATRE_OUTCOME_OBSERVATION_STATES = Object.freeze([
  "NO_OUTCOME",
  "OUTCOME_PENDING",
  "OUTCOME_OBSERVED",
  "OUTCOME_PARTIAL",
  "OUTCOME_UNCERTAIN",
  "OUTCOME_CONFIRMED",
] as const);

export type NexoraDecisionTheatreOutcomeObservationState =
  (typeof NEXORA_DECISION_THEATRE_OUTCOME_OBSERVATION_STATES)[number];

export const NEXORA_DECISION_THEATRE_OUTCOME_OBSERVATION_ACTIONS = Object.freeze([
  "VIEW_OUTCOME",
  "VIEW_RELATED_EXECUTION",
  "VIEW_AUTHORIZING_DECISION",
  "SHOW_COMPARISON_HISTORY",
  "INSPECT_RELATED_OBJECT",
] as const);

export type NexoraDecisionTheatreOutcomeObservationAction =
  (typeof NEXORA_DECISION_THEATRE_OUTCOME_OBSERVATION_ACTIONS)[number];

export type NexoraDecisionTheatreOutcomeObservationActionAvailability = Readonly<{
  action: NexoraDecisionTheatreOutcomeObservationAction;
  available: boolean;
  reason: string;
}>;

export type NexoraDecisionTheatreAdvisorOutcomeObservationSummary = Readonly<{
  scene: string;
  result: string;
  goal: string;
  delta: string;
  success: string;
  causality: string;
  evidence: string;
  unknown: string;
  early: string;
  mustNotInfer: readonly string[];
}>;

export type NexoraDecisionTheatreOutcomeObservation = Readonly<{
  identity: typeof nexoraDecisionTheatreOutcomeObservationIdentity;
  version: typeof nexoraDecisionTheatreOutcomeObservationVersion;
  outcomeObservationId: string;
  open: true;
  state: NexoraDecisionTheatreOutcomeObservationState;
  sceneIntentKind: string;
  sceneScriptId: string;
  outcomeId: string | null;
  executionId: string;
  decisionId: string;
  decisionTitle: string;
  goalId: string | null;
  executionStatus: string;
  observedLabel: string | null;
  observedNumeric: number | null;
  baselineLabel: string | null;
  baselineNumeric: number | null;
  targetLabel: string | null;
  targetNumeric: number | null;
  deltaPercentagePoints: number | null;
  deltaLabel: string | null;
  belowTarget: boolean | null;
  comparable: boolean;
  causalSupport: false;
  financialKnown: boolean;
  phase: "early" | "interim" | "final" | "unknown";
  comparisonMemberIds: readonly string[];
  unknowns: readonly string[];
  suggestedQuestions: readonly string[];
  actions: readonly NexoraDecisionTheatreOutcomeObservationActionAvailability[];
  advisorReadable: NexoraDecisionTheatreAdvisorOutcomeObservationSummary;
  limitations: readonly string[];
  derivationMetadata: Readonly<{
    composer: "DTH:11/OutcomeObservationComposer";
    inventedOutcome: false;
    completionMeansSuccess: false;
    inventedCausality: false;
    inventedFinancials: false;
    inventedLearning: false;
    inventedDecision: false;
    clickMutatedOutcome: false;
    mutatedStage: false;
    timestampUsed: false;
    randomUsed: false;
  }>;
}>;
