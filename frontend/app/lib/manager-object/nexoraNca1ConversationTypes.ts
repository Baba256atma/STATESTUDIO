/**
 * NCA:1 — Manager Conversation Architecture contracts.
 * Interprets existing 6.1–6.5 / CC / MO meaning. Not a second intelligence system.
 */

export const nexoraNca1Identity =
  "NCA:1/ManagerConversationArchitectureAdvisorBehaviorFoundation" as const;
export const nexoraNca1Version = "1.0.0" as const;
export const nexoraNca1Namespace =
  "nexora.nca.manager-conversation-architecture" as const;

export const NEXORA_NCA1_BOUNDARY = Object.freeze({
  identity: nexoraNca1Identity,
  createsSecondAdvisor: false as const,
  createsSecondConversationEngine: false as const,
  createsSecondGoalStore: false as const,
  createsSecondObjectRegistry: false as const,
  createsSecondDecisionAuthority: false as const,
  createsSecondExecutionAuthority: false as const,
  createsSecondJourneyEngine: false as const,
  usesLiveLlm: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  inventsBusinessTruth: false as const,
});

export const MANAGER_CONVERSATION_NEEDS = Object.freeze([
  "UNDERSTAND",
  "EXPLORE",
  "LOCATE",
  "EXPLAIN",
  "INVESTIGATE",
  "COMPARE",
  "EVALUATE",
  "DECIDE",
  "ACT",
  "FOLLOW_UP",
  "LEARN",
  "ORIENT",
  "TEACH",
  "CLARIFY",
  "PROVIDE_INFORMATION",
  "REQUEST_RECOMMENDATION",
  "SOCIAL_CONVERSATION",
  "UNKNOWN",
] as const);

export type ManagerConversationNeed =
  (typeof MANAGER_CONVERSATION_NEEDS)[number];

export const ADVISOR_BEHAVIORS = Object.freeze([
  "ANSWER",
  "EXPLAIN",
  "ASK",
  "CLARIFY",
  "GUIDE",
  "RECOMMEND",
  "INVESTIGATE",
  "COMPARE",
  "CHALLENGE",
  "CONFIRM",
  "TEACH",
  "NAVIGATE",
  "SUMMARIZE",
  "ACKNOWLEDGE",
  "DEFER",
] as const);

export type AdvisorBehavior = (typeof ADVISOR_BEHAVIORS)[number];

export type ConversationReference = {
  readonly explicit: string | null;
  readonly resolvedId: string | null;
  readonly resolvedName: string | null;
  readonly confidence: "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  readonly provenance: string | null;
};

export type ConversationKnowledgeState = {
  readonly sufficient: boolean;
  readonly missing: readonly string[];
  readonly evidenceState: "observed" | "inferred" | "suspected" | "predicted" | "unknown";
  readonly uncertainty: string | null;
};

export type AdvisorResponseStrategy = {
  readonly behavior: AdvisorBehavior;
  readonly subject: string | null;
  readonly objective: string;
  readonly evidence: readonly string[];
  readonly uncertainty: string | null;
  readonly question: string | null;
  readonly recommendedAction: string | null;
  readonly capability: string;
  readonly continuity: "preserve" | "update-subject" | "clarify";
};

export type ManagerConversationTurn = {
  readonly identity: typeof nexoraNca1Identity;
  readonly message: string;
  readonly managerContext: {
    readonly role: string | null;
    readonly domain: string | null;
  };
  readonly conversationContext: {
    readonly activeTopic: string | null;
    readonly activeObject: string | null;
    readonly activeGoal: string | null;
    readonly activeJourneyState: string | null;
  };
  readonly reference: ConversationReference;
  readonly need: {
    readonly family: ManagerConversationNeed;
    readonly confidence: number;
  };
  readonly knowledgeState: ConversationKnowledgeState;
  readonly advisorBehavior: AdvisorBehavior;
  readonly strategy: AdvisorResponseStrategy;
};
