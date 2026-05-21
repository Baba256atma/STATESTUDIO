/** D9:2:6 — Institutional cognitive recall + executive historical context reconstruction types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { AdaptationRecoverySnapshot } from "./adaptationRecoveryTypes";
import type { DecisionOutcomeSnapshot } from "./decisionOutcomeTypes";
import type { InstitutionalCompressionSnapshot } from "./institutionalDistillationTypes";
import type { LearningConsolidationSnapshot } from "./institutionalCorrelationTypes";
import type {
  EnterpriseCognitionObservationInput,
  InstitutionalLearningSnapshot,
} from "./institutionalMemoryTypes";

export type OperationalSimilarityLevel = "weak" | "moderate" | "strong" | "highly_similar";

export type RecallCategory =
  | "fragility"
  | "escalation"
  | "governance"
  | "recovery"
  | "resilience"
  | "operational"
  | "coordination"
  | "strategic"
  | "unknown";

export type OperationalSimilarityScore = {
  scoreId: string;
  level: OperationalSimilarityLevel;
  numericScore: number;
  matchedSignals: readonly string[];
  generatedAt: number;
};

export type InstitutionalRecallResult = {
  recallId: string;
  similarityLevel: OperationalSimilarityLevel;
  category: RecallCategory;
  title: string;
  summary: string;
  relatedMemories: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type HistoricalContextFrame = {
  frameId: string;
  category: RecallCategory;
  timelineLabel: string;
  narrative: string;
  recallIds: readonly string[];
  relatedMemories: readonly string[];
  firstObservedAt: number;
  lastObservedAt: number;
};

export type ExecutiveHistoricalReference = {
  referenceId: string;
  category: RecallCategory;
  headline: string;
  executiveContext: string;
  recallIds: readonly string[];
  generatedAt: number;
};

export type StrategicMemoryMatch = {
  matchId: string;
  category: RecallCategory;
  similarityLevel: OperationalSimilarityLevel;
  matchedInsightId: string | null;
  matchedRecallId: string;
  summary: string;
  generatedAt: number;
};

export type HistoricalSituationReconstruction = {
  reconstructionId: string;
  category: RecallCategory;
  situationSummary: string;
  historicalParallels: readonly string[];
  consequenceContext: string;
  recallIds: readonly string[];
  generatedAt: number;
};

export type InstitutionalRecallSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  recallCount: number;
  contextFrameCount: number;
  reconstructionCount: number;
  recallSummary: string;
  dominantCategories: readonly RecallCategory[];
  recentRecalls: readonly InstitutionalRecallResult[];
  contextFrames: readonly HistoricalContextFrame[];
  executiveReferences: readonly ExecutiveHistoricalReference[];
  strategicMatches: readonly StrategicMemoryMatch[];
  reconstructions: readonly HistoricalSituationReconstruction[];
};

export type InstitutionalCognitiveRecallInput = {
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
  now?: number;
};

export type InstitutionalRecallStoreState = {
  recalls: readonly InstitutionalRecallResult[];
  contextFrames: readonly HistoricalContextFrame[];
  executiveReferences: readonly ExecutiveHistoricalReference[];
  strategicMatches: readonly StrategicMemoryMatch[];
  reconstructions: readonly HistoricalSituationReconstruction[];
  similarityScores: readonly OperationalSimilarityScore[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
