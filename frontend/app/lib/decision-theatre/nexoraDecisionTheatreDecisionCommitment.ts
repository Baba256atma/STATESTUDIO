/**
 * DTH:8 — Decision Commitment presentation contract.
 * Read-oriented Theatre presentation. Canonical commitment remains CC:10 / CC:10R.
 */

export const nexoraDecisionTheatreDecisionCommitmentIdentity =
  "DTH:8/DecisionCommitment" as const;
export const nexoraDecisionTheatreDecisionCommitmentVersion = "1.0.0" as const;

export const NEXORA_DECISION_THEATRE_COMMITMENT_STATES = Object.freeze([
  "REVIEWING",
  "READY_TO_COMMIT",
  "COMMITTED",
  "BLOCKED",
] as const);

export type NexoraDecisionTheatreCommitmentState =
  (typeof NEXORA_DECISION_THEATRE_COMMITMENT_STATES)[number];

export const NEXORA_DECISION_THEATRE_COMMITMENT_ACTIONS = Object.freeze([
  "REVIEW_CANDIDATE",
  "CHANGE_CANDIDATE",
  "SHOW_DECISION_EVIDENCE",
  "SHOW_DECISION_TRADE_OFFS",
  "SHOW_DECISION_UNCERTAINTY",
  "RETURN_TO_COMPARISON",
  "COMMIT_DECISION",
  "CANCEL_DECISION_REVIEW",
  "VIEW_COMMITTED_DECISION",
  "PROCEED_TO_EXECUTION",
] as const);

export type NexoraDecisionTheatreCommitmentAction =
  (typeof NEXORA_DECISION_THEATRE_COMMITMENT_ACTIONS)[number];

export type NexoraDecisionTheatreCommitmentActionAvailability = Readonly<{
  action: NexoraDecisionTheatreCommitmentAction;
  available: boolean;
  reason: string;
}>;

export type NexoraDecisionTheatreAdvisorCommitmentSummary = Readonly<{
  reviewing: string;
  why: string;
  evidence: string;
  tradeOffs: string;
  uncertainty: string;
  consequence: string;
  next: string;
  haveIDecided: string;
  recommendationDistinct: string;
  mustNotInfer: readonly string[];
}>;

export type NexoraDecisionTheatreDecisionCommitment = Readonly<{
  identity: typeof nexoraDecisionTheatreDecisionCommitmentIdentity;
  version: typeof nexoraDecisionTheatreDecisionCommitmentVersion;
  commitmentId: string;
  open: boolean;
  state: NexoraDecisionTheatreCommitmentState;
  sceneIntentKind: string;
  sceneScriptId: string;
  comparisonId: string | null;
  candidateId: string | null;
  candidateType: string | null;
  candidateLabel: string | null;
  candidateSource: "comparison-member" | "authoritative-decision" | "none";
  focalGoal: Readonly<{ id: string; label: string }> | null;
  focalProblem: Readonly<{ id: string; label: string }> | null;
  recommendationLabel: string | null;
  evidence: string;
  assumptions: string | null;
  uncertainty: string;
  risks: string | null;
  tradeOffs: string;
  expectedConsequence: string | null;
  readiness: string | null;
  authoritativeDecisionId: string | null;
  executionStarted: false | true;
  comparisonMemberIds: readonly string[];
  candidateChoices: readonly Readonly<{ id: string; label: string }>[];
  suggestedQuestions: readonly string[];
  actions: readonly NexoraDecisionTheatreCommitmentActionAvailability[];
  advisorReadable: NexoraDecisionTheatreAdvisorCommitmentSummary;
  limitations: readonly string[];
  derivationMetadata: Readonly<{
    composer: "DTH:8/DecisionCommitmentComposer";
    inventedDecision: false;
    clickCommitted: false;
    recommendationBecameDecision: false;
    startedExecution: false;
    unknownFlattenedToZero: false;
    assumptionPromoted: false;
    silentOverwrite: false;
    mutatedStage: false;
    timestampUsed: false;
    randomUsed: false;
  }>;
}>;
