/** D9:2:5 — Strategic institutional memory compression + executive knowledge distillation types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { AdaptationRecoverySnapshot } from "./adaptationRecoveryTypes";
import type { DecisionOutcomeSnapshot } from "./decisionOutcomeTypes";
import type { LearningConsolidationSnapshot } from "./institutionalCorrelationTypes";
import type {
  EnterpriseCognitionObservationInput,
  InstitutionalLearningSnapshot,
} from "./institutionalMemoryTypes";

export type MemoryCompressionLevel =
  | "raw"
  | "summarized"
  | "condensed"
  | "distilled"
  | "strategic_core";

export type InsightCategory =
  | "fragility"
  | "resilience"
  | "governance"
  | "escalation"
  | "recovery"
  | "operational"
  | "coordination"
  | "strategic"
  | "unknown";

export type DistilledInstitutionalInsight = {
  distilledInsightId: string;
  category: InsightCategory;
  compressionLevel: MemoryCompressionLevel;
  title: string;
  summary: string;
  supportingPatterns: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
  linkedMemoryIds: readonly string[];
};

export type StrategicKnowledgeArtifact = {
  artifactId: string;
  category: InsightCategory;
  compressionLevel: MemoryCompressionLevel;
  lesson: string;
  insightIds: readonly string[];
  linkedMemoryIds: readonly string[];
  firstObservedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type ExecutiveLearningSummary = {
  summaryId: string;
  headline: string;
  narrative: string;
  dominantCategories: readonly InsightCategory[];
  insightCount: number;
  generatedAt: number;
};

export type OrganizationalWisdomPattern = {
  patternId: string;
  category: InsightCategory;
  wisdom: string;
  supportingInsightIds: readonly string[];
  compressionLevel: MemoryCompressionLevel;
  confidence: number;
  firstObservedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type InstitutionalCompressionSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  insightCount: number;
  artifactCount: number;
  wisdomPatternCount: number;
  distillationSummary: string;
  dominantCategories: readonly InsightCategory[];
  recentInsights: readonly DistilledInstitutionalInsight[];
  strategicArtifacts: readonly StrategicKnowledgeArtifact[];
  executiveSummary: ExecutiveLearningSummary | null;
  wisdomPatterns: readonly OrganizationalWisdomPattern[];
};

export type InstitutionalKnowledgeDistillationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  observations?: EnterpriseCognitionObservationInput | null;
  continuityPreserved?: boolean;
  fragilityElevated?: boolean;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  correlationSnapshot?: LearningConsolidationSnapshot | null;
  adaptationSnapshot?: AdaptationRecoverySnapshot | null;
  decisionOutcomeSnapshot?: DecisionOutcomeSnapshot | null;
  now?: number;
};

export type InstitutionalDistillationStoreState = {
  insights: readonly DistilledInstitutionalInsight[];
  artifacts: readonly StrategicKnowledgeArtifact[];
  summaries: readonly ExecutiveLearningSummary[];
  wisdomPatterns: readonly OrganizationalWisdomPattern[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
