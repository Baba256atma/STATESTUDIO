/**
 * DTH:9 — Execution Readiness presentation contract.
 * Theatre interpretation only. Canonical Execution remains CC:11.
 */

export const nexoraDecisionTheatreExecutionReadinessIdentity =
  "DTH:9/ExecutionReadiness" as const;
export const nexoraDecisionTheatreExecutionReadinessVersion = "1.0.0" as const;

export const NEXORA_DECISION_THEATRE_EXECUTION_READINESS_STATES = Object.freeze([
  "NOT_APPLICABLE",
  "DECISION_NOT_COMMITTED",
  "COMMITTED_AWAITING_EXECUTION",
  "EXECUTION_READY",
  "EXECUTION_BLOCKED",
  "EXECUTION_STARTED",
] as const);

export type NexoraDecisionTheatreExecutionReadinessState =
  (typeof NEXORA_DECISION_THEATRE_EXECUTION_READINESS_STATES)[number];

export const NEXORA_DECISION_THEATRE_EXECUTION_READINESS_ACTIONS = Object.freeze([
  "VIEW_COMMITTED_DECISION",
  "SHOW_EXECUTION_READINESS",
  "SHOW_RELATED_EXECUTION",
  "SHOW_COMPARISON_HISTORY",
  "REQUEST_START_EXECUTION",
] as const);

export type NexoraDecisionTheatreExecutionReadinessAction =
  (typeof NEXORA_DECISION_THEATRE_EXECUTION_READINESS_ACTIONS)[number];

export type NexoraDecisionTheatreExecutionReadinessActionAvailability = Readonly<{
  action: NexoraDecisionTheatreExecutionReadinessAction;
  available: boolean;
  reason: string;
}>;

export type NexoraDecisionTheatreReadinessEvidence = Readonly<{
  status: "known" | "unknown" | "blocked";
  summary: string;
}>;

export type NexoraDecisionTheatreExecutionReadinessBlocker = Readonly<{
  id: string;
  label: string;
  source: "authoritative-execution";
}>;

export type NexoraDecisionTheatreAdvisorExecutionReadinessSummary = Readonly<{
  scene: string;
  hasStarted: string;
  whatHappensNext: string;
  readiness: string;
  missing: string;
  startBoundary: string;
  mustNotInfer: readonly string[];
}>;

export type NexoraDecisionTheatreExecutionReadiness = Readonly<{
  identity: typeof nexoraDecisionTheatreExecutionReadinessIdentity;
  version: typeof nexoraDecisionTheatreExecutionReadinessVersion;
  readinessId: string;
  open: boolean;
  readiness: NexoraDecisionTheatreExecutionReadinessState;
  sceneIntentKind: string;
  sceneScriptId: string;
  decisionId: string;
  decisionTitle: string;
  executionId: string | null;
  executionStatus: string | null;
  cc11Available: boolean;
  relatedExecutionExists: boolean;
  canRequestExecutionStart: boolean;
  supportedDimensions: Readonly<{
    owner: NexoraDecisionTheatreReadinessEvidence;
    timing: NexoraDecisionTheatreReadinessEvidence;
    resources: NexoraDecisionTheatreReadinessEvidence;
    dependencies: NexoraDecisionTheatreReadinessEvidence;
    constraints: NexoraDecisionTheatreReadinessEvidence;
    risk: NexoraDecisionTheatreReadinessEvidence;
  }>;
  blockers: readonly NexoraDecisionTheatreExecutionReadinessBlocker[];
  unknownDimensions: readonly string[];
  comparisonMemberIds: readonly string[];
  suggestedQuestions: readonly string[];
  actions: readonly NexoraDecisionTheatreExecutionReadinessActionAvailability[];
  advisorReadable: NexoraDecisionTheatreAdvisorExecutionReadinessSummary;
  limitations: readonly string[];
  derivationMetadata: Readonly<{
    composer: "DTH:9/ExecutionReadinessComposer";
    inventedExecution: false;
    clickStartedExecution: false;
    approvalStartedExecution: false;
    unknownPromotedToBlocked: false;
    inventedOwnerOrTiming: false;
    mutatedStage: false;
    timestampUsed: false;
    randomUsed: false;
  }>;
}>;
