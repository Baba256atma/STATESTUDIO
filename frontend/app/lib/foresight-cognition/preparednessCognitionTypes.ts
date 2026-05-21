/** D9:4:7 — Executive strategic readiness + enterprise preparedness cognition types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterpriseEarlyWarningSnapshot } from "./earlyWarningTypes";
import type { InterventionWindowSnapshot } from "./interventionTimingTypes";
import type { PositiveTrajectorySnapshot } from "./positiveDriftTypes";
import type { StressSimulationSnapshot } from "./stressSimulationTypes";
import type { StrategicAlignmentSnapshot } from "../temporal-cognition/temporalConvergenceTypes";
import type { OrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplayTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { TemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionTypes";

export type PreparednessCategory =
  | "escalation_response"
  | "resilience_capacity"
  | "governance_readiness"
  | "coordination_preparedness"
  | "recovery_capability"
  | "operational_adaptability"
  | "strategic_alignment"
  | "unknown";

export type PreparednessLevel = "weak" | "limited" | "moderate" | "strong" | "resilient";

export type ReadinessState = "unprepared" | "vulnerable" | "stabilizing" | "prepared" | "adaptive";

export type PreparednessConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type StrategicReadinessSignal = {
  preparednessId: string;
  category: PreparednessCategory;
  preparednessLevel: PreparednessLevel;
  readinessState: ReadinessState;
  summary: string;
  preparednessSignals: readonly string[];
  confidence: number;
  confidenceLevel: PreparednessConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type OperationalResilienceCapability = {
  capabilityId: string;
  category: PreparednessCategory;
  capabilityLabel: string;
  capabilitySummary: string;
  preparednessLevel: PreparednessLevel;
  readinessState: ReadinessState;
  confidence: number;
  generatedAt: number;
};

export type PreparednessGapIndicator = {
  gapId: string;
  category: PreparednessCategory;
  gapLabel: string;
  gapSummary: string;
  preparednessLevel: PreparednessLevel;
  readinessState: ReadinessState;
  generatedAt: number;
};

export type OrganizationalResponseReadiness = {
  readinessId: string;
  category: PreparednessCategory;
  readinessLabel: string;
  responseSummary: string;
  preparednessSignals: readonly string[];
  preparednessLevel: PreparednessLevel;
  generatedAt: number;
};

export type ReadinessAwarenessSummary = {
  dominantCategory: PreparednessCategory;
  dominantPreparednessLevel: PreparednessLevel;
  dominantReadinessState: ReadinessState;
  readinessHeadline: string;
  enterprisePreparednessPosture: "weak" | "limited" | "moderate" | "strong" | "resilient";
};

export type EnterprisePreparednessSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  signalCount: number;
  awarenessSummary: ReadinessAwarenessSummary;
  recentStrategicReadinessSignals: readonly StrategicReadinessSignal[];
  resilienceCapabilities: readonly OperationalResilienceCapability[];
  preparednessGapIndicators: readonly PreparednessGapIndicator[];
  responseReadiness: readonly OrganizationalResponseReadiness[];
};

export type ExecutivePreparednessCognitionInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  interventionSnapshot?: InterventionWindowSnapshot | null;
  stressSnapshot?: StressSimulationSnapshot | null;
  earlyWarningSnapshot?: EnterpriseEarlyWarningSnapshot | null;
  positiveDriftSnapshot?: PositiveTrajectorySnapshot | null;
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

export type ExecutivePreparednessCognitionResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterprisePreparednessSnapshot | null;
  newStrategicReadinessSignals: number;
  storeSignature: string;
};

export type PreparednessCognitionStoreState = {
  strategicReadinessSignals: readonly StrategicReadinessSignal[];
  snapshots: readonly EnterprisePreparednessSnapshot[];
  resilienceCapabilities: readonly OperationalResilienceCapability[];
  preparednessGapIndicators: readonly PreparednessGapIndicator[];
  responseReadiness: readonly OrganizationalResponseReadiness[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
