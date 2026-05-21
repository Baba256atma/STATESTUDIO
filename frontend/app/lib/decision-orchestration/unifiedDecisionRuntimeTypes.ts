/** D9:5:10 — Unified executive decision orchestration runtime + enterprise strategic action intelligence completion types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { AdaptiveDecisionSequencingResult } from "./adaptiveSequencingTypes";
import type { StrategicActionDependencyResult } from "./actionDependencyTypes";
import type { ExecutiveDecisionConfidenceResult } from "./decisionConfidenceTypes";
import type { ExecutiveDecisionOrchestrationResult } from "./decisionOrchestrationTypes";
import type { InstitutionalAlignmentIntelligenceResult } from "./institutionalAlignmentTypes";
import type { StrategicInterventionProjectionResult } from "./interventionProjectionTypes";
import type { StrategicPriorityArbitrationResult } from "./priorityArbitrationTypes";
import type { ExecutiveScenarioCoordinationResult } from "./scenarioCoordinationTypes";
import type { StrategicStabilityOptimizationResult } from "./stabilityOptimizationTypes";

export type DecisionSubsystemId =
  | "decision_orchestration"
  | "action_dependency"
  | "priority_arbitration"
  | "scenario_coordination"
  | "adaptive_sequencing"
  | "confidence_arbitration"
  | "institutional_alignment"
  | "intervention_projection"
  | "stability_optimization";

export type DecisionRuntimeStatus =
  | "initializing"
  | "stable"
  | "degraded"
  | "unstable"
  | "recovering";

export type OrchestrationConfidenceLevel = "weak" | "moderate" | "strong" | "executive_grade";

export type StrategicOrchestrationSummary = {
  dominantPriority: string;
  orchestrationState: string;
  confidenceState: string;
  resiliencePathway: string;
  stabilizationFocus: string;
  institutionalAlignment: string;
};

export type DecisionSubsystemState = {
  subsystemId: DecisionSubsystemId;
  active: boolean;
  healthy: boolean;
  evaluated: boolean;
  isolated: boolean;
  signature: string;
};

export type DecisionRuntimeHealth = {
  level: OrchestrationConfidenceLevel;
  activeSubsystemCount: number;
  layerDepth: number;
  degradedSubsystemCount: number;
  isolatedSubsystemCount: number;
};

export type ExecutiveActionIntelligence = {
  actionReadinessHeadline: string;
  dependencyAwarenessLine: string;
  sequencingCoordinationLine: string;
  governanceAlignmentLine: string;
  resilienceOrchestrationLine: string;
};

export type EnterpriseStrategicActionSnapshot = {
  snapshotId: string;
  organizationId: string;
  runtimeStatus: DecisionRuntimeStatus;
  orchestrationHealth: OrchestrationConfidenceLevel;
  summary: StrategicOrchestrationSummary;
  activeSubsystems: readonly DecisionSubsystemId[];
  subsystemStates: readonly DecisionSubsystemState[];
  runtimeHealth: DecisionRuntimeHealth;
  executiveActionIntelligence: ExecutiveActionIntelligence;
  generatedAt: number;
  signature: string;
};

export type UnifiedDecisionRuntimeState = {
  organizationId: string;
  latestSnapshot: EnterpriseStrategicActionSnapshot | null;
  actionHistory: readonly EnterpriseStrategicActionSnapshot[];
  runtimeStatus: DecisionRuntimeStatus;
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRuntimeStatus: DecisionRuntimeStatus | null;
};

export type EnterpriseDecisionOrchestrationPipelineResult = {
  organizationId: string;
  pipelineSignature: string;
  decisionOrchestration: ExecutiveDecisionOrchestrationResult;
  actionDependency: StrategicActionDependencyResult;
  priorityArbitration: StrategicPriorityArbitrationResult;
  scenarioCoordination: ExecutiveScenarioCoordinationResult;
  adaptiveSequencing: AdaptiveDecisionSequencingResult;
  confidenceArbitration: ExecutiveDecisionConfidenceResult;
  institutionalAlignment: InstitutionalAlignmentIntelligenceResult;
  interventionProjection: StrategicInterventionProjectionResult;
  stabilityOptimization: StrategicStabilityOptimizationResult;
};

export type UnifiedExecutiveDecisionRuntimeInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
};

export type UnifiedExecutiveDecisionRuntimeResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  pipeline: EnterpriseDecisionOrchestrationPipelineResult | null;
  snapshot: EnterpriseStrategicActionSnapshot | null;
  state: UnifiedDecisionRuntimeState | null;
  storeSignature: string;
  runtimeTransition?: { from: DecisionRuntimeStatus; to: DecisionRuntimeStatus };
};

export type UnifiedDecisionRuntimeStoreState = {
  snapshots: readonly EnterpriseStrategicActionSnapshot[];
  orchestrationSummaries: readonly {
    summaryId: string;
    headline: string;
    generatedAt: number;
  }[];
  strategicActionHistory: readonly {
    actionId: string;
    headline: string;
    generatedAt: number;
  }[];
  subsystemHealthRecords: readonly {
    recordId: string;
    subsystemId: DecisionSubsystemId;
    healthy: boolean;
    generatedAt: number;
  }[];
  runtimeStatus: DecisionRuntimeStatus;
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRuntimeStatus: DecisionRuntimeStatus | null;
};
