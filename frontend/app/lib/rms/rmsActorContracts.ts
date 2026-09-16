/**
 * NPA-T RMS:1 — independent RMS participants.
 *
 * Manager Agent and Operator Agent are simulation actors.
 * Nexora is the existing product runtime, not a simulation-privileged copy.
 * Observer is read-only and outside the authority chain.
 */

export const RMS_PARTICIPANT_KINDS = Object.freeze([
  "MANAGER_AGENT",
  "OPERATOR_AGENT",
  "NEXORA",
  "OBSERVER",
  "REAL_MANAGER",
] as const);

export type RmsParticipantKind = (typeof RMS_PARTICIPANT_KINDS)[number];

export const RMS_MANAGER_CHANNEL_SOURCES = Object.freeze([
  "MANAGER_AGENT",
  "REAL_MANAGER",
] as const);

export type RmsManagerChannelSource = (typeof RMS_MANAGER_CHANNEL_SOURCES)[number];

export const RMS_MANAGER_AGENT_FUTURE_RESPONSIBILITIES = Object.freeze([
  "ASK_MANAGERIAL_QUESTIONS",
  "SET_GOALS",
  "INVESTIGATE_PROBLEMS",
  "REVIEW_KPIS_RISKS",
  "COMPARE_SCENARIOS",
  "MAKE_OR_APPROVE_DECISIONS",
  "MONITOR_EXECUTION_AND_OUTCOMES",
] as const);

export const RMS_OPERATOR_FUTURE_DOMAINS = Object.freeze([
  "SALES",
  "PURCHASING",
  "PRODUCTION",
  "INVENTORY",
  "MAINTENANCE",
  "HR",
  "FINANCE",
  "PMO_PROJECT_OPERATIONS",
  "OTHER_OPERATIONS",
] as const);

export type RmsOperatorFutureDomain = (typeof RMS_OPERATOR_FUTURE_DOMAINS)[number];

export type RmsActorIdentity = {
  readonly actorId: string;
  readonly kind: RmsParticipantKind;
};

export const RMS_MANAGER_AGENT_CONTRACT = Object.freeze({
  kind: "MANAGER_AGENT" as const,
  represents: "realistic manager agent" as const,
  distinguishableFromRealManager: true as const,
  realManagerKind: "REAL_MANAGER" as const,
  futureResponsibilities: RMS_MANAGER_AGENT_FUTURE_RESPONSIBILITIES,
  autonomousDecisionLoop: false as const,
  ownsStage: false as const,
  ownsAdvisor: false as const,
  ownsDecisionRuntime: false as const,
  speaksToNexoraThroughExistingConversation: true as const,
  conversationOwner: "CC:5" as const,
});

export const RMS_OPERATOR_AGENT_CONTRACT = Object.freeze({
  kind: "OPERATOR_AGENT" as const,
  represents: "simulated business/project operational activity" as const,
  futureDomains: RMS_OPERATOR_FUTURE_DOMAINS,
  producesObservableDataLater: true as const,
  domainSimulationImplemented: false as const,
  csvGenerationImplemented: false as const,
  mayWriteGroundTruthDirectlyToNexora: false as const,
  observableDataHandoffOwner: "Data Reality" as const,
});

export const RMS_NEXORA_PARTICIPANT_CONTRACT = Object.freeze({
  kind: "NEXORA" as const,
  privilegedSimulationRuntime: false as const,
  runtimeOwner: "CC:5" as const,
  runtimeEntry: "executeNexoraConversationalExperience" as const,
  groundTruthAccess: "FORBIDDEN" as const,
  legitimateKnowledgeSources: Object.freeze([
    "Data Reality",
    "Manager-Object",
    "Advisor presentation",
    "Stage / Director projection",
    "CC:8 Evidence",
    "CC:9 Scenario",
    "CC:10 Decision",
    "CC:11 Execution",
    "CORE-OUT Outcome",
    "ECA / NPS consumption",
  ]),
  mayInventHiddenWorldFacts: false as const,
});

export const RMS_OBSERVER_CONTRACT = Object.freeze({
  kind: "OBSERVER" as const,
  readOnly: true as const,
  mayMutateSimulation: false as const,
  mayMutateNexora: false as const,
  mayRepairActorsSilently: false as const,
  mayOverrideManager: false as const,
  mayOverrideOperator: false as const,
  mayOverrideNexora: false as const,
  isAuthorityInsideFlow: false as const,
});

export type RmsTaggedAction = {
  readonly actionId: string;
  readonly actorId: string;
  readonly actorKind: RmsParticipantKind;
  readonly managerChannelSource: RmsManagerChannelSource | null;
  readonly kind: string;
};

export function tagRmsAction(input: RmsTaggedAction): RmsTaggedAction {
  if (!input.actorId.trim()) {
    throw new Error("RMS:1 action requires actorId");
  }
  if (input.actorKind === "MANAGER_AGENT" && input.managerChannelSource !== "MANAGER_AGENT") {
    throw new Error("RMS:1 Manager Agent actions must be tagged MANAGER_AGENT");
  }
  if (input.actorKind === "REAL_MANAGER" && input.managerChannelSource !== "REAL_MANAGER") {
    throw new Error("RMS:1 real-manager actions must be tagged REAL_MANAGER");
  }
  if (
    input.actorKind !== "MANAGER_AGENT" &&
    input.actorKind !== "REAL_MANAGER" &&
    input.managerChannelSource !== null
  ) {
    throw new Error("RMS:1 manager channel applies only to manager participants");
  }
  return Object.freeze({ ...input });
}

export function actorActionsAreDistinguishable(
  left: RmsTaggedAction,
  right: RmsTaggedAction,
): boolean {
  if (left.actorKind !== right.actorKind) return true;
  if (left.managerChannelSource !== right.managerChannelSource) return true;
  return left.actorId !== right.actorId;
}
