/**
 * NCA:7 — End-to-end conversation orchestration contracts.
 * Inspect, compose, and certify NCA:1–6. Not a seventh intelligence engine.
 */

export const nexoraNca7Identity =
  "NCA:7/EndToEndConversationOrchestrationFinalCertification" as const;
export const nexoraNca7Version = "1.0.0" as const;
export const nexoraNca7Namespace =
  "nexora.nca.end-to-end-conversation-orchestration-final-certification" as const;

export const NEXORA_NCA7_BOUNDARY = Object.freeze({
  identity: nexoraNca7Identity,
  createsSeventhIntelligenceEngine: false as const,
  createsSecondAdvisor: false as const,
  usesLiveLlm: false as const,
  createsRag: false as const,
  createsWebResearch: false as const,
  createsDirector: false as const,
  createsInformationCards: false as const,
  createsTimelineUi: false as const,
  createsDecisionEngine: false as const,
  createsExecutionEngine: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  inventsBusinessTruth: false as const,
  hidesLowerLayerDefects: false as const,
});

export const NCA7_PRECEDENCE = Object.freeze([
  "SAFETY_AUTHORITY",
  "ENTRANCE_JOURNEY",
  "DECISION_CONFIRMATION",
  "EXECUTION_CONFIRMATION",
  "NCA2_PENDING_ANSWER",
  "NCA3_MATERIAL_GAP",
  "MANAGER_CURRENT_REQUEST",
  "NCA4_ADVISORY",
  "NCA5_JUSTIFIED_INITIATIVE",
  "NCA6_PRESENTATION",
] as const);

export type Nca7PrecedenceRank = (typeof NCA7_PRECEDENCE)[number];

export const NCA7_RESPONSE_OWNERS = Object.freeze([
  "SAFETY",
  "ENTRANCE",
  "DECISION_CONFIRMATION",
  "EXECUTION_CONFIRMATION",
  "NCA2_PENDING_ANSWER",
  "NCA3_GAP",
  "MANAGER_REQUEST",
  "NCA4_ADVISORY",
  "NCA5_INITIATIVE",
  "NCA6_PRESENTATION",
] as const);

export type Nca7ResponseOwner = (typeof NCA7_RESPONSE_OWNERS)[number];

export type NexoraConversationTurnResult = {
  readonly identity: typeof nexoraNca7Identity;
  readonly interpretation: {
    readonly need: string | null;
    readonly reference: string | null;
    readonly behavior: string | null;
  };
  readonly dialogue: {
    readonly topic: string | null;
    readonly subject: string | null;
    readonly move: string | null;
    readonly thread: string | null;
    readonly pendingQuestion: string | null;
  };
  readonly sufficiency: {
    readonly state: string | null;
    readonly materialGap: string | null;
    readonly shouldAsk: boolean;
  };
  readonly advisory: {
    readonly shouldAdvise: boolean;
    readonly status: string | null;
    readonly option: string | null;
    readonly confidence: string | null;
  };
  readonly initiative: {
    readonly shouldInitiate: boolean;
    readonly behavior: string | null;
    readonly interruptJustified: boolean;
  };
  readonly communication: {
    readonly depth: string | null;
    readonly framing: string | null;
    readonly familiarity: string | null;
    readonly role: string | null;
  };
  readonly authority: {
    readonly owner: Nca7ResponseOwner;
    readonly action: string;
    readonly rank: Nca7PrecedenceRank;
  };
  readonly response: {
    readonly managerFacingText: string;
  };
  readonly effects: {
    readonly commitsDecision: boolean;
    readonly startsExecution: boolean;
    readonly writesBusinessTruth: boolean;
  };
  readonly diagnosticTrace: string;
};

export const NCA7_CANONICAL_PRECEDENCE_NOTE = Object.freeze({
  rule:
    "Safety and locked authority text beat NCA layers. Entrance journey ownership is preserved when the presented response is locked. Decision and Execution confirmation beat moderate initiative. A pending NCA:2 answer is interpreted before new topic search. A material NCA:3 gap blocks NCA:4 advice. The manager's explicit current request beats moderate NCA:5 initiative. NCA:4 advises only when justified. NCA:5 may interrupt only under its certified critical policy. NCA:6 adapts presentation and never owns truth.",
});
