/** D9:6:10 — Unified executive meta-cognition runtime + enterprise self-reflective intelligence completion types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { ExecutiveCognitiveAdaptationSnapshot } from "./cognitiveAdaptationTypes";
import type { ExecutiveCognitiveDriftSnapshot } from "./cognitiveDriftTypes";
import type { ExecutiveCognitiveGovernanceSnapshot } from "./cognitiveGovernanceTypes";
import type { ExecutiveCognitiveResilienceSnapshot } from "./cognitiveResilienceTypes";
import type { ExecutiveCognitiveUncertaintySnapshot } from "./cognitiveUncertaintyTypes";
import type { StrategicExplanationSnapshot } from "./explainabilityTypes";
import type { MetaCognitionRuntimeSnapshot } from "./metaCognitionTypes";
import type { StrategicReasoningIntegritySnapshot } from "./reasoningIntegrityTypes";
import type { ExecutiveTrustCalibrationSnapshot } from "./trustCalibrationTypes";

export type MetaCognitionSubsystemId =
  | "meta_cognition"
  | "integrity_verification"
  | "cognitive_drift"
  | "uncertainty_awareness"
  | "explainability"
  | "trust_calibration"
  | "cognitive_resilience"
  | "adaptive_stabilization"
  | "cognitive_governance";

export type UnifiedRuntimeStatus =
  | "initializing"
  | "stable"
  | "adaptive"
  | "degraded"
  | "recovering";

export type GovernanceHealthLevel =
  | "weak"
  | "monitored"
  | "stable"
  | "governed"
  | "enterprise_grade";

export type MetaCognitionSubsystemState = {
  subsystemId: MetaCognitionSubsystemId;
  status: UnifiedRuntimeStatus;
  observationCount: number;
  healthLevel: GovernanceHealthLevel;
  headline: string;
  active: boolean;
  lastUpdatedAt: number;
};

export type ExecutiveSelfReflectiveSummary = {
  reasoningIntegrity: string;
  trustCalibration: string;
  explainabilityState: string;
  driftState: string;
  survivabilityState: string;
  governanceAlignment: string;
  uncertaintyPosture: string;
  adaptationState: string;
};

export type CognitiveGovernanceHealth = {
  level: GovernanceHealthLevel;
  regulationState: string;
  governanceHeadline: string;
  integrityPosture: string;
};

export type ExecutiveTrustRuntime = {
  trustRuntimeId: string;
  dominantTrustState: string;
  dependabilityPosture: string;
  trustHeadline: string;
  confidence: number;
  generatedAt: number;
};

export type EnterpriseSelfReflectiveIntelligence = {
  intelligenceId: string;
  runtimeHeadline: string;
  reflectionSummary: string;
  activeSubsystemCount: number;
  governanceCoherence: string;
  confidence: number;
  generatedAt: number;
};

export type EnterpriseSelfReflectiveSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  runtimeStatus: UnifiedRuntimeStatus;
  governanceHealth: GovernanceHealthLevel;
  summary: ExecutiveSelfReflectiveSummary;
  activeSubsystems: readonly MetaCognitionSubsystemId[];
  subsystemStates: readonly MetaCognitionSubsystemState[];
  cognitiveGovernanceHealth: CognitiveGovernanceHealth;
  executiveTrustRuntime: ExecutiveTrustRuntime;
  selfReflectiveIntelligence: EnterpriseSelfReflectiveIntelligence;
};

export type CognitionGovernanceHistoryEntry = {
  entryId: string;
  governanceHealth: GovernanceHealthLevel;
  runtimeStatus: UnifiedRuntimeStatus;
  headline: string;
  generatedAt: number;
};

export type SurvivabilitySummaryRecord = {
  recordId: string;
  survivabilityState: string;
  robustnessPosture: string;
  summary: string;
  generatedAt: number;
};

export type SelfRegulationPatternRecord = {
  patternId: string;
  regulationState: string;
  patternLabel: string;
  generatedAt: number;
};

export type UnifiedExecutiveMetaCognitionInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  metaCognitionSnapshot?: MetaCognitionRuntimeSnapshot | null;
  reasoningIntegritySnapshot?: StrategicReasoningIntegritySnapshot | null;
  cognitiveDriftSnapshot?: ExecutiveCognitiveDriftSnapshot | null;
  cognitiveUncertaintySnapshot?: ExecutiveCognitiveUncertaintySnapshot | null;
  explainabilitySnapshot?: StrategicExplanationSnapshot | null;
  trustCalibrationSnapshot?: ExecutiveTrustCalibrationSnapshot | null;
  cognitiveResilienceSnapshot?: ExecutiveCognitiveResilienceSnapshot | null;
  cognitiveAdaptationSnapshot?: ExecutiveCognitiveAdaptationSnapshot | null;
  cognitiveGovernanceSnapshot?: ExecutiveCognitiveGovernanceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type UnifiedExecutiveMetaCognitionResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseSelfReflectiveSnapshot | null;
  activeSubsystemCount: number;
  storeSignature: string;
};

export type UnifiedMetaCognitionRuntimeState = {
  selfReflectiveSnapshots: readonly EnterpriseSelfReflectiveSnapshot[];
  subsystemStates: readonly MetaCognitionSubsystemState[];
  governanceHistory: readonly CognitionGovernanceHistoryEntry[];
  trustRuntimeObservations: readonly ExecutiveTrustRuntime[];
  survivabilitySummaries: readonly SurvivabilitySummaryRecord[];
  selfRegulationPatterns: readonly SelfRegulationPatternRecord[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRuntimeStatus: UnifiedRuntimeStatus | null;
};
