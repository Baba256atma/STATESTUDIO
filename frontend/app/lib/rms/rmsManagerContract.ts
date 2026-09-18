/**
 * NPA-T RMS:4 — Manager Agent conversation contracts.
 * Manager Agent uses real CC:5. It does not own Nexora conversation intelligence.
 */

import { RMS_NEXORA_PARTICIPANT_CONTRACT } from "./rmsActorContracts.ts";

export const rmsManagerConversationIdentity = "NPA-T RMS:4/ManagerAgentConversation" as const;

export const RMS_MANAGER_INTENTS = Object.freeze([
  "UNDERSTAND",
  "INSPECT",
  "INVESTIGATE",
  "ASK_DATA",
  "ASK_CAUSE",
  "ASK_OPTIONS",
  "COMPARE",
  "ASK_RECOMMENDATION",
  "FOLLOW_UP",
  "CLARIFY",
] as const);

export type RmsManagerIntent = (typeof RMS_MANAGER_INTENTS)[number];

export const RMS_MANAGER_PROFILE_IDS = Object.freeze([
  "STANDARD_MANAGER",
  "IMPATIENT_MANAGER",
  "DATA_DRIVEN_MANAGER",
] as const);

export type RmsManagerProfileId = (typeof RMS_MANAGER_PROFILE_IDS)[number];

export type RmsManagerProfile = {
  readonly profileId: RmsManagerProfileId;
  readonly experienceLevel: "standard" | "junior" | "seasoned";
  readonly patience: "balanced" | "low" | "high";
  readonly dataOrientation: "balanced" | "high";
  readonly questioningDepth: "balanced" | "shallow" | "deep";
  readonly riskSensitivity: "balanced" | "high";
  readonly communicationBrevity: "balanced" | "short";
  readonly groundTruthAccess: false;
};

export type RmsManagerObjective = {
  readonly objectiveId: string;
  readonly statement: string;
  readonly hostKind: "BUSINESS" | "PROJECT";
  readonly agenda: readonly RmsManagerIntent[];
};

export type RmsManagerVisibleFact = {
  readonly factId: string;
  readonly text: string;
  readonly source: "nexora-response" | "stage-visible" | "data-visible" | "prior-conversation" | "supplied-background";
};

export type RmsManagerKnowledge = {
  readonly plane: "MANAGER_PERCEPTION";
  readonly background: readonly string[];
  readonly visibleFacts: readonly RmsManagerVisibleFact[];
  readonly knownMeanings: Readonly<Record<string, string>>;
  readonly currentSubject: string | null;
  readonly discussedLabels: readonly string[];
  readonly unresolvedQuestions: readonly string[];
  readonly sealedGroundTruth: false;
  readonly observerKnowledge: false;
};

export const RMS_4_BOUNDARY = Object.freeze({
  identity: rmsManagerConversationIdentity,
  ownsManagerBehavior: true as const,
  ownsManagerProfile: true as const,
  ownsManagerObjective: true as const,
  ownsManagerKnowledge: true as const,
  ownsManagerMemory: true as const,
  ownsIntentSelection: true as const,
  ownsTurnGeneration: true as const,
  ownsConversationObservation: true as const,
  ownsNexoraConversation: false as const,
  ownsNca: false as const,
  ownsEca: false as const,
  ownsNps: false as const,
  ownsAdvisor: false as const,
  ownsStage: false as const,
  ownsReferentResolution: false as const,
  ownsDataReality: false as const,
  ownsSemantics: false as const,
  ownsNmi: false as const,
  ownsVai: false as const,
  ownsObjects: false as const,
  ownsConfirmation: false as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  ownsOutcome: false as const,
  ownsLearning: false as const,
  parallelConversationEngine: false as const,
  privilegedNexoraRoute: false as const,
  automaticSemanticTruth: false as const,
  confirmationBypass: false as const,
  decisionBypass: false as const,
  executionBypass: false as const,
  autoConfirm: false as const,
  autoApproveDecision: false as const,
  autoStartExecution: false as const,
  rewriteNexoraResponses: false as const,
  managerReadsGroundTruth: false as const,
  managerReadsObserver: false as const,
  startsRms5: false as const,
  conversationEntry: RMS_NEXORA_PARTICIPANT_CONTRACT.runtimeEntry,
  conversationOwner: "CC:5" as const,
});

export const RMS_4_CONVERSATION_ERROR_KINDS = Object.freeze([
  "WRONG_REFERENT",
  "STALE_SUBJECT",
  "FAILED_CLARIFICATION",
  "UNSUPPORTED_CLAIM",
  "GROUND_TRUTH_LEAKAGE",
  "SEMANTIC_LEAKAGE",
  "MANAGER_MISUNDERSTANDING",
  "MALFORMED_MANAGER_TURN",
  "NEXORA_FALLBACK",
  "MUTATION_SAFETY_FAILURE",
  "CONVERSATION_RUNTIME_FAILURE",
] as const);

export type Rms4ConversationErrorKind = (typeof RMS_4_CONVERSATION_ERROR_KINDS)[number];

export type Rms4ConversationClassification = {
  readonly classificationId: string;
  readonly kind: Rms4ConversationErrorKind;
  readonly note: string;
  readonly origin: "rms-integration" | "nexora-product";
  readonly repaired: false;
};

export const RMS_ARCHITECTURE_TERMS = Object.freeze([
  "CC:5",
  "NCA",
  "ECA",
  "MO",
  "RDI",
  "VAI",
] as const);
