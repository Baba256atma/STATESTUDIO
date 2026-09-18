/**
 * NPA-T NMI:7 — read-only Advisor management-intelligence context.
 * Existing CC:5 / NCA / ECA remain conversational authority.
 */

import type { NmiContextKind, NmiNodeKind } from "./nmiContract.ts";
import type { ManagementMap, NmiManagementBranch } from "./nmiManagementMapContract.ts";
import type {
  ManagementRelationshipIntelligence,
  NmiRelationshipGap,
} from "./nmiRelationshipIntelligenceContract.ts";
import type {
  NmiAttentionItem,
  NmiQueueEntryInput,
  NmiQueueSubjectInput,
} from "./nmiManagementNavigationContract.ts";
import type { NmiRoadmapPossibleNext, NmiRoadmapPosition, NmiRoadmapStageStatus } from "./nmiDecisionRoadmapContract.ts";
import { nmiAdvisorIdentity } from "./nmiAdvisorIdentity.ts";
import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";

export const NMI_ADVISOR_INTENTS = Object.freeze([
  "LOCATION",
  "RELATED",
  "CAUSAL",
  "ATTENTION",
  "ROADMAP",
  "GAPS",
  "EVIDENCE",
  "NEXT",
  "KNOW",
  "NONE",
] as const);

export type NmiAdvisorIntent = (typeof NMI_ADVISOR_INTENTS)[number];

export type NmiAdvisorBundle = {
  readonly map: ManagementMap;
  readonly queueEntries?: readonly NmiQueueEntryInput[];
  readonly subjects?: readonly NmiQueueSubjectInput[];
  readonly stageProjectionAnchorId?: string | null;
  readonly staleAttentionId?: string | null;
  readonly staleMapSelectionId?: string | null;
  readonly staleRoadmapAnchorId?: string | null;
  readonly staleStageBranchId?: string | null;
  readonly staleComparisonId?: string | null;
};

export type NmiAdvisorGapNote = {
  readonly label: string;
  readonly status: "MISSING" | "UNRESOLVED" | "NOT_REACHED" | "NOT_APPLICABLE";
};

export type NmiAdvisorContext = {
  readonly identity: typeof nmiAdvisorIdentity;
  readonly conversationalAuthority: typeof conversationalExperienceIdentity;
  readonly activeCanonicalId: string | null;
  readonly activeTitle: string | null;
  readonly selectedNodeKind: NmiNodeKind | null;
  readonly managementContext: NmiContextKind;
  readonly branch: NmiManagementBranch | null;
  readonly interpretations: readonly ManagementRelationshipIntelligence[];
  readonly relationshipGaps: readonly NmiRelationshipGap[];
  readonly attentionItem: NmiAttentionItem | null;
  readonly roadmapId: string | null;
  readonly roadmapPosition: NmiRoadmapPosition | null;
  readonly roadmapStageStatuses: Readonly<Record<string, NmiRoadmapStageStatus>>;
  readonly possibleNextStages: readonly NmiRoadmapPossibleNext[];
  readonly gapNotes: readonly NmiAdvisorGapNote[];
  readonly evidenceRefs: readonly string[];
  readonly provenanceRefs: readonly string[];
  readonly unresolvedRelationshipIds: readonly string[];
  readonly stageProjectionAnchorId: string | null;
  readonly collectionOwnsReferent: false;
  readonly secondAdvisor: false;
  readonly secondReferentResolver: false;
  readonly requiredAction: false;
  readonly writesDecision: false;
  readonly writesExecution: false;
  readonly writesOutcome: false;
  readonly writesDataReality: false;
  readonly bypassesGate: false;
  readonly readsSealedRmsGroundTruth: false;
  readonly startsNmi8: false;
};

export const NMI_ADVISOR_CONTRACT = Object.freeze({
  identity: nmiAdvisorIdentity,
  conversationalAuthority: conversationalExperienceIdentity,
  secondAdvisor: false as const,
  secondReferentResolver: false as const,
  secondFocusRegistry: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  writesDataReality: false as const,
  bypassesGate: false as const,
  readsSealedRmsGroundTruth: false as const,
  convertsNextToRequiredAction: false as const,
  startsNmi8: false as const,
  startsDthExp: false as const,
});

export const NMI_ADVISOR_GATE_FLOW = Object.freeze([
  "EXTERNAL_OR_INTERNAL_INPUT",
  "GATE_API_RDI_1",
  "CANONICAL_AUTHORITY_OR_DATA_REALITY",
  "NMI_UNIFIED_MANAGEMENT_MODEL",
  "EXISTING_CC_NCA_ECA_REFERENT",
  "NMI_ADVISOR_READ_CONTEXT",
  "EXISTING_ADVISOR_COMPOSER",
] as const);
