/**
 * NPA-T NMI:5 — Management Navigation and Attention contracts.
 * Attention reads STAGE-PROD:1 Queue. Does not own Queue, priority, Stage, or Advisor.
 */

import type { NmiCanonicalRef, NmiContextKind, NmiNodeKind } from "./nmiContract.ts";
import type { NmiHybridLanePreservation, NmiManagementMapSection } from "./nmiManagementMapContract.ts";
import type { NmiRoadmapStage } from "./nmiDecisionRoadmapContract.ts";
import { nmiManagementNavigationIdentity } from "./nmiManagementNavigationIdentity.ts";

export const NMI_NAVIGATION_MODES = Object.freeze(["ATTENTION", "MANAGEMENT_MAP"] as const);
export type NmiNavigationMode = (typeof NMI_NAVIGATION_MODES)[number];

export const NMI_NAVIGATION_SECTIONS = Object.freeze([
  "CONTEXT",
  "GOALS",
  "OPERATIONS",
  "KPI_DATA",
  "PROBLEMS_RISKS",
  "VARIABLES",
  "SCENARIOS",
  "DECISIONS",
  "EXECUTIONS",
  "OUTCOMES_LEARNING",
] as const);

export type NmiNavigationSection = (typeof NMI_NAVIGATION_SECTIONS)[number];

export const NMI_ATTENTION_REASONS = Object.freeze([
  "EXISTING_QUEUE_ITEM",
  "CRITICAL_PROBLEM",
  "ACTIVE_RISK",
  "EVIDENCE_GAP",
  "RELATIONSHIP_GAP",
  "DECISION_PENDING",
  "EXECUTION_ACTIVE",
  "EXECUTION_BLOCKED",
  "OUTCOME_REVIEW",
  "REASSESSMENT_AVAILABLE",
] as const);

export type NmiAttentionReason = (typeof NMI_ATTENTION_REASONS)[number];

export const NMI_ATTENTION_ITEM_TYPES = Object.freeze([
  "problem",
  "risk",
  "opportunity",
  "scenario",
  "decision",
  "execution",
  "goal",
  "changes-since-visit",
] as const);

export type NmiAttentionItemType = (typeof NMI_ATTENTION_ITEM_TYPES)[number];

export type NmiQueueEntryInput = {
  readonly category: NmiAttentionItemType;
  readonly count: number;
  readonly objectIds: readonly string[];
  readonly isActive?: boolean;
};

export type NmiQueueSubjectInput = {
  readonly subjectId: string;
  readonly title?: string | null;
  readonly attention?: string | null;
  readonly status?: string | null;
  readonly workKind?: string | null;
};

export type NmiAttentionItem = {
  readonly itemId: string;
  readonly canonicalRef: NmiCanonicalRef;
  readonly itemType: NmiAttentionItemType;
  readonly title: string | null;
  readonly sourceAuthority: "STAGE-PROD:1/ExecutiveStageQueueFoundation";
  readonly queueCategory: NmiAttentionItemType;
  readonly queueObjectIds: readonly string[];
  readonly managementContext: NmiContextKind;
  readonly relatedGoalId: string | null;
  readonly relatedRoadmapId: string | null;
  readonly relatedRoadmapPosition: NmiRoadmapStage | null;
  readonly attentionReasons: readonly NmiAttentionReason[];
  readonly evidenceRefs: readonly string[];
  readonly provenance: readonly string[];
  readonly unresolved: boolean;
  readonly navigationTarget: string;
  readonly priority: "UNKNOWN";
  readonly numericPriority: null;
  readonly urgencyInvented: false;
};

export type NmiSelectionIdentity = {
  readonly canonicalId: string;
  readonly kind: NmiNodeKind | NmiAttentionItemType;
  readonly source: "QUEUE" | "MAP";
  readonly substitutesSubject: false;
};

export type NmiMapNavigationView = {
  readonly section: NmiNavigationSection;
  readonly mapSections: readonly NmiManagementMapSection[];
  readonly nodeIds: readonly string[];
  readonly count: number;
};

export type NmiManagementNavigation = {
  readonly identity: typeof nmiManagementNavigationIdentity;
  readonly mode: NmiNavigationMode;
  readonly section: NmiNavigationSection | null;
  readonly contextKind: NmiContextKind;
  readonly hybridLanes: NmiHybridLanePreservation | null;
  readonly attentionItems: readonly NmiAttentionItem[];
  readonly attentionCount: number;
  readonly queueEntries: readonly NmiQueueEntryInput[];
  readonly mapViews: readonly NmiMapNavigationView[];
  readonly selected: NmiSelectionIdentity | null;
  readonly secondQueue: false;
  readonly mutatesQueueAuthority: false;
  readonly mutatesObjects: false;
  readonly mutatesDecisions: false;
  readonly mutatesExecutions: false;
  readonly projectsOntoStage: false;
  readonly inventsPriorityScore: false;
  readonly parallelAdvisor: false;
  readonly bypassesGate: false;
  readonly readsSealedRmsGroundTruth: false;
  readonly startsNmi6: false;
};

export const NMI_ATTENTION_PROMOTION_RULE = Object.freeze({
  mapNodeWithoutQueue: false as const,
  relationshipGapWithoutQueue: false as const,
  roadmapNotReachedWithoutQueue: false as const,
  enrichExistingQueueItem: true as const,
  description:
    "Only STAGE-PROD:1 Queue object IDs become Attention items. NMI:3/4 gaps may annotate those items, never mint new Attention rows.",
});

export const NMI_MANAGEMENT_NAVIGATION_CONTRACT = Object.freeze({
  identity: nmiManagementNavigationIdentity,
  queueAuthority: "STAGE-PROD:1/ExecutiveStageQueueFoundation",
  secondQueue: false as const,
  mutatesQueueAuthority: false as const,
  inventsPriorityScore: false as const,
  hiddenAiRanking: false as const,
  manufacturesUrgency: false as const,
  mapNodeImpliesAttention: false as const,
  relationshipGapImpliesAttention: false as const,
  notReachedImpliesAttention: false as const,
  projectsOntoStage: false as const,
  parallelAdvisor: false as const,
  bypassesGate: false as const,
  readsSealedRmsGroundTruth: false as const,
  startsNmi6: false as const,
  writeActions: false as const,
});

export const NMI_MANAGEMENT_NAVIGATION_GATE_FLOW = Object.freeze([
  "EXTERNAL_OR_INTERNAL_INPUT",
  "GATE_API_RDI_1",
  "CANONICAL_AUTHORITY_OR_DATA_REALITY",
  "NMI_UNIFIED_MANAGEMENT_MODEL",
  "NMI_MANAGEMENT_MAP",
  "STAGE_PROD_1_QUEUE",
  "NMI_ATTENTION_AND_NAVIGATION",
] as const);
