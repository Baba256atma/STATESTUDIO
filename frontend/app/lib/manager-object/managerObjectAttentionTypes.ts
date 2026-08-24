/**
 * MO:6 — Executive Attention & Intervention Intelligence schemas.
 * Reader + classifier. Not a monitoring, queue, risk, or decision authority.
 */

import type { ExplanationEpistemicStatus } from "./managerObjectExplainTypes.ts";

export const executiveAttentionIntelligenceIdentity =
  "MO:6/ExecutiveAttentionInterventionIntelligence" as const;
export const executiveAttentionIntelligenceVersion = "1.0.0" as const;
export const executiveAttentionIntelligenceNamespace =
  "nexora.manager-object.executive-attention-intelligence" as const;

export const ATTENTION_LEVELS = Object.freeze([
  "NONE",
  "WATCH",
  "ATTENTION",
  "URGENT",
] as const);
export type AttentionLevel = (typeof ATTENTION_LEVELS)[number];

export const INTERVENTION_NEEDS = Object.freeze([
  "NOT_REQUIRED",
  "MONITOR",
  "REVIEW",
  "DECISION_REQUIRED",
  "ACTION_REQUIRED",
  "ESCALATION_REQUIRED",
  "UNKNOWN",
] as const);
export type InterventionNeed = (typeof INTERVENTION_NEEDS)[number];

export const ATTENTION_LIFECYCLES = Object.freeze([
  "NEW",
  "ONGOING",
  "ESCALATED",
  "DEESCALATED",
  "RESOLVED",
] as const);
export type AttentionLifecycle = (typeof ATTENTION_LIFECYCLES)[number];

export const ATTENTION_ITEM_KINDS = Object.freeze([
  "GOAL",
  "JOURNEY_BLOCKER",
  "CHANGE",
  "PROBLEM",
  "RISK",
  "OPPORTUNITY",
  "DECISION",
  "EXECUTION",
  "OUTCOME",
  "EVIDENCE",
  "CONFLICT",
  "MONITORING",
] as const);
export type AttentionItemKind = (typeof ATTENTION_ITEM_KINDS)[number];

export const EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY = Object.freeze({
  identity: executiveAttentionIntelligenceIdentity,
  readerResolverClassifier: true as const,
  monitoringPlatform: false as const,
  duplicateQueue: false as const,
  riskEngine: false as const,
  changeEngine: false as const,
  recommendationEngine: false as const,
  workflowEngine: false as const,
  stealsDirectFocus: false as const,
  writesStageCoordinates: false as const,
  autoCentersAttentionObject: false as const,
  commitsDecisions: false as const,
  startsExecution: false as const,
  changesExecution: false as const,
  changesGoals: false as const,
  inventsDeadlines: false as const,
  inventsConsequences: false as const,
  usesLlm: false as const,
  hardcodedAttention: false as const,
  truthPrecedence:
    "Canonical Runtime Truth > MO Context > MO:2 > MO:3 > MO:4 > MO:5 > MO:6 Attention Projection > Presentation" as const,
  llmBoundary:
    "Optional future wording only. Must not invent attention facts, urgency, deadlines, risks, interventions, consequences, decisions, execution, or outcomes.",
  reusedAuthorities: Object.freeze([
    "DRI-6/AttentionFocus (read, not recalculated)",
    "STAGE-PROD:2/ChangeIntelligence (signals, not a second detector)",
    "STAGE-PROD:3/NBA (not duplicated)",
    "PROD Executive Queue (not duplicated)",
    "PM monitoring (signals only)",
    "MO:4 goal direction",
    "MO:5 journey blockers",
    "Decision Runtime",
    "Execution Runtime",
  ]),
});

export type ExecutiveAttentionSignal = {
  readonly subjectId: string;
  readonly lifecycle: AttentionLifecycle;
  readonly magnitude?: "material" | "minor" | "unknown";
  readonly stale?: boolean;
  readonly ownerCanResolve?: boolean;
  readonly managerAuthority?: boolean;
  readonly opportunity?: boolean;
  readonly deadline?: string | null;
};

export type ExecutiveAttentionItem = {
  readonly attentionId: string;
  readonly subjectId: string | null;
  readonly label: string;
  readonly kind: AttentionItemKind;
  readonly reason: string;
  readonly attentionLevel: AttentionLevel;
  readonly goalRelevance: "DIRECT" | "RELATED" | "LOW" | "UNAVAILABLE";
  readonly journeyRelevance: "BLOCKER" | "ON_PATH" | "LOW" | "NONE";
  readonly urgency: "none" | "routine" | "time-sensitive" | "unknown";
  readonly impact: string;
  readonly changeSignal: AttentionLifecycle | null;
  readonly blocker: boolean;
  readonly evidence: readonly string[];
  readonly epistemicStatus: ExplanationEpistemicStatus;
  readonly interventionNeed: InterventionNeed;
  readonly recommendedPath: string | null;
  readonly rankingSignals: readonly string[];
  readonly score: number;
  readonly managerAuthorityRequired: boolean;
  readonly isCausalClaim: false;
};

export type ExecutiveInterventionAssessment = {
  readonly need: InterventionNeed;
  readonly trigger: string | null;
  readonly reason: string;
  readonly managerAuthorityRequired: boolean;
};

export type ExecutiveAttentionIntelligence = {
  readonly engineId: typeof executiveAttentionIntelligenceIdentity;
  readonly attentionState: AttentionLevel;
  readonly attentionItems: readonly ExecutiveAttentionItem[];
  readonly primaryAttention: ExecutiveAttentionItem | null;
  readonly secondaryItems: readonly ExecutiveAttentionItem[];
  readonly comparablePriority: boolean;
  readonly interventionAssessment: ExecutiveInterventionAssessment;
  readonly safeToContinueItems: readonly string[];
  readonly doNotDisturb: boolean;
  readonly goalRankingAvailable: boolean;
  readonly stealsDirectFocus: false;
  readonly inactionConsequence: string;
  readonly unknowns: readonly string[];
  readonly reasoningSummary: string;
  readonly managerFacingText: string;
  readonly usesLlm: false;
  readonly commitsDecision: false;
  readonly startsExecution: false;
  readonly changesExecution: false;
  readonly changesGoals: false;
  readonly writesStageCoordinates: false;
};
