/**
 * NPA-T RMS:6 — Events, disturbances, and world-condition injection.
 * Events are simulation reality. They are not Nexora Problems or Risks.
 */

export const rmsEventDisturbanceIdentity = "NPA-T RMS:6/EventsDisturbances" as const;

export const RMS_EVENT_FAMILIES = Object.freeze([
  "DEMAND",
  "CAPACITY",
  "ASSET",
  "SUPPLY",
  "INVENTORY",
  "RESOURCE",
  "COST",
  "QUALITY",
  "SCHEDULE",
  "SCOPE",
] as const);
export type RmsEventFamily = (typeof RMS_EVENT_FAMILIES)[number];

export const RMS_EVENT_LIFECYCLES = Object.freeze(["SCHEDULED", "ACTIVE", "RECOVERING", "COMPLETED"] as const);
export type RmsEventLifecycle = (typeof RMS_EVENT_LIFECYCLES)[number];

export const RMS_6_BOUNDARY = Object.freeze({
  identity: rmsEventDisturbanceIdentity,
  ownsEventContracts: true as const,
  ownsSchedule: true as const,
  ownsDisturbanceLifecycle: true as const,
  ownsTransitionRequests: true as const,
  ownsWorldConditionInjection: true as const,
  ownsRecoveryScheduling: true as const,
  ownsEventTrace: true as const,
  ownsNexoraProblemObjects: false as const,
  ownsNexoraRiskObjects: false as const,
  ownsDataReality: false as const,
  ownsEvidence: false as const,
  ownsNmi: false as const,
  ownsVai: false as const,
  ownsNps: false as const,
  ownsAdvisor: false as const,
  ownsStage: false as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  ownsOutcome: false as const,
  ownsLearning: false as const,
  injectsProblemObjects: false as const,
  injectsRiskObjects: false as const,
  publishesGroundTruthToNexora: false as const,
  bypassesOperatorRdi: false as const,
  simulationCausalityIsNexoraEvidence: false as const,
  d7IsGroundTruth: false as const,
  startsRms7: false as const,
  transitionAuthority: "RMS:2 applyRmsWorldEventsOnCurrentTick" as const,
});

export type RmsScheduledDisturbance = {
  readonly eventId: string;
  readonly family: RmsEventFamily;
  readonly kind: "INSTANT" | "DURATION" | "RECOVERY";
  readonly scheduledTick: number;
  readonly durationTicks: number | null;
  readonly targetEntityId: string;
  readonly magnitude: number;
  readonly origin: "RMS_SCHEDULER";
  readonly createsNexoraProblemObject: false;
  readonly createsNexoraRiskObject: false;
  readonly knownToNexora: false;
  readonly knownToManager: false;
};

export type RmsProblemInjection = {
  readonly injectionId: string;
  readonly label: string;
  readonly createsNexoraProblemObject: false;
  readonly createsNexoraRiskObject: false;
  readonly worldConditions: readonly RmsScheduledDisturbance[];
};

export type RmsCompiledTransition = {
  readonly eventId: string;
  readonly effect: "DIRECT" | "SECONDARY";
  readonly assumption: string | null;
  readonly worldEvent: import("./rmsWorldContract.ts").RmsWorldEvent;
};

export type RmsEventTrace = {
  readonly eventId: string;
  readonly family: RmsEventFamily;
  readonly tick: number;
  readonly historyIds: readonly string[];
  readonly hiddenFromNexora: true;
  readonly hiddenFromManager: true;
};
