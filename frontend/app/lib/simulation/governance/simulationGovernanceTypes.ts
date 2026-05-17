/**
 * D7:1:10 — Global simulation governance + anti-chaos contracts.
 */

import type { ScenarioBranchForestState } from "../branching/branchingTypes.ts";
import type { ReplayOrchestrationSnapshot } from "../replay/replayTypes.ts";
import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { WarRoomOrchestrationSnapshot } from "../warroom/warRoomTypes.ts";

export type SimulationGovernanceStatus =
  | "stable"
  | "monitoring"
  | "degraded"
  | "protected"
  | "halted";

export interface SimulationGovernanceState {
  governanceStatus: SimulationGovernanceStatus;
  activeWarnings: readonly string[];
  integrityScore: number;
  reasoning: readonly string[];
}

export interface SimulationStabilityMetrics {
  activeTimelineCount: number;
  activeBranchCount: number;
  activeReplaySessionCount: number;
  activeWarRoomSessionCount: number;
  propagationDepthAverage: number;
  replayIntegrityScore: number;
  orchestrationPressure: number;
  comparisonLoad: number;
}

export type GovernanceFindingCode =
  | "branch_explosion_risk"
  | "timeline_corruption"
  | "replay_inconsistency"
  | "orchestration_overload"
  | "propagation_instability"
  | "causality_order_violation"
  | "branch_lineage_cycle"
  | "snapshot_fingerprint_drift"
  | "sync_pressure"
  | "universe_complexity_high"
  | "governance_nominal";

export type GovernanceFindingSeverity = "info" | "warning" | "critical";

export interface GovernanceFinding {
  code: GovernanceFindingCode;
  severity: GovernanceFindingSeverity;
  message: string;
  affectedTimelineId?: string;
  affectedReplayId?: string;
}

export type GovernanceResponseAction =
  | "allow"
  | "advise"
  | "protect"
  | "reject_branch"
  | "block_orchestration"
  | "halt_replay"
  | "isolate_timeline";

export interface GovernanceResponse {
  action: GovernanceResponseAction;
  reason: string;
  findingCode: GovernanceFindingCode;
}

export interface ReplayIntegrityReport {
  verified: boolean;
  checkedReplayCount: number;
  failures: readonly ReplayIntegrityFailure[];
  score: number;
}

export interface ReplayIntegrityFailure {
  replayId: string;
  code: string;
  message: string;
}

export interface ExecutiveGovernanceNarrative {
  headline: string;
  summary: string;
  bullets: readonly string[];
}

/** Future enterprise oversight contract (no SaaS in D7:1:10). */
export interface EnterpriseSimulationGovernanceContract {
  governanceId: string;
  status: SimulationGovernanceStatus;
  integrityScore: number;
  stabilityMetrics: SimulationStabilityMetrics;
  activeResponses: readonly GovernanceResponseAction[];
  auditSummary: string;
  replayIntegrityVerified: boolean;
  viewHint: "stability_dashboard" | "integrity_audit" | "protected_mode" | "halt_review";
}

export interface SimulationGovernanceReport {
  state: SimulationGovernanceState;
  metrics: SimulationStabilityMetrics;
  findings: readonly GovernanceFinding[];
  responses: readonly GovernanceResponse[];
  narrative: ExecutiveGovernanceNarrative;
  replayIntegrity: ReplayIntegrityReport;
  fingerprint: string;
  enterpriseContract: EnterpriseSimulationGovernanceContract;
}

export interface SimulationUniverseInput {
  activeTimelines: readonly OperationalTimeline[];
  branchForests?: readonly ScenarioBranchForestState[];
  replaySnapshots?: readonly ReplayOrchestrationSnapshot[];
  warRoomSnapshots?: readonly WarRoomOrchestrationSnapshot[];
  propagationDepthSamples?: readonly number[];
  comparisonCount?: number;
}

export interface GovernSimulationUniverseInput extends SimulationUniverseInput {
  governanceId?: string;
  priorGovernanceFingerprints?: readonly string[];
}

export interface SimulationGovernanceVerdict {
  allowed: boolean;
  report: SimulationGovernanceReport;
}
