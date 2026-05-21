/** D9:4:5 — Enterprise strategic scenario pressure + anticipatory operational stress types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterpriseEarlyWarningSnapshot } from "./earlyWarningTypes";
import type { EnterpriseForesightSnapshot } from "./foresightCognitionTypes";
import type { PositiveTrajectorySnapshot } from "./positiveDriftTypes";
import type { RiskConstellationSnapshot } from "./riskConstellationTypes";
import type { OrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplayTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { TemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionTypes";

export type StressCategory =
  | "fragility_stress"
  | "escalation_pressure"
  | "governance_overload"
  | "coordination_strain"
  | "resilience_fatigue"
  | "operational_bottleneck"
  | "systemic_pressure"
  | "unknown";

export type StressSeverity = "low" | "moderate" | "elevated" | "severe" | "critical";

export type SimulationState = "stable" | "pressured" | "strained" | "destabilizing" | "recovering";

export type StressSimulationConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type OperationalStressScenario = {
  stressScenarioId: string;
  category: StressCategory;
  stressSeverity: StressSeverity;
  simulationState: SimulationState;
  summary: string;
  stressSignals: readonly string[];
  confidence: number;
  confidenceLevel: StressSimulationConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type StrategicPressureSimulation = {
  simulationId: string;
  category: StressCategory;
  simulationLabel: string;
  pressureSummary: string;
  linkedScenarioIds: readonly string[];
  stressSeverity: StressSeverity;
  simulationState: SimulationState;
  generatedAt: number;
};

export type EnterpriseStressPropagation = {
  propagationId: string;
  category: StressCategory;
  propagationLabel: string;
  propagationSummary: string;
  stressSignals: readonly string[];
  simulationState: SimulationState;
  generatedAt: number;
};

export type AnticipatoryStrainSignal = {
  strainId: string;
  category: StressCategory;
  strainLabel: string;
  strainHint: string;
  stressSeverity: StressSeverity;
  confidence: number;
  generatedAt: number;
};

export type OrganizationalPressureField = {
  fieldId: string;
  category: StressCategory;
  fieldLabel: string;
  pressureSummary: string;
  stressSignals: readonly string[];
  simulationState: SimulationState;
  generatedAt: number;
};

export type StressAwarenessSummary = {
  dominantCategory: StressCategory;
  dominantStressSeverity: StressSeverity;
  dominantSimulationState: SimulationState;
  stressHeadline: string;
  anticipatoryPressureRisk: "low" | "moderate" | "elevated" | "severe" | "critical";
};

export type StressSimulationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  scenarioCount: number;
  awarenessSummary: StressAwarenessSummary;
  recentOperationalStressScenarios: readonly OperationalStressScenario[];
  pressureSimulations: readonly StrategicPressureSimulation[];
  stressPropagations: readonly EnterpriseStressPropagation[];
  strainSignals: readonly AnticipatoryStrainSignal[];
  pressureFields: readonly OrganizationalPressureField[];
};

export type ExecutiveStressSimulationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseForesightSnapshot | null;
  constellationSnapshot?: RiskConstellationSnapshot | null;
  earlyWarningSnapshot?: EnterpriseEarlyWarningSnapshot | null;
  positiveDriftSnapshot?: PositiveTrajectorySnapshot | null;
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

export type ExecutiveStressSimulationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: StressSimulationSnapshot | null;
  newOperationalStressScenarios: number;
  storeSignature: string;
};

export type StressSimulationStoreState = {
  operationalStressScenarios: readonly OperationalStressScenario[];
  snapshots: readonly StressSimulationSnapshot[];
  pressureSimulations: readonly StrategicPressureSimulation[];
  stressPropagations: readonly EnterpriseStressPropagation[];
  strainSignals: readonly AnticipatoryStrainSignal[];
  pressureFields: readonly OrganizationalPressureField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
