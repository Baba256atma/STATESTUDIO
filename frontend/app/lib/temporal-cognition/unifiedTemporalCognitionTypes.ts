/** D9:3:10 — Unified enterprise temporal cognition completion + time intelligence runtime types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { EnterpriseTemporalCognitionResult } from "./temporalCognitionTypes";
import type { OperationalCausalDependencyResult } from "./causalDependencyTypes";
import type { OperationalReplayCognitionResult } from "./operationalReplayTypes";
import type { TemporalDriftProjectionResult } from "./temporalDriftProjectionTypes";
import type { MultiTimelineDivergenceResult } from "./multiTimelineTypes";
import type { TemporalConvergenceResult } from "./temporalConvergenceTypes";
import type { StrategicTemporalCompressionResult } from "./temporalCompressionTypes";
import type { TemporalMemorySyncResult } from "./temporalMemorySyncTypes";
import type { StrategicTimeFieldResult } from "./temporalFieldTypes";

export type TemporalSubsystemId =
  | "timeline_awareness"
  | "causal_dependencies"
  | "operational_replay"
  | "drift_projection"
  | "divergence_awareness"
  | "convergence_intelligence"
  | "temporal_compression"
  | "cross_period_synchronization"
  | "long_horizon_awareness";

export type TemporalRuntimeStatus =
  | "initializing"
  | "stable"
  | "degraded"
  | "unstable"
  | "recovering";

export type TemporalHealthLevel = "weak" | "moderate" | "strong" | "verified";

export type OrganizationalEvolutionState =
  | "emerging"
  | "evolving"
  | "stabilizing"
  | "institutionalizing"
  | "fragmenting";

export type UnifiedTemporalAwarenessSummary = {
  dominantTrajectory: string;
  resilienceDirection: string;
  organizationalEvolutionState: OrganizationalEvolutionState;
  temporalContinuity: string;
  longHorizonSignal: string;
};

export type TemporalCognitionSubsystemState = {
  subsystemId: TemporalSubsystemId;
  active: boolean;
  healthy: boolean;
  evaluated: boolean;
  signature: string;
};

export type TemporalRuntimeHealth = {
  level: TemporalHealthLevel;
  activeSubsystemCount: number;
  layerDepth: number;
  degradedSubsystemCount: number;
};

export type EnterpriseTimeIntelligenceSnapshot = {
  snapshotId: string;
  organizationId: string;
  runtimeStatus: TemporalRuntimeStatus;
  temporalHealth: TemporalHealthLevel;
  summary: UnifiedTemporalAwarenessSummary;
  activeSubsystems: readonly TemporalSubsystemId[];
  subsystemStates: readonly TemporalCognitionSubsystemState[];
  runtimeHealth: TemporalRuntimeHealth;
  generatedAt: number;
  signature: string;
};

export type UnifiedTemporalCognitionState = {
  organizationId: string;
  latestSnapshot: EnterpriseTimeIntelligenceSnapshot | null;
  cognitionHistory: readonly EnterpriseTimeIntelligenceSnapshot[];
  runtimeStatus: TemporalRuntimeStatus;
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRuntimeStatus: TemporalRuntimeStatus | null;
};

export type UnifiedTemporalCognitionInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type UnifiedTemporalCognitionStoreState = {
  snapshots: readonly EnterpriseTimeIntelligenceSnapshot[];
  evolutionSummaries: readonly { summaryId: string; headline: string; generatedAt: number }[];
  runtimeStatus: TemporalRuntimeStatus;
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRuntimeStatus: TemporalRuntimeStatus | null;
};

export type UnifiedTemporalCognitionResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  pipeline: EnterpriseTemporalCognitionPipelineResult | null;
  snapshot: EnterpriseTimeIntelligenceSnapshot | null;
  state: UnifiedTemporalCognitionState | null;
  storeSignature: string;
  runtimeTransition?: { from: TemporalRuntimeStatus; to: TemporalRuntimeStatus };
};

export type TemporalLayerResults = {
  timelineAwareness: EnterpriseTemporalCognitionResult;
  causalDependencies: OperationalCausalDependencyResult;
  operationalReplay: OperationalReplayCognitionResult;
  driftProjection: TemporalDriftProjectionResult;
  divergenceAwareness: MultiTimelineDivergenceResult;
  convergenceIntelligence: TemporalConvergenceResult;
  temporalCompression: StrategicTemporalCompressionResult;
  crossPeriodSynchronization: TemporalMemorySyncResult;
  longHorizonAwareness: StrategicTimeFieldResult;
};

export type EnterpriseTemporalCognitionPipelineResult = TemporalLayerResults & {
  organizationId: string;
  pipelineSignature: string;
};
