/** D9:2:8 — Strategic institutional knowledge continuity + executive wisdom preservation types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { AdaptationRecoverySnapshot } from "./adaptationRecoveryTypes";
import type { DecisionOutcomeSnapshot } from "./decisionOutcomeTypes";
import type { InstitutionalCompressionSnapshot } from "./institutionalDistillationTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "./institutionalMaturityTypes";
import type { LearningConsolidationSnapshot } from "./institutionalCorrelationTypes";
import type { InstitutionalRecallSnapshot } from "./institutionalRecallTypes";
import type {
  EnterpriseCognitionObservationInput,
  InstitutionalLearningSnapshot,
} from "./institutionalMemoryTypes";

export type StrategicWisdomCategory =
  | "fragility"
  | "resilience"
  | "governance"
  | "recovery"
  | "operational"
  | "coordination"
  | "escalation"
  | "strategic"
  | "unknown";

export type ContinuityLevel =
  | "temporary"
  | "retained"
  | "persistent"
  | "institutionalized"
  | "foundational";

export type InstitutionalWisdomArtifact = {
  wisdomArtifactId: string;
  category: StrategicWisdomCategory;
  continuityLevel: ContinuityLevel;
  title: string;
  summary: string;
  supportingPatterns: readonly string[];
  confidence: number;
  generatedAt: number;
  lastPreservedAt: number;
  occurrenceCount: number;
  linkedAnchorIds: readonly string[];
};

export type StrategicKnowledgeContinuityRecord = {
  continuityRecordId: string;
  category: StrategicWisdomCategory;
  continuityLevel: ContinuityLevel;
  lesson: string;
  artifactIds: readonly string[];
  firstPreservedAt: number;
  lastPreservedAt: number;
  occurrenceCount: number;
};

export type ExecutiveWisdomPreservationSignal = {
  signalId: string;
  category: StrategicWisdomCategory;
  signalType: "preservation" | "anchor" | "foundational";
  summary: string;
  confidence: number;
  generatedAt: number;
};

export type InstitutionalKnowledgeAnchor = {
  anchorId: string;
  category: StrategicWisdomCategory;
  anchorLabel: string;
  wisdomSummary: string;
  artifactIds: readonly string[];
  continuityLevel: ContinuityLevel;
  firstAnchoredAt: number;
  lastAnchoredAt: number;
};

export type OrganizationalContinuitySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  artifactCount: number;
  anchorCount: number;
  continuitySummary: string;
  dominantCategories: readonly StrategicWisdomCategory[];
  dominantContinuityLevel: ContinuityLevel;
  recentArtifacts: readonly InstitutionalWisdomArtifact[];
  continuityRecords: readonly StrategicKnowledgeContinuityRecord[];
  preservationSignals: readonly ExecutiveWisdomPreservationSignal[];
  knowledgeAnchors: readonly InstitutionalKnowledgeAnchor[];
};

export type InstitutionalKnowledgeContinuityInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  observations?: EnterpriseCognitionObservationInput | null;
  continuityPreserved?: boolean;
  fragilityElevated?: boolean;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  correlationSnapshot?: LearningConsolidationSnapshot | null;
  adaptationSnapshot?: AdaptationRecoverySnapshot | null;
  decisionOutcomeSnapshot?: DecisionOutcomeSnapshot | null;
  distillationSnapshot?: InstitutionalCompressionSnapshot | null;
  recallSnapshot?: InstitutionalRecallSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  now?: number;
};

export type InstitutionalContinuityStoreState = {
  artifacts: readonly InstitutionalWisdomArtifact[];
  continuityRecords: readonly StrategicKnowledgeContinuityRecord[];
  preservationSignals: readonly ExecutiveWisdomPreservationSignal[];
  knowledgeAnchors: readonly InstitutionalKnowledgeAnchor[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
