/** D9:4:4 — Strategic opportunity emergence + enterprise positive drift types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterpriseEarlyWarningSnapshot } from "./earlyWarningTypes";
import type { EnterpriseForesightSnapshot } from "./foresightCognitionTypes";
import type { RiskConstellationSnapshot } from "./riskConstellationTypes";
import type { OrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplayTypes";
import type { StrategicAlignmentSnapshot } from "../temporal-cognition/temporalConvergenceTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { TemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionTypes";

export type OpportunityCategory =
  | "resilience_growth"
  | "governance_maturation"
  | "coordination_improvement"
  | "operational_stabilization"
  | "recovery_acceleration"
  | "adaptive_alignment"
  | "strategic_strengthening"
  | "unknown";

export type OpportunityStrength = "weak" | "moderate" | "strong" | "accelerating";

export type PositiveDriftState =
  | "emerging"
  | "strengthening"
  | "stabilizing"
  | "accelerating"
  | "institutionalizing";

export type PositiveDriftConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type StrategicOpportunitySignal = {
  opportunityId: string;
  category: OpportunityCategory;
  opportunityStrength: OpportunityStrength;
  positiveDriftState: PositiveDriftState;
  summary: string;
  opportunitySignals: readonly string[];
  confidence: number;
  confidenceLevel: PositiveDriftConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type OrganizationalGrowthPattern = {
  patternId: string;
  category: OpportunityCategory;
  patternLabel: string;
  patternSummary: string;
  linkedOpportunityIds: readonly string[];
  opportunityStrength: OpportunityStrength;
  generatedAt: number;
};

export type ResilienceOpportunityField = {
  fieldId: string;
  category: OpportunityCategory;
  fieldLabel: string;
  opportunitySummary: string;
  opportunitySignals: readonly string[];
  positiveDriftState: PositiveDriftState;
  generatedAt: number;
};

export type AdaptiveEvolutionSignal = {
  signalId: string;
  category: OpportunityCategory;
  evolutionLabel: string;
  evolutionHint: string;
  opportunityStrength: OpportunityStrength;
  confidence: number;
  generatedAt: number;
};

export type PositiveDriftAwarenessSummary = {
  dominantCategory: OpportunityCategory;
  dominantOpportunityStrength: OpportunityStrength;
  dominantPositiveDriftState: PositiveDriftState;
  opportunityHeadline: string;
  positiveMomentum: "low" | "moderate" | "strong" | "accelerating";
};

export type PositiveTrajectorySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  opportunityCount: number;
  awarenessSummary: PositiveDriftAwarenessSummary;
  recentStrategicOpportunitySignals: readonly StrategicOpportunitySignal[];
  growthPatterns: readonly OrganizationalGrowthPattern[];
  resilienceOpportunityFields: readonly ResilienceOpportunityField[];
  adaptiveEvolutionSignals: readonly AdaptiveEvolutionSignal[];
};

export type EnterprisePositiveDrift = PositiveTrajectorySnapshot;

export type ExecutivePositiveDriftInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseForesightSnapshot | null;
  constellationSnapshot?: RiskConstellationSnapshot | null;
  earlyWarningSnapshot?: EnterpriseEarlyWarningSnapshot | null;
  convergenceSnapshot?: StrategicAlignmentSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  driftSnapshot?: TemporalDriftSnapshot | null;
  replaySnapshot?: OrganizationalReplaySnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
};

export type ExecutivePositiveDriftResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: PositiveTrajectorySnapshot | null;
  newStrategicOpportunitySignals: number;
  storeSignature: string;
};

export type PositiveDriftStoreState = {
  strategicOpportunitySignals: readonly StrategicOpportunitySignal[];
  snapshots: readonly PositiveTrajectorySnapshot[];
  growthPatterns: readonly OrganizationalGrowthPattern[];
  resilienceOpportunityFields: readonly ResilienceOpportunityField[];
  adaptiveEvolutionSignals: readonly AdaptiveEvolutionSignal[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
