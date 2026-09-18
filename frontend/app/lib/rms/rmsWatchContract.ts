/**
 * NPA-T RMS:8 — WATCH mode contracts.
 * Customer observes a simulated Manager using real Nexora.
 * Presentation only. No second Stage/Advisor. No TAKE_CONTROL.
 */

export const rmsWatchExperienceIdentity = "NPA-T RMS:8/WatchExperience" as const;

export const RMS_WATCH_MOMENT_KINDS = Object.freeze([
  "SIMULATION_STARTED",
  "DATA_CHANGE",
  "KPI_CHANGE",
  "MANAGER_QUESTION",
  "NEXORA_ATTENTION",
  "PROBLEM_IDENTIFIED",
  "RISK_IDENTIFIED",
  "INVESTIGATION",
  "SCENARIO_AVAILABLE",
  "DECISION_READINESS",
] as const);
export type RmsWatchMomentKind = (typeof RMS_WATCH_MOMENT_KINDS)[number];

export const RMS_WATCH_PLAYBACK_STATES = Object.freeze(["idle", "playing", "paused", "completed"] as const);
export type RmsWatchPlaybackState = (typeof RMS_WATCH_PLAYBACK_STATES)[number];

export const RMS_WATCH_PROGRESS = Object.freeze([
  "Beginning",
  "Situation Developing",
  "Investigation",
  "Management Response",
] as const);
export type RmsWatchProgress = (typeof RMS_WATCH_PROGRESS)[number];

export const RMS_WATCH_SPEEDS = Object.freeze([1, 2, 4] as const);
export type RmsWatchSpeed = (typeof RMS_WATCH_SPEEDS)[number];

export const RMS_8_BOUNDARY = Object.freeze({
  identity: rmsWatchExperienceIdentity,
  interactionMode: "WATCH" as const,
  ownsWatchPresentation: true as const,
  ownsWatchPlayback: true as const,
  ownsWatchWorkspace: true as const,
  ownsScenarioRegistry: false as const,
  ownsStage: false as const,
  ownsAdvisor: false as const,
  ownsDirector: false as const,
  ownsDataReality: false as const,
  ownsNmi: false as const,
  ownsVai: false as const,
  ownsCc5: false as const,
  ownsObserver: false as const,
  ownsGroundTruth: false as const,
  rewritesNexoraResponses: false as const,
  inventsProblems: false as const,
  inventsRisks: false as const,
  confirmsSemantics: false as const,
  duplicatesCc5OnPlayback: false as const,
  takeControlImplemented: false as const,
  experimentImplemented: false as const,
  startsRms9: false as const,
  forkCompatible: true as const,
  conversationEntry: "executeNexoraConversationalExperience" as const,
});

export type RmsWatchScenarioCard = {
  readonly scenarioId: string;
  readonly version: string;
  readonly title: string;
  readonly worldKind: "BUSINESS" | "PROJECT" | "HYBRID";
  readonly worldKindLabel: "Business" | "Project" | "Hybrid";
  readonly shortDescription: string;
  readonly managementTopics: readonly string[];
  readonly estimatedLength: string;
  readonly dataAreas: readonly string[];
};

export type RmsWatchVisibleDatum = {
  readonly field: string;
  readonly value: string | number | boolean | null;
  readonly unit: string | null;
  readonly status: "AVAILABLE" | "DELAYED" | "MISSING" | "STALE";
  readonly semanticConfirmed: false;
};

export type RmsWatchConversationTurn = {
  readonly turnIndex: number;
  readonly speaker: "SIMULATED_MANAGER" | "NEXORA";
  readonly managerLabel: "Simulated Manager";
  readonly nexoraLabel: "Nexora";
  readonly text: string;
  readonly rewritten: false;
  readonly focusedSubjectId: string | null;
  readonly focusedSubjectLabel: string | null;
};

export type RmsWatchMoment = {
  readonly momentId: string;
  readonly kind: RmsWatchMomentKind;
  readonly label: string;
  readonly summary: string;
  readonly conversationTurnIndex: number | null;
  readonly invented: false;
};

export type RmsWatchStageReference = {
  readonly authority: "Nexora Stage";
  readonly workspace: string | null;
  readonly focusedSubjectId: string | null;
  readonly focusedSubjectLabel: string | null;
  readonly rmsOwnsStage: false;
};

export type RmsWatchSafeSurface = {
  readonly scenarioId: string;
  readonly version: string;
  readonly simulationId: string;
  readonly runId: string;
  readonly managerLabel: "Simulated Manager";
  readonly managerObjective: string;
  readonly hostKind: "BUSINESS" | "PROJECT";
  readonly turns: readonly {
    readonly turnIndex: number;
    readonly intent: string;
    readonly utterance: string;
    readonly nexoraResponse: string;
    readonly rewritten: false;
    readonly focusedSubjectId: string | null;
    readonly focusedSubjectLabel: string | null;
    readonly confirmationRequired: boolean;
  }[];
  readonly data: readonly RmsWatchVisibleDatum[];
  readonly publicationCount: number;
  readonly managerTurnCount: number;
  readonly stage: RmsWatchStageReference;
};

export type RmsWatchPresentation = {
  readonly scenario: RmsWatchScenarioCard;
  readonly organizationLabel: string;
  readonly managerLabel: "Simulated Manager";
  readonly managerObjective: string;
  readonly moments: readonly RmsWatchMoment[];
  readonly conversation: readonly RmsWatchConversationTurn[];
  readonly data: readonly RmsWatchVisibleDatum[];
  readonly stage: RmsWatchStageReference;
  readonly whatChanged: string;
  readonly whyNexoraReacted: string;
  readonly guidance: readonly string[];
  readonly takeControlReserved: true;
  readonly takeControlImplemented: false;
  readonly forkCompatible: true;
  readonly sealedGroundTruthExposed: false;
  readonly observerDiagnosticsExposed: false;
};

export type RmsWatchSession = {
  readonly watchSessionId: string;
  readonly scenarioId: string;
  readonly version: string;
  readonly runId: string;
  readonly simulationId: string;
  readonly interactionMode: "WATCH";
  readonly playbackState: RmsWatchPlaybackState;
  readonly cursor: number;
  readonly speed: RmsWatchSpeed;
  readonly progress: RmsWatchProgress;
  readonly currentTickLabel: string;
  readonly visibleMoments: readonly RmsWatchMoment[];
  readonly currentMoment: RmsWatchMoment | null;
  readonly presentation: RmsWatchPresentation;
  readonly execution: {
    readonly managerTurnCount: number;
    readonly publicationCount: number;
    readonly cc5CallsAfterStart: 0;
  };
  readonly takeControl: {
    readonly reserved: true;
    readonly implemented: false;
    readonly handoffReady: true;
  };
  readonly forkCompatible: true;
};
