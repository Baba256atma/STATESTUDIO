/**
 * NPA-T NMI:4 — Decision Roadmap read contract.
 * Composed from NMI:1–3. Does not own Decision, Execution, Stage, Queue, or causal truth.
 */

import type { NmiCanonicalRef, NmiContextKind } from "./nmiContract.ts";
import type { ManagementMap } from "./nmiManagementMapContract.ts";
import type { NmiCausalCommunication, NmiRelationshipGapReason } from "./nmiRelationshipIntelligenceContract.ts";
import { nmiDecisionRoadmapIdentity } from "./nmiDecisionRoadmapIdentity.ts";

export const NMI_ROADMAP_STAGES = Object.freeze([
  "CONTEXT",
  "GOAL",
  "OPERATION",
  "KPI_DATA",
  "ISSUE",
  "ANALYSIS",
  "SCENARIO",
  "COMPARISON",
  "DECISION",
  "EXECUTION",
  "OUTCOME",
  "LEARNING_REASSESSMENT",
] as const);

export type NmiRoadmapStage = (typeof NMI_ROADMAP_STAGES)[number];

export const NMI_ROADMAP_STAGE_STATUSES = Object.freeze([
  "PRESENT",
  "PARTIAL",
  "MISSING",
  "UNRESOLVED",
  "NOT_REACHED",
  "NOT_APPLICABLE",
] as const);

export type NmiRoadmapStageStatus = (typeof NMI_ROADMAP_STAGE_STATUSES)[number];

export const NMI_ROADMAP_KNOWLEDGE_KINDS = Object.freeze([
  "KNOWN_FACT",
  "OBSERVED_EVIDENCE",
  "CALCULATED_METRIC",
  "MANAGER_CONFIRMED",
  "HYPOTHESIS",
  "ANALYTICAL_RELATIONSHIP",
  "SUPPORTED_CAUSAL_RELATIONSHIP",
  "DECISION",
  "EXECUTION",
  "OBSERVED_OUTCOME",
  "UNKNOWN",
] as const);

export type NmiRoadmapKnowledgeKind = (typeof NMI_ROADMAP_KNOWLEDGE_KINDS)[number];

export type NmiComparisonRef = {
  readonly comparisonId: string;
  readonly authority: string;
  readonly scenarioIds: readonly string[];
  readonly sourceRef: string;
};

export type NmiRoadmapElement = {
  readonly elementId: string;
  readonly canonicalRef: NmiCanonicalRef | null;
  readonly comparisonId: string | null;
  readonly authority: string;
  readonly relationshipIds: readonly string[];
  readonly provenance: readonly string[];
  readonly knowledgeKind: NmiRoadmapKnowledgeKind;
  readonly causalCommunication: NmiCausalCommunication | null;
  readonly title: string | null;
  readonly knownStatus: string | null;
};

export type NmiRoadmapStageView = {
  readonly stage: NmiRoadmapStage;
  readonly status: NmiRoadmapStageStatus;
  readonly elements: readonly NmiRoadmapElement[];
  readonly relationshipIds: readonly string[];
};

export type NmiRoadmapPosition = {
  readonly primary: NmiRoadmapStage;
  readonly secondary: NmiRoadmapStage | null;
  readonly descriptive: true;
  readonly advancesCanonicalWorkflow: false;
};

export type NmiRoadmapPossibleNext = {
  readonly stage: NmiRoadmapStage;
  readonly descriptive: true;
  readonly requiredAction: false;
};

export type NmiRoadmapGap = {
  readonly gapId: string;
  readonly stage: NmiRoadmapStage;
  readonly reason: NmiRelationshipGapReason | "COMPARISON_MISSING" | "STAGE_MISSING" | "STAGE_NOT_REACHED";
  readonly detail: string;
  readonly requiresAttention: false;
  readonly inventedRelationship: false;
};

export type NmiRoadmapBranch = {
  readonly fromStage: "SCENARIO";
  readonly elementIds: readonly string[];
  readonly prefersScenario: false;
};

export type NmiRoadmapConvergence = {
  readonly fromElementIds: readonly string[];
  readonly toStage: "COMPARISON" | "DECISION";
  readonly canonical: true;
};

export type NmiDecisionRoadmap = {
  readonly identity: typeof nmiDecisionRoadmapIdentity;
  readonly roadmapId: string;
  readonly contextId: string;
  readonly contextKind: NmiContextKind;
  readonly contextAuthority: "BCA:1/BusinessProjectContextFoundation";
  readonly anchorRef: NmiCanonicalRef;
  readonly sourceMap: ManagementMap;
  readonly stages: readonly NmiRoadmapStageView[];
  readonly currentPosition: NmiRoadmapPosition;
  readonly possibleNextStages: readonly NmiRoadmapPossibleNext[];
  readonly gaps: readonly NmiRoadmapGap[];
  readonly branches: readonly NmiRoadmapBranch[];
  readonly convergences: readonly NmiRoadmapConvergence[];
  readonly compositionProvenance: readonly string[];
  readonly mutatesStage: false;
  readonly mutatesQueue: false;
  readonly mutatesObjects: false;
  readonly writesDataReality: false;
  readonly bypassesGate: false;
  readonly createsCausalCertainty: false;
  readonly approvesDecisions: false;
  readonly startsExecutions: false;
  readonly decidesAttention: false;
  readonly requiredAction: false;
  readonly projectsOntoStage: false;
  readonly startsNmi5: false;
  readonly readsSealedRmsGroundTruth: false;
};

export type NmiDecisionRoadmapExplanation = {
  readonly roadmapId: string;
  readonly about: string;
  readonly goalIds: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly issueIds: readonly string[];
  readonly relationshipIds: readonly string[];
  readonly scenarioIds: readonly string[];
  readonly comparisonOccurred: boolean;
  readonly decisionIds: readonly string[];
  readonly executionIds: readonly string[];
  readonly outcomeIds: readonly string[];
  readonly unknown: readonly string[];
  readonly mutatesAdvisor: false;
};

export type NmiDecisionRoadmapProjection = {
  readonly roadmapId: string;
  readonly lines: readonly string[];
  readonly mutatesQueue: false;
  readonly mutatesStage: false;
};

export const NMI_DECISION_ROADMAP_CONTRACT = Object.freeze({
  identity: nmiDecisionRoadmapIdentity,
  sourceAuthorities: Object.freeze([
    "NPA-T NMI:1/ManagementIntelligenceFoundation",
    "NPA-T NMI:2/BusinessProjectManagementMap",
    "NPA-T NMI:3/ManagementRelationshipIntelligence",
  ]),
  comparisonAuthorities: Object.freeze(["DS:7:8 Scenario Comparison Foundation", "APP-6:7 Decision Comparison"]),
  ownsDecision: false as const,
  ownsExecution: false as const,
  forcedWorkflow: false as const,
  stateMachine: false as const,
  manufacturesConfidenceScores: false as const,
  selectsPreferredScenario: false as const,
  comparisonImpliesApproval: false as const,
  scenarioImpliesDecision: false as const,
  decisionImpliesExecution: false as const,
  executionImpliesOutcome: false as const,
  outcomeImpliesLearning: false as const,
  analysisImpliesCausality: false as const,
  decidesAttention: false as const,
  requiredAction: false as const,
  mutatesStage: false as const,
  mutatesQueue: false as const,
  mutatesObjects: false as const,
  writesDataReality: false as const,
  bypassesGate: false as const,
  readsSealedRmsGroundTruth: false as const,
  parallelAdvisor: false as const,
  projectsOntoStage: false as const,
  startsNmi5: false as const,
});

export const NMI_DECISION_ROADMAP_GATE_FLOW = Object.freeze([
  "EXTERNAL_OR_INTERNAL_INPUT",
  "GATE_API_RDI_1",
  "CANONICAL_AUTHORITY_OR_DATA_REALITY",
  "NMI_UNIFIED_MANAGEMENT_MODEL",
  "NMI_MANAGEMENT_MAP",
  "NMI_RELATIONSHIP_INTELLIGENCE",
  "NMI_DECISION_ROADMAP",
] as const);
