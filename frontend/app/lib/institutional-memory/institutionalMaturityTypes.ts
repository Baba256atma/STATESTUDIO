/** D9:2:7 — Organizational learning evolution + institutional intelligence maturity types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { AdaptationRecoverySnapshot } from "./adaptationRecoveryTypes";
import type { DecisionOutcomeSnapshot } from "./decisionOutcomeTypes";
import type { InstitutionalCompressionSnapshot } from "./institutionalDistillationTypes";
import type { LearningConsolidationSnapshot } from "./institutionalCorrelationTypes";
import type { InstitutionalRecallSnapshot } from "./institutionalRecallTypes";
import type {
  EnterpriseCognitionObservationInput,
  InstitutionalLearningSnapshot,
} from "./institutionalMemoryTypes";

export type InstitutionalMaturityLevel =
  | "reactive"
  | "unstable"
  | "adaptive"
  | "resilient"
  | "strategically_mature";

export type EvolutionTrend =
  | "stagnant"
  | "inconsistent"
  | "improving"
  | "accelerating"
  | "regressing";

export type MaturityCategory =
  | "resilience"
  | "governance"
  | "coordination"
  | "operational"
  | "recovery"
  | "fragility"
  | "strategic"
  | "unknown";

export type InstitutionalMaturitySnapshot = {
  maturitySnapshotId: string;
  maturityLevel: InstitutionalMaturityLevel;
  evolutionTrend: EvolutionTrend;
  category: MaturityCategory;
  summary: string;
  observations: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type OrganizationalLearningEvolution = {
  evolutionId: string;
  category: MaturityCategory;
  maturityLevel: InstitutionalMaturityLevel;
  evolutionTrend: EvolutionTrend;
  progressionSummary: string;
  snapshotIds: readonly string[];
  firstObservedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type IntelligenceMaturitySignal = {
  signalId: string;
  category: MaturityCategory;
  signalType: "growth" | "stagnation" | "regression" | "stability";
  summary: string;
  confidence: number;
  generatedAt: number;
};

export type ResilienceMaturityTrend = {
  trendId: string;
  evolutionTrend: EvolutionTrend;
  maturityLevel: InstitutionalMaturityLevel;
  summary: string;
  linkedSnapshotIds: readonly string[];
  generatedAt: number;
};

export type StrategicAdaptationProgress = {
  progressId: string;
  category: MaturityCategory;
  maturityLevel: InstitutionalMaturityLevel;
  adaptationSummary: string;
  generatedAt: number;
};

export type CognitiveEvolutionObservation = {
  observationId: string;
  label: string;
  maturityLevel: InstitutionalMaturityLevel;
  summary: string;
  generatedAt: number;
};

export type InstitutionalIntelligenceMaturitySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  snapshotCount: number;
  dominantMaturityLevel: InstitutionalMaturityLevel;
  dominantEvolutionTrend: EvolutionTrend;
  maturitySummary: string;
  dominantCategories: readonly MaturityCategory[];
  recentSnapshots: readonly InstitutionalMaturitySnapshot[];
  learningEvolutions: readonly OrganizationalLearningEvolution[];
  maturitySignals: readonly IntelligenceMaturitySignal[];
  resilienceTrends: readonly ResilienceMaturityTrend[];
  adaptationProgress: readonly StrategicAdaptationProgress[];
};

export type InstitutionalLearningEvolutionInput = {
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
  now?: number;
};

export type InstitutionalMaturityStoreState = {
  snapshots: readonly InstitutionalMaturitySnapshot[];
  evolutions: readonly OrganizationalLearningEvolution[];
  signals: readonly IntelligenceMaturitySignal[];
  resilienceTrends: readonly ResilienceMaturityTrend[];
  adaptationProgress: readonly StrategicAdaptationProgress[];
  observations: readonly CognitiveEvolutionObservation[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastDominantMaturityLevel: InstitutionalMaturityLevel | null;
};
