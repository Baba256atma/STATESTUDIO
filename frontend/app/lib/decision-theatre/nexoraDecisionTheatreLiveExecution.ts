/**
 * DTH:10 — Live Execution Theatre presentation contract.
 * Theatre interpretation only. Canonical Execution remains CC:11.
 */

export const nexoraDecisionTheatreLiveExecutionIdentity =
  "DTH:10/LiveExecution" as const;
export const nexoraDecisionTheatreLiveExecutionVersion = "1.0.0" as const;

export const NEXORA_DECISION_THEATRE_LIVE_EXECUTION_STATES = Object.freeze([
  "NO_EXECUTION",
  "EXECUTION_CREATED",
  "EXECUTION_ACTIVE",
  "EXECUTION_ATTENTION",
  "EXECUTION_BLOCKED",
  "EXECUTION_COMPLETED",
] as const);

export type NexoraDecisionTheatreLiveExecutionState =
  (typeof NEXORA_DECISION_THEATRE_LIVE_EXECUTION_STATES)[number];

export const NEXORA_DECISION_THEATRE_LIVE_EXECUTION_ACTIONS = Object.freeze([
  "VIEW_ACTIVE_EXECUTION",
  "VIEW_AUTHORIZING_DECISION",
  "SHOW_COMPARISON_HISTORY",
  "INSPECT_RELATED_OBJECT",
] as const);

export type NexoraDecisionTheatreLiveExecutionAction =
  (typeof NEXORA_DECISION_THEATRE_LIVE_EXECUTION_ACTIONS)[number];

export type NexoraDecisionTheatreLiveExecutionActionAvailability = Readonly<{
  action: NexoraDecisionTheatreLiveExecutionAction;
  available: boolean;
  reason: string;
}>;

export type NexoraDecisionTheatreLiveExecutionObservation = Readonly<{
  status: "known" | "unknown";
  summary: string;
}>;

export type NexoraDecisionTheatreLiveExecutionReference = Readonly<{
  id: string;
  label: string;
  kind: "risk" | "constraint" | "evidence" | "kpi" | "outcome";
  related: true;
  causal: false;
}>;

export type NexoraDecisionTheatreLiveExecutionAttentionSignal = Readonly<{
  id: string;
  label: string;
  kind: "risk" | "constraint" | "canonical-status";
  attention: true;
  blocked: false;
  relatedNotCausal: true;
}>;

export type NexoraDecisionTheatreLiveExecutionBlocker = Readonly<{
  id: string;
  label: string;
  source: "authoritative-execution";
  blocked: true;
}>;

export type NexoraDecisionTheatreAdvisorLiveExecutionSummary = Readonly<{
  scene: string;
  happeningNow: string;
  why: string;
  progress: string;
  attention: string;
  blocked: string;
  known: string;
  unknown: string;
  outcome: string;
  association: string;
  completeQuestion: string;
  completeCommand: string;
  mustNotInfer: readonly string[];
}>;

export type NexoraDecisionTheatreLiveExecution = Readonly<{
  identity: typeof nexoraDecisionTheatreLiveExecutionIdentity;
  version: typeof nexoraDecisionTheatreLiveExecutionVersion;
  liveExecutionId: string;
  open: true;
  state: NexoraDecisionTheatreLiveExecutionState;
  sceneIntentKind: string;
  sceneScriptId: string;
  executionId: string;
  decisionId: string;
  decisionTitle: string;
  canonicalStatus: string;
  progressObservation: NexoraDecisionTheatreLiveExecutionObservation;
  ownerObservation: NexoraDecisionTheatreLiveExecutionObservation;
  timingObservation: NexoraDecisionTheatreLiveExecutionObservation;
  outcomeObservation: NexoraDecisionTheatreLiveExecutionObservation;
  evidence: readonly NexoraDecisionTheatreLiveExecutionReference[];
  risks: readonly NexoraDecisionTheatreLiveExecutionReference[];
  constraints: readonly NexoraDecisionTheatreLiveExecutionReference[];
  kpis: readonly NexoraDecisionTheatreLiveExecutionReference[];
  attentionSignals: readonly NexoraDecisionTheatreLiveExecutionAttentionSignal[];
  unknowns: readonly string[];
  blockers: readonly NexoraDecisionTheatreLiveExecutionBlocker[];
  outcomeId: string | null;
  comparisonMemberIds: readonly string[];
  suggestedQuestions: readonly string[];
  actions: readonly NexoraDecisionTheatreLiveExecutionActionAvailability[];
  advisorReadable: NexoraDecisionTheatreAdvisorLiveExecutionSummary;
  limitations: readonly string[];
  derivationMetadata: Readonly<{
    composer: "DTH:10/LiveExecutionComposer";
    inventedExecution: false;
    inventedProgress: false;
    unknownPromotedToBlocked: false;
    unknownPromotedToAttention: false;
    associationPromotedToCause: false;
    clickMutatedExecution: false;
    completedExecution: false;
    inventedOutcome: false;
    mutatedStage: false;
    timestampUsed: false;
    randomUsed: false;
  }>;
}>;
