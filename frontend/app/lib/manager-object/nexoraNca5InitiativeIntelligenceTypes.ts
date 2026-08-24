/**
 * NCA:5 — Proactive executive advisor and conversational-initiative contracts.
 * Policy layer over existing attention / change / NCA:1–4 authorities.
 * Not a second alert queue, monitor, recommendation, or Advisor.
 */

export const nexoraNca5Identity =
  "NCA:5/ProactiveExecutiveAdvisorConversationalInitiativeIntelligence" as const;
export const nexoraNca5Version = "1.0.0" as const;
export const nexoraNca5Namespace =
  "nexora.nca.proactive-executive-advisor-conversational-initiative" as const;

export const NEXORA_NCA5_BOUNDARY = Object.freeze({
  identity: nexoraNca5Identity,
  createsSecondAlertQueue: false as const,
  createsSecondMonitoringEngine: false as const,
  createsSecondRiskEngine: false as const,
  createsSecondRecommendationEngine: false as const,
  createsSecondGoalTracker: false as const,
  createsSecondOutcomeEngine: false as const,
  createsSecondAdvisor: false as const,
  createsBackgroundScheduler: false as const,
  usesLiveLlm: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  inventsBusinessTruth: false as const,
  duplicatesMo6: false as const,
});

export const PROACTIVE_SIGNAL_FAMILIES = Object.freeze([
  "MATERIAL_CHANGE",
  "GOAL_DEVIATION",
  "RISK_ESCALATION",
  "OPPORTUNITY",
  "CONSTRAINT",
  "ASSUMPTION_INVALIDATION",
  "RECOMMENDATION_CHANGE",
  "DECISION_RISK",
  "EXECUTION_DRIFT",
  "OUTCOME_CHANGE",
  "LEARNING_SIGNAL",
  "UNRESOLVED_THREAD",
  "NEW_EVIDENCE",
  "TIME_SENSITIVE",
  "MANAGER_FOLLOW_UP",
] as const);
export type ProactiveSignalFamily = (typeof PROACTIVE_SIGNAL_FAMILIES)[number];

export const INITIATIVE_PRIORITIES = Object.freeze([
  "LOW",
  "NORMAL",
  "HIGH",
  "CRITICAL",
] as const);
export type InitiativePriority = (typeof INITIATIVE_PRIORITIES)[number];

export const PROACTIVE_ADVISOR_BEHAVIORS = Object.freeze([
  "SURFACE",
  "INFORM",
  "ASK",
  "WARN",
  "RECOMMEND",
  "CHALLENGE",
  "FOLLOW_UP",
  "GUIDE",
  "REASSESS",
  "ACKNOWLEDGE_CHANGE",
  "SILENT",
] as const);
export type ProactiveAdvisorBehavior = (typeof PROACTIVE_ADVISOR_BEHAVIORS)[number];

export const CONVERSATION_IMPORTANCE_LEVELS = Object.freeze([
  "LOW",
  "NORMAL",
  "HIGH",
  "CRITICAL",
] as const);
export type ConversationImportance = (typeof CONVERSATION_IMPORTANCE_LEVELS)[number];

export type ProactiveExecutiveSignal = {
  readonly id: string;
  readonly family: ProactiveSignalFamily;
  readonly source: string;
  readonly subjectId: string;
  readonly subjectLabel: string;
  readonly goalId?: string | null;
  readonly observation: string;
  readonly previousValue?: number | null;
  readonly currentValue?: number | null;
  readonly targetValue?: number | null;
  readonly significance: number;
  readonly relevance: number;
  readonly urgency: number;
  readonly novelty: number;
  readonly actionability: number;
  readonly confidence: number;
  readonly evidence: readonly string[];
  readonly uncertainties: readonly string[];
  readonly nextStep?: string | null;
  readonly critical?: boolean;
  readonly positive?: boolean;
  readonly processOnly?: boolean;
};

export type NcaInitiativeSnapshot = {
  readonly signalId: string;
  readonly subjectId: string;
  readonly family: ProactiveSignalFamily;
  readonly fingerprint: string;
  readonly behavior: ProactiveAdvisorBehavior;
  readonly priority: InitiativePriority;
  readonly observation: string;
  readonly currentValue: number | null;
};

export type ConversationalInitiativeDecision = {
  readonly shouldInitiate: boolean;
  readonly signal: ProactiveExecutiveSignal | null;
  readonly reason: string;
  readonly priority: InitiativePriority;
  readonly behavior: ProactiveAdvisorBehavior;
  readonly interruption: {
    readonly justified: boolean;
    readonly reason: string;
  };
  readonly value: number;
  readonly competingCount: number;
};

export type ProactiveConversationStrategy = {
  readonly behavior: ProactiveAdvisorBehavior;
  readonly subject: string | null;
  readonly objective: string;
  readonly reasonForInitiative: string;
  readonly evidence: readonly string[];
  readonly nextCapability: "NCA:3" | "NCA:4" | "MO:6" | "NONE";
  readonly interruptionJustified: boolean;
  readonly suppressRepeat: boolean;
  readonly presentationIntent: {
    readonly kind: "advisor-message" | "information-card-ready" | "none";
    readonly subject: string | null;
    readonly reason: string;
    readonly importance: InitiativePriority;
    readonly evidence: readonly string[];
    readonly recommendedNextStep: string | null;
  };
  readonly timelineIntent: {
    readonly eventKind: string;
    readonly subject: string | null;
    readonly summary: string;
  } | null;
};

export type ExecutiveInitiativeStrategy = {
  readonly identity: typeof nexoraNca5Identity;
  readonly shouldInitiate: boolean;
  readonly decision: ConversationalInitiativeDecision;
  readonly strategy: ProactiveConversationStrategy;
  readonly snapshot: NcaInitiativeSnapshot | null;
  readonly response: string | null;
  readonly question: string | null;
  readonly commitsDecision: false;
  readonly startsExecution: false;
  readonly reason: string;
};
