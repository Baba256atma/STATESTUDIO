/** D9:2:3 — Organizational adaptation memory + strategic recovery intelligence types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { LearningConsolidationSnapshot } from "./institutionalCorrelationTypes";
import type {
  EnterpriseCognitionObservationInput,
  InstitutionalLearningSnapshot,
} from "./institutionalMemoryTypes";

export type AdaptationBehaviorType =
  | "operational_adjustment"
  | "coordination_recovery"
  | "governance_stabilization"
  | "fragility_reduction"
  | "resilience_growth"
  | "pressure_absorption"
  | "recovery_cycle"
  | "unknown";

export type RecoveryStabilityLevel =
  | "weak"
  | "unstable"
  | "adaptive"
  | "resilient"
  | "highly_resilient";

export type OrganizationalAdaptationRecord = {
  adaptationId: string;
  adaptationType: AdaptationBehaviorType;
  recoveryStability: RecoveryStabilityLevel;
  summary: string;
  observations: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
  linkedMemoryIds: readonly string[];
};

export type StrategicRecoveryPattern = {
  patternId: string;
  adaptationType: AdaptationBehaviorType;
  recoveryStability: RecoveryStabilityLevel;
  lesson: string;
  adaptationIds: readonly string[];
  linkedMemoryIds: readonly string[];
  firstObservedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type RecoveryIntelligenceSignal = {
  signalId: string;
  label: string;
  stability: RecoveryStabilityLevel;
  summary: string;
  generatedAt: number;
};

export type ResilienceEvolutionObservation = {
  observationId: string;
  trajectory: "strengthening" | "plateau" | "at_risk" | "recovering";
  summary: string;
  generatedAt: number;
};

export type AdaptationRecoverySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  adaptationCount: number;
  patternCount: number;
  recoverySummary: string;
  dominantAdaptationTypes: readonly AdaptationBehaviorType[];
  recoveryStability: RecoveryStabilityLevel;
  recentAdaptations: readonly OrganizationalAdaptationRecord[];
  recoveryPatterns: readonly StrategicRecoveryPattern[];
  resilienceObservations: readonly ResilienceEvolutionObservation[];
};

export type OrganizationalAdaptationMemoryInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  observations?: EnterpriseCognitionObservationInput | null;
  continuityPreserved?: boolean;
  fragilityElevated?: boolean;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  correlationSnapshot?: LearningConsolidationSnapshot | null;
  now?: number;
};

export type AdaptationRecoveryStoreState = {
  adaptations: readonly OrganizationalAdaptationRecord[];
  patterns: readonly StrategicRecoveryPattern[];
  signals: readonly RecoveryIntelligenceSignal[];
  resilienceObservations: readonly ResilienceEvolutionObservation[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
