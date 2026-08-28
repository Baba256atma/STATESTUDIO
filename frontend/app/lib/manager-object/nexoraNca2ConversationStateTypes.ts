/**
 * NCA:2 — Conversational context, topic, and dialogue-state contracts.
 * Session-scoped dialogue organization. Not business truth. Not durable memory.
 */

export const nexoraNca2Identity =
  "NCA:2/ConversationalContextTopicDialogueStateIntelligence" as const;
export const nexoraNca2Version = "1.0.0" as const;
export const nexoraNca2Namespace =
  "nexora.nca.conversational-context-dialogue-state" as const;

export const NEXORA_NCA2_BOUNDARY = Object.freeze({
  identity: nexoraNca2Identity,
  createsSecondDurableMemory: false as const,
  createsSecondConversationStore: false as const,
  createsSecondAdvisor: false as const,
  createsSecondJourneyEngine: false as const,
  createsSecondObjectRegistry: false as const,
  usesLiveLlm: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  inventsBusinessTruth: false as const,
  writesExecutiveData: false as const,
});

export const DIALOGUE_MOVES = Object.freeze([
  "NEW_TOPIC",
  "CONTINUE_TOPIC",
  "ANSWER_NEXORA",
  "ANSWER_MANAGER",
  "ASK_MANAGER",
  "CLARIFY",
  "TOPIC_SHIFT",
  "RETURN_TO_TOPIC",
  "FOLLOW_UP",
  "ACKNOWLEDGE",
  "CORRECT",
  "REJECT",
  "ACCEPT",
  "PAUSE_TOPIC",
  "RESUME_TOPIC",
  "CLOSE_TOPIC",
  "UNKNOWN",
] as const);

export type DialogueMove = (typeof DIALOGUE_MOVES)[number];

export const EXPECTED_INFORMATION_KINDS = Object.freeze([
  "BOOLEAN",
  "NUMBER",
  "PERCENTAGE",
  "DATE",
  "DURATION",
  "ENTITY",
  "OPTION",
  "CONSTRAINT",
  "PRIORITY",
  "BUSINESS_FACT",
  "MANAGER_PREFERENCE",
  "FREE_TEXT",
] as const);

export type ExpectedInformationKind =
  (typeof EXPECTED_INFORMATION_KINDS)[number];

export const CONVERSATION_THREAD_STATES = Object.freeze([
  "ACTIVE",
  "SUSPENDED",
  "RESOLVED",
  "ABANDONED",
] as const);

export type ConversationThreadState =
  (typeof CONVERSATION_THREAD_STATES)[number];

export type NcaPendingQuestion = {
  readonly askedBy: "NEXORA";
  readonly question: string;
  readonly purpose: string;
  readonly expectedInformation: ExpectedInformationKind;
  readonly relatedSubjectId: string | null;
  readonly relatedSubjectName: string | null;
  readonly relatedGoal: string | null;
  readonly valid: boolean;
  readonly expiresOn: "answered" | "abandoned" | "resolved" | "superseded";
  readonly askedAtTurn?: number;
  readonly status?: "ACTIVE" | "SUSPENDED" | "ANSWERED" | "EXPIRED" | "SUPERSEDED";
  readonly questionPurpose?: string;
};

export type NcaConversationSubject = {
  readonly id: string | null;
  readonly name: string | null;
  readonly kind: string | null;
};

export type NcaConversationTopic = {
  readonly id: string;
  readonly label: string;
};

export type NcaAnswerPayload = {
  readonly kind: ExpectedInformationKind;
  readonly raw: string;
  readonly display: string;
  readonly booleanValue: boolean | null;
  readonly numericValue: number | null;
  readonly optionIndex: number | null;
  readonly optionLabel: string | null;
};

export type NcaConversationThread = {
  readonly id: string;
  readonly topic: NcaConversationTopic;
  readonly subject: NcaConversationSubject;
  readonly goal: string | null;
  readonly purpose: string;
  readonly state: ConversationThreadState;
  readonly pendingQuestion: NcaPendingQuestion | null;
  readonly lastAnswer: NcaAnswerPayload | null;
  readonly unresolvedNeed: string | null;
  readonly startedAtTurn: number;
  readonly lastActiveAtTurn: number;
  readonly pendingExpired: boolean;
};

export type NcaAdvisoryWork = {
  readonly id: string;
  readonly summary: string;
  readonly threadId: string;
  readonly open: boolean;
};

export type NexoraConversationState = {
  readonly identity: typeof nexoraNca2Identity;
  readonly turnIndex: number;
  readonly activeTopic: NcaConversationTopic | null;
  readonly activeSubject: NcaConversationSubject | null;
  readonly currentThreadId: string | null;
  readonly threads: readonly NcaConversationThread[];
  readonly dialogueMove: DialogueMove;
  readonly pendingQuestion: NcaPendingQuestion | null;
  readonly lastAnswer: NcaAnswerPayload | null;
  readonly lastOfferedOptions: readonly string[];
  readonly lastRecommendation: string | null;
  readonly lastAdvisoryPosition: import("./nexoraNca4AdvisoryIntelligenceTypes.ts").NcaAdvisoryPositionSnapshot | null;
  readonly lastInitiativeSnapshot: import("./nexoraNca5InitiativeIntelligenceTypes.ts").NcaInitiativeSnapshot | null;
  readonly lastCommunicationSnapshot: import("./nexoraNca6CommunicationIntelligenceTypes.ts").NcaCommunicationSnapshot | null;
  readonly dismissedInitiativeKeys: readonly string[];
  readonly suppressedInitiativeKeys: readonly string[];
  readonly lastNexoraQuestion: string | null;
  readonly topicHistory: readonly NcaConversationTopic[];
  readonly recentSubjects: readonly NcaConversationSubject[];
  readonly openAdvisoryWork: readonly NcaAdvisoryWork[];
  readonly answeredMissing: readonly string[];
  readonly lastFailedTurn: NcaFailedConversationTurn | null;
  readonly lastCollection: {
    readonly kind: string;
    readonly items: readonly string[];
    readonly memberIds?: readonly string[];
    readonly establishedAtTurn?: number;
    readonly scope?: string | null;
    readonly source?: string;
  } | null;
  readonly activeComparison?: import("./nexoraNcaPost4CollectionComparison.ts").ActiveComparisonContext | null;
  readonly lastAuthorizedPresentation?: import("./nexoraNxa5Fix4StageContextIntelligence.ts").LastAuthorizedPresentation | null;
  readonly pendingPresentationConsent?: import("./nexoraNxa5Fix4StageContextIntelligence.ts").PendingPresentationConsent | null;
};

export type NcaFailedConversationTurn = {
  readonly managerMessage: string;
  readonly attemptedNeed: string | null;
  readonly attemptedReference: string | null;
  readonly failureKind:
    | "UNRESOLVED_REFERENCE"
    | "AMBIGUOUS_REFERENCE"
    | "UNSUPPORTED_CAPABILITY"
    | "INSUFFICIENT_CONTEXT"
    | "OTHER";
  readonly candidates: readonly string[];
  readonly response: string | null;
  readonly recoverable: boolean;
};

export const NCA2_STATE_BOUNDS = Object.freeze({
  threads: 8,
  topics: 8,
  subjects: 8,
  options: 6,
  advisory: 6,
});
