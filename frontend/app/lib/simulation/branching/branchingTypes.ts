/**
 * D7:1:5 — Scenario timeline branching contracts.
 */

import type { OperationalTimeline } from "../timeline/timelineTypes.ts";

export interface ScenarioTimelineBranch {
  branchId: string;
  parentTimelineId: string;
  branchPointTick: number;
  label: string;
  createdAt: string;
  divergenceReason?: string;
  executiveScenarioKind?: ExecutiveScenarioKind;
  triggeringEventId?: string;
  childTimelineId: string;
  branchDepth: number;
}

export interface TimelineBranchPoint {
  tick: number;
  sourceSnapshotId: string;
  parentTimelineId: string;
  triggeringEventId?: string;
  createdBranches: string[];
}

export interface BranchDivergenceSummary {
  branchId: string;
  parentTimelineId: string;
  branchPointTick: number;
  changedObjectIds: string[];
  changedPropagationPaths: string[];
  operationalImpactScore?: number;
  notes?: string[];
}

/** Executive-readable scenario futures (no engine jargon). */
export type ExecutiveScenarioKind =
  | "aggressive_recovery"
  | "controlled_stabilization"
  | "delayed_escalation"
  | "high_risk_expansion"
  | "supply_recovery_success"
  | "partial_recovery_failure"
  | "global_crisis_escalation";

export interface ScenarioBranchForestState {
  rootTimelineId: string;
  timelinesById: Readonly<Record<string, OperationalTimeline>>;
  branches: readonly ScenarioTimelineBranch[];
  branchPoints: readonly TimelineBranchPoint[];
  divergences: readonly BranchDivergenceSummary[];
  fingerprint: string;
}

export interface ScenarioBranchComparisonRow {
  branchId: string;
  childTimelineId: string;
  label: string;
  currentTick: number;
  executiveLabel: string;
  operationalImpactScore: number;
  changedObjectCount: number;
  divergenceReason?: string;
}

export interface ScenarioBranchComparisonMatrix {
  parentTimelineId: string;
  branchPointTick: number;
  rows: readonly ScenarioBranchComparisonRow[];
  fingerprint: string;
}
