/** D9:4:6 — Executive strategic intervention window + enterprise timing intelligence types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterpriseEarlyWarningSnapshot } from "./earlyWarningTypes";
import type { EnterpriseForesightSnapshot } from "./foresightCognitionTypes";
import type { PositiveTrajectorySnapshot } from "./positiveDriftTypes";
import type { RiskConstellationSnapshot } from "./riskConstellationTypes";
import type { StressSimulationSnapshot } from "./stressSimulationTypes";
import type { OrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplayTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { TemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionTypes";

export type TimingCategory =
  | "escalation_prevention"
  | "resilience_reinforcement"
  | "governance_stabilization"
  | "coordination_alignment"
  | "pressure_reduction"
  | "recovery_acceleration"
  | "strategic_realignment"
  | "unknown";

export type TimingSensitivity = "low" | "moderate" | "high" | "critical";

export type WindowState = "emerging" | "active" | "narrowing" | "closing" | "missed";

export type InterventionTimingConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type StrategicInterventionWindow = {
  interventionWindowId: string;
  category: TimingCategory;
  timingSensitivity: TimingSensitivity;
  windowState: WindowState;
  summary: string;
  timingSignals: readonly string[];
  confidence: number;
  confidenceLevel: InterventionTimingConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseTimingSignal = {
  signalId: string;
  category: TimingCategory;
  signalLabel: string;
  signalSummary: string;
  timingSensitivity: TimingSensitivity;
  windowState: WindowState;
  confidence: number;
  generatedAt: number;
};

export type OperationalTimingSensitivity = {
  sensitivityId: string;
  category: TimingCategory;
  sensitivityLabel: string;
  sensitivityHint: string;
  timingSensitivity: TimingSensitivity;
  windowState: WindowState;
  generatedAt: number;
};

export type StabilizationOpportunityField = {
  fieldId: string;
  category: TimingCategory;
  fieldLabel: string;
  opportunitySummary: string;
  timingSignals: readonly string[];
  windowState: WindowState;
  generatedAt: number;
};

export type TimingPressureIndicator = {
  indicatorId: string;
  category: TimingCategory;
  indicatorLabel: string;
  pressureHint: string;
  timingSensitivity: TimingSensitivity;
  confidence: number;
  generatedAt: number;
};

export type InterventionTimingAwarenessSummary = {
  dominantCategory: TimingCategory;
  dominantTimingSensitivity: TimingSensitivity;
  dominantWindowState: WindowState;
  timingHeadline: string;
  interventionUrgency: "low" | "moderate" | "high" | "critical";
};

export type InterventionWindowSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  windowCount: number;
  awarenessSummary: InterventionTimingAwarenessSummary;
  recentStrategicInterventionWindows: readonly StrategicInterventionWindow[];
  timingSignals: readonly EnterpriseTimingSignal[];
  timingSensitivities: readonly OperationalTimingSensitivity[];
  stabilizationOpportunityFields: readonly StabilizationOpportunityField[];
  timingPressureIndicators: readonly TimingPressureIndicator[];
};

export type ExecutiveInterventionTimingInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseForesightSnapshot | null;
  constellationSnapshot?: RiskConstellationSnapshot | null;
  earlyWarningSnapshot?: EnterpriseEarlyWarningSnapshot | null;
  positiveDriftSnapshot?: PositiveTrajectorySnapshot | null;
  stressSnapshot?: StressSimulationSnapshot | null;
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

export type ExecutiveInterventionTimingResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: InterventionWindowSnapshot | null;
  newStrategicInterventionWindows: number;
  storeSignature: string;
};

export type InterventionTimingStoreState = {
  strategicInterventionWindows: readonly StrategicInterventionWindow[];
  snapshots: readonly InterventionWindowSnapshot[];
  timingSignals: readonly EnterpriseTimingSignal[];
  timingSensitivities: readonly OperationalTimingSensitivity[];
  stabilizationOpportunityFields: readonly StabilizationOpportunityField[];
  timingPressureIndicators: readonly TimingPressureIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
