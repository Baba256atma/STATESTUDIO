/**
 * NPA-T RMS:9 — Take Control handoff contracts.
 * One active manager-turn authority. Same simulation. Same Nexora.
 */

export const rmsTakeControlIdentity = "NPA-T RMS:9/TakeControlHandoff" as const;

export const RMS_MANAGER_AUTHORITIES = Object.freeze(["MANAGER_AGENT", "HUMAN_MANAGER"] as const);
export type RmsManagerAuthority = (typeof RMS_MANAGER_AUTHORITIES)[number];

export const RMS_HANDOFF_PHASES = Object.freeze(["WATCH", "HANDOFF_PENDING", "TAKE_CONTROL", "HANDOFF_FAILED"] as const);
export type RmsHandoffPhase = (typeof RMS_HANDOFF_PHASES)[number];

export const RMS_9_BOUNDARY = Object.freeze({
  identity: rmsTakeControlIdentity,
  ownsManagerAuthorityTransition: true as const,
  ownsHandoffContract: true as const,
  ownsTakeControlLifecycle: true as const,
  ownsGroundTruth: false as const,
  ownsOperator: false as const,
  ownsDataReality: false as const,
  ownsNmi: false as const,
  ownsVai: false as const,
  ownsNps: false as const,
  ownsStage: false as const,
  ownsAdvisor: false as const,
  ownsConversationIntelligence: false as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  ownsOutcome: false as const,
  ownsLearning: false as const,
  parallelNexora: false as const,
  restartsScenarioOnHandoff: false as const,
  mutationBypass: false as const,
  startsRms10: false as const,
  experimentImplemented: false as const,
  conversationEntry: "executeNexoraConversationalExperience" as const,
  decisionAuthority: "CC:10" as const,
  executionAuthority: "CC:11" as const,
  forkCompatible: true as const,
});

export type RmsManagerHandoff = {
  readonly handoffId: string;
  readonly scenarioId: string;
  readonly version: string;
  readonly simulationId: string;
  readonly runId: string;
  readonly watchSessionId: string;
  readonly requestedAtTick: number;
  readonly effectiveAtTick: number | null;
  readonly previousManagerAuthority: "MANAGER_AGENT";
  readonly nextManagerAuthority: "HUMAN_MANAGER";
  readonly conversationRef: string;
  readonly stageRef: string;
  readonly dataRealityRef: string;
  readonly playbackCursor: number;
  readonly status: Exclude<RmsHandoffPhase, "WATCH">;
  readonly failureReason: string | null;
  readonly customerMessage: string | null;
};

export type RmsHandoffTraceEvent = {
  readonly eventId: string;
  readonly kind: "REQUESTED" | "PENDING_IN_FLIGHT" | "AUTHORITY_CHANGED" | "AGENT_FROZEN" | "HUMAN_ACTIVATED" | "HUMAN_TURN" | "FAILED" | "SCHEDULED_AGENT_BLOCKED";
  readonly atTick: number;
  readonly authority: RmsManagerAuthority | "NONE";
};

export type RmsHumanTurnRecord = {
  readonly turnIndex: number;
  readonly speaker: "HUMAN_MANAGER";
  readonly label: "You";
  readonly text: string;
  readonly nexoraResponse: string;
  readonly rewritten: false;
  readonly focusedSubjectId: string | null;
  readonly focusedSubjectLabel: string | null;
};

export type RmsTakeControlView = {
  readonly watchSessionId: string;
  readonly phase: RmsHandoffPhase;
  readonly activeManagerAuthority: RmsManagerAuthority;
  readonly handoff: RmsManagerHandoff | null;
  readonly humanTurns: readonly RmsHumanTurnRecord[];
  readonly summary: string;
  readonly simulationPaused: boolean;
  readonly takeControlImplemented: true;
  readonly forkCompatible: true;
};
