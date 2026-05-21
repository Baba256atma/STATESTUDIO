/** D9:2:4 — Institutional decision outcome learning + executive consequence awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { AdaptationRecoverySnapshot } from "./adaptationRecoveryTypes";
import type { LearningConsolidationSnapshot } from "./institutionalCorrelationTypes";
import type {
  EnterpriseCognitionObservationInput,
  InstitutionalLearningSnapshot,
} from "./institutionalMemoryTypes";

export type DecisionImpactLevel = "minimal" | "moderate" | "significant" | "major" | "systemic";

export type ConsequencePropagationType =
  | "isolated"
  | "localized"
  | "distributed"
  | "cascading"
  | "systemic";

export type DecisionCategory =
  | "operational"
  | "governance"
  | "resilience"
  | "escalation"
  | "coordination"
  | "strategic"
  | "recovery"
  | "unknown";

export type InstitutionalDecisionRecord = {
  decisionOutcomeId: string;
  decisionCategory: DecisionCategory;
  impactLevel: DecisionImpactLevel;
  propagationType: ConsequencePropagationType;
  summary: string;
  observations: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
  linkedMemoryIds: readonly string[];
};

export type OperationalOutcomeObservation = {
  observationId: string;
  label: string;
  impactLevel: DecisionImpactLevel;
  summary: string;
  generatedAt: number;
};

export type ExecutiveConsequencePattern = {
  patternId: string;
  decisionCategory: DecisionCategory;
  impactLevel: DecisionImpactLevel;
  lesson: string;
  outcomeIds: readonly string[];
  linkedMemoryIds: readonly string[];
  firstObservedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type StrategicOutcomeCorrelation = {
  correlationId: string;
  decisionCategory: DecisionCategory;
  propagationType: ConsequencePropagationType;
  summary: string;
  linkedOutcomeIds: readonly string[];
  generatedAt: number;
};

export type DecisionOutcomeSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  outcomeCount: number;
  patternCount: number;
  consequenceSummary: string;
  dominantCategories: readonly DecisionCategory[];
  recentOutcomes: readonly InstitutionalDecisionRecord[];
  consequencePatterns: readonly ExecutiveConsequencePattern[];
  strategicCorrelations: readonly StrategicOutcomeCorrelation[];
};

export type InstitutionalDecisionOutcomeInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  observations?: EnterpriseCognitionObservationInput | null;
  continuityPreserved?: boolean;
  fragilityElevated?: boolean;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  correlationSnapshot?: LearningConsolidationSnapshot | null;
  adaptationSnapshot?: AdaptationRecoverySnapshot | null;
  now?: number;
};

export type DecisionOutcomeStoreState = {
  decisions: readonly InstitutionalDecisionRecord[];
  observations: readonly OperationalOutcomeObservation[];
  patterns: readonly ExecutiveConsequencePattern[];
  correlations: readonly StrategicOutcomeCorrelation[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
