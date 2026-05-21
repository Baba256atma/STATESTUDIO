/** D9:10:2 — Executive operational reliability intelligence + enterprise runtime trust stabilization types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { FinalStrategicIntelligenceSnapshot } from "../cognitive-singularity/unifiedCognitiveSingularityRuntimeTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type {
  EnterpriseRuntimeGovernanceSignal,
  MVPStrategicReadinessSnapshot,
} from "./enterpriseRuntimeFoundationTypes";

export type OperationalReliabilityCategory =
  | "runtime_stability"
  | "panel_stability"
  | "scene_stability"
  | "orchestration_reliability"
  | "cognition_consistency"
  | "explainability_reliability"
  | "executive_output_trust"
  | "unknown";

export type RuntimeTrustState =
  | "untrusted"
  | "monitored"
  | "conditionally_trusted"
  | "trusted"
  | "executive_grade";

export type OperationalReliabilityLevel =
  | "weak"
  | "moderate"
  | "reliable"
  | "stable"
  | "production_ready";

export type OperationalReliabilityObservation = {
  observationId: string;
  category: OperationalReliabilityCategory;
  reliabilityLevel: OperationalReliabilityLevel;
  headline: string;
  active: boolean;
  generatedAt: number;
};

export type RuntimeTrustRiskIndicator = {
  indicatorId: string;
  riskLabel: string;
  riskSummary: string;
  linkedCategories: readonly OperationalReliabilityCategory[];
  severity: "low" | "moderate" | "high";
  generatedAt: number;
};

export type RuntimeTrustSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly OperationalReliabilityCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type EnterpriseRuntimeTrustField = {
  level: OperationalReliabilityLevel;
  trustState: RuntimeTrustState;
  trustHeadline: string;
  stabilizationPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type OperationalReliabilitySummary = {
  foundationRuntimeState: string;
  singularityRuntimeState: string;
  orchestrationState: string;
  metaCognitionState: string;
  panelStabilityState: string;
  sceneStabilityState: string;
  primaryTrustRisk: string;
};

export type PanelRuntimeHealthSignal = {
  panelStable: boolean;
  panelFlashDetected: boolean;
  disappearingPanelSymptom: boolean;
  transitionLatencyElevated: boolean;
};

export type SceneStabilitySignal = {
  sceneReactionStable: boolean;
  sceneContractConsistent: boolean;
  reactionWithoutContractReason: boolean;
};

export type ExecutiveOperationalReliabilitySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  reliabilityId: string;
  trustState: RuntimeTrustState;
  reliabilityLevel: OperationalReliabilityLevel;
  summary: string;
  reliabilitySignals: readonly string[];
  trustRisks: readonly string[];
  confidence: number;
  activeReliabilityCategories: readonly OperationalReliabilityCategory[];
  reliabilityObservations: readonly OperationalReliabilityObservation[];
  runtimeTrustField: EnterpriseRuntimeTrustField;
  operationalReliabilitySummary: OperationalReliabilitySummary;
  runtimeTrustSignals: readonly RuntimeTrustSignal[];
  runtimeTrustRiskIndicators: readonly RuntimeTrustRiskIndicator[];
};

export type OperationalReliabilityHistoryEntry = {
  entryId: string;
  trustState: RuntimeTrustState;
  reliabilityLevel: OperationalReliabilityLevel;
  headline: string;
  generatedAt: number;
};

export type OperationalReliabilityState = {
  reliabilitySnapshots: readonly ExecutiveOperationalReliabilitySnapshot[];
  trustObservations: readonly OperationalReliabilityObservation[];
  trustHistory: readonly OperationalReliabilityHistoryEntry[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastTrustState: RuntimeTrustState | null;
};

export type ExecutiveOperationalReliabilityInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  mvpStrategicReadinessSnapshot?: MVPStrategicReadinessSnapshot | null;
  finalStrategicIntelligenceSnapshot?: FinalStrategicIntelligenceSnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  unifiedSelfReflectiveSnapshot?: EnterpriseSelfReflectiveSnapshot | null;
  runtimeGovernanceSignals?: readonly EnterpriseRuntimeGovernanceSignal[];
  panelRuntimeHealth?: PanelRuntimeHealthSignal | null;
  sceneStability?: SceneStabilitySignal | null;
  operationalTopologyStressed?: boolean;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  cognitionConverged?: boolean;
  runtimeStable?: boolean;
  sessionHydrated?: boolean;
  now?: number;
};

export type ExecutiveOperationalReliabilityResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: ExecutiveOperationalReliabilitySnapshot | null;
  activeReliabilityCategoryCount: number;
  storeSignature: string;
};
