/** D9:4:10 — Unified executive strategic foresight runtime + anticipatory intelligence completion types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { ExecutiveAdvisoryForesightResult } from "./advisoryForesightTypes";
import type { ExecutiveConsensusForesightResult } from "./consensusForesightTypes";
import type { ExecutiveEarlyWarningResult } from "./earlyWarningTypes";
import type { ExecutiveStrategicForesightResult } from "./foresightCognitionTypes";
import type { ExecutiveInterventionTimingResult } from "./interventionTimingTypes";
import type { ExecutivePreparednessCognitionResult } from "./preparednessCognitionTypes";
import type { ExecutivePositiveDriftResult } from "./positiveDriftTypes";
import type { WeakSignalCorrelationResult } from "./riskConstellationTypes";
import type { ExecutiveStressSimulationResult } from "./stressSimulationTypes";

export type ForesightSubsystemId =
  | "foresight_foundation"
  | "weak_signal_correlation"
  | "risk_constellation"
  | "early_warning"
  | "positive_drift"
  | "stress_simulation"
  | "intervention_timing"
  | "preparedness_cognition"
  | "advisory_foresight"
  | "consensus_foresight";

export type ForesightRuntimeStatus =
  | "initializing"
  | "stable"
  | "degraded"
  | "unstable"
  | "recovering";

export type ForesightConfidenceLevel = "weak" | "moderate" | "strong" | "executive_grade";

export type StrategicForesightSummary = {
  dominantRisk: string;
  dominantOpportunity: string;
  earlyWarningState: string;
  preparednessState: string;
  recommendedFocus: string;
  consensusStrength: string;
};

export type ForesightSubsystemState = {
  subsystemId: ForesightSubsystemId;
  active: boolean;
  healthy: boolean;
  evaluated: boolean;
  signature: string;
};

export type ForesightRuntimeHealth = {
  level: ForesightConfidenceLevel;
  activeSubsystemCount: number;
  layerDepth: number;
  degradedSubsystemCount: number;
};

export type ExecutiveAnticipatoryIntelligence = {
  anticipatoryHeadline: string;
  riskAwarenessLine: string;
  opportunityAwarenessLine: string;
  advisoryIntegrity: string;
  interventionReadiness: string;
};

export type EnterpriseAnticipatorySnapshot = {
  snapshotId: string;
  organizationId: string;
  runtimeStatus: ForesightRuntimeStatus;
  foresightHealth: ForesightConfidenceLevel;
  summary: StrategicForesightSummary;
  activeSubsystems: readonly ForesightSubsystemId[];
  subsystemStates: readonly ForesightSubsystemState[];
  runtimeHealth: ForesightRuntimeHealth;
  executiveAnticipatoryIntelligence: ExecutiveAnticipatoryIntelligence;
  generatedAt: number;
  signature: string;
};

export type UnifiedForesightRuntimeState = {
  organizationId: string;
  latestSnapshot: EnterpriseAnticipatorySnapshot | null;
  foresightHistory: readonly EnterpriseAnticipatorySnapshot[];
  runtimeStatus: ForesightRuntimeStatus;
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRuntimeStatus: ForesightRuntimeStatus | null;
};

export type EnterpriseForesightPipelineResult = {
  organizationId: string;
  pipelineSignature: string;
  foresightFoundation: ExecutiveStrategicForesightResult;
  riskConstellation: WeakSignalCorrelationResult;
  earlyWarning: ExecutiveEarlyWarningResult;
  positiveDrift: ExecutivePositiveDriftResult;
  stressSimulation: ExecutiveStressSimulationResult;
  interventionTiming: ExecutiveInterventionTimingResult;
  preparednessCognition: ExecutivePreparednessCognitionResult;
  advisoryForesight: ExecutiveAdvisoryForesightResult;
  consensusForesight: ExecutiveConsensusForesightResult;
};

export type UnifiedExecutiveForesightRuntimeInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
};

export type UnifiedForesightRuntimeStoreState = {
  snapshots: readonly EnterpriseAnticipatorySnapshot[];
  foresightSummaries: readonly { summaryId: string; headline: string; generatedAt: number }[];
  runtimeStatus: ForesightRuntimeStatus;
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRuntimeStatus: ForesightRuntimeStatus | null;
};

export type UnifiedExecutiveForesightRuntimeResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  pipeline: EnterpriseForesightPipelineResult | null;
  snapshot: EnterpriseAnticipatorySnapshot | null;
  state: UnifiedForesightRuntimeState | null;
  storeSignature: string;
  runtimeTransition?: { from: ForesightRuntimeStatus; to: ForesightRuntimeStatus };
};
