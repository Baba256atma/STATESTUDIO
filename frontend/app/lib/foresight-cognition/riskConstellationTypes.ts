/** D9:4:2 — Weak signal correlation + enterprise risk constellation intelligence types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterpriseForesightSnapshot } from "./foresightCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { StrategicAlignmentSnapshot } from "../temporal-cognition/temporalConvergenceTypes";
import type { TemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionTypes";

export type ConstellationCategory =
  | "fragility_cluster"
  | "escalation_network"
  | "governance_drift"
  | "resilience_erosion"
  | "coordination_breakdown"
  | "operational_pressure_field"
  | "systemic_instability"
  | "unknown";

export type CorrelationStrength = "weak" | "moderate" | "strong" | "systemic";

export type ConstellationState =
  | "emerging"
  | "accumulating"
  | "converging"
  | "intensifying"
  | "destabilizing";

export type ConstellationConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type EnterpriseRiskConstellation = {
  constellationId: string;
  category: ConstellationCategory;
  constellationState: ConstellationState;
  correlationStrength: CorrelationStrength;
  summary: string;
  correlatedSignals: readonly string[];
  linkedSignalIds: readonly string[];
  confidence: number;
  confidenceLevel: ConstellationConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type WeakSignalCorrelation = {
  correlationId: string;
  category: ConstellationCategory;
  correlationStrength: CorrelationStrength;
  correlationSummary: string;
  signalLabels: readonly string[];
  linkedConstellationIds: readonly string[];
  confidence: number;
  generatedAt: number;
};

export type DistributedInstabilityPattern = {
  patternId: string;
  category: ConstellationCategory;
  patternLabel: string;
  instabilitySummary: string;
  constellationIds: readonly string[];
  generatedAt: number;
};

export type StrategicRiskEmergence = {
  emergenceId: string;
  category: ConstellationCategory;
  riskSummary: string;
  emergenceSignals: readonly string[];
  correlationStrength: CorrelationStrength;
  generatedAt: number;
};

export type MultiSignalPressureCluster = {
  clusterId: string;
  category: ConstellationCategory;
  clusterLabel: string;
  pressureSummary: string;
  pressureSignals: readonly string[];
  constellationState: ConstellationState;
  generatedAt: number;
};

export type RiskConstellationAwarenessSummary = {
  dominantCategory: ConstellationCategory;
  dominantCorrelationStrength: CorrelationStrength;
  dominantConstellationState: ConstellationState;
  constellationHeadline: string;
  distributedRiskLevel: "low" | "moderate" | "elevated" | "systemic";
};

export type RiskConstellationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  constellationCount: number;
  awarenessSummary: RiskConstellationAwarenessSummary;
  recentConstellations: readonly EnterpriseRiskConstellation[];
  weakSignalCorrelations: readonly WeakSignalCorrelation[];
  instabilityPatterns: readonly DistributedInstabilityPattern[];
  strategicRiskEmergences: readonly StrategicRiskEmergence[];
  pressureClusters: readonly MultiSignalPressureCluster[];
};

export type WeakSignalCorrelationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseForesightSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  driftSnapshot?: TemporalDriftSnapshot | null;
  convergenceSnapshot?: StrategicAlignmentSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  pressureTopologyStressed?: boolean;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type WeakSignalCorrelationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: RiskConstellationSnapshot | null;
  newConstellations: number;
  storeSignature: string;
};

export type RiskConstellationStoreState = {
  constellations: readonly EnterpriseRiskConstellation[];
  snapshots: readonly RiskConstellationSnapshot[];
  correlations: readonly WeakSignalCorrelation[];
  instabilityPatterns: readonly DistributedInstabilityPattern[];
  strategicRiskEmergences: readonly StrategicRiskEmergence[];
  pressureClusters: readonly MultiSignalPressureCluster[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
