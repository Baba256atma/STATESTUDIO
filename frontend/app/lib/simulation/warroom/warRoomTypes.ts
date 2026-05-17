/**
 * D7:1:8 — Executive war-room orchestration contracts.
 */

import type { ScenarioBranchForestState } from "../branching/branchingTypes.ts";
import type { ScenarioComparisonPanelContract, ScenarioComparisonSnapshot } from "../comparison/scenarioComparisonTypes.ts";
import type { DecisionSimulationOutcome } from "../decision/strategicDecisionTypes.ts";
import type { StrategicDecisionInput } from "../decision/strategicDecisionTypes.ts";
import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { WarRoomGuardResult } from "./warRoomGuards.ts";

export type WarRoomSessionStatus = "prepared" | "running" | "paused" | "completed";

export interface WarRoomSimulationSession {
  sessionId: string;
  title: string;
  createdAt: string;
  activeScenarioIds: readonly string[];
  status: WarRoomSessionStatus;
  baselineScenarioId: string;
}

export interface WarRoomOrchestrationState {
  activeTimelineIds: readonly string[];
  comparisonIds: readonly string[];
  interventionQueueIds: readonly string[];
  focusedScenarioId?: string;
  lastSyncTick?: number;
}

export type WarRoomScenarioRole = "baseline" | "alternative" | "intervention_projection";

export interface WarRoomScenarioSlot {
  scenarioId: string;
  timelineId: string;
  label: string;
  role: WarRoomScenarioRole;
  executiveLabel?: string;
}

export interface WarRoomInterventionStep {
  stepIndex: number;
  decision: StrategicDecisionInput;
  targetScenarioId: string;
}

export interface WarRoomSyncRecord {
  syncTick: number;
  synchronizedScenarioIds: readonly string[];
  createdAt: string;
}

export interface WarRoomInterventionHistoryEntry {
  stepIndex: number;
  decisionId: string;
  targetScenarioId: string;
  sourceTimelineId: string;
  projectedTimelineId: string;
  fingerprint: string;
}

export interface WarRoomComparisonHistoryEntry {
  comparisonId: string;
  compareAtTick: number;
  comparedScenarioIds: readonly string[];
  fingerprint: string;
}

export interface WarRoomSessionHistory {
  sessionId: string;
  entries: readonly WarRoomSessionHistoryEntry[];
  interventionSequence: readonly WarRoomInterventionHistoryEntry[];
  comparisonHistory: readonly WarRoomComparisonHistoryEntry[];
  syncHistory: readonly WarRoomSyncRecord[];
  fingerprint: string;
}

export type WarRoomSessionHistoryEventKind =
  | "session_created"
  | "orchestration_started"
  | "intervention_applied"
  | "timelines_synchronized"
  | "comparison_completed"
  | "orchestration_completed"
  | "focus_changed";

export interface WarRoomSessionHistoryEntry {
  eventId: string;
  kind: WarRoomSessionHistoryEventKind;
  tick?: number;
  scenarioId?: string;
  summary: string;
  createdAt: string;
}

export interface ExecutiveWarRoomSessionNarrative {
  headline: string;
  summary: string;
  scenarioSummaries: readonly string[];
  bullets: readonly string[];
}

export interface WarRoomOrchestrationSnapshot {
  session: WarRoomSimulationSession;
  state: WarRoomOrchestrationState;
  history: WarRoomSessionHistory;
  narrative: ExecutiveWarRoomSessionNarrative;
  scenarioSlots: readonly WarRoomScenarioSlot[];
  workingTimelinesByScenarioId: Readonly<Record<string, OperationalTimeline>>;
  interventionOutcomes: readonly DecisionSimulationOutcome[];
  comparisonSnapshots: readonly ScenarioComparisonSnapshot[];
  syncRecord?: WarRoomSyncRecord;
  fingerprint: string;
}

/** Future war-room UI contract (no rendering in D7:1:8). */
export interface WarRoomPanelOrchestrationContract {
  sessionId: string;
  title: string;
  status: WarRoomSessionStatus;
  focusedScenarioId?: string;
  scenarioRows: readonly WarRoomPanelScenarioRow[];
  interventionQueue: readonly WarRoomPanelInterventionRow[];
  comparisonPanel?: ScenarioComparisonPanelContract;
  narrativeHeadline: string;
  viewHint: "session_overview" | "intervention_queue" | "scenario_matrix" | "comparison_ranking";
}

export interface WarRoomPanelScenarioRow {
  scenarioId: string;
  label: string;
  timelineId: string;
  currentTick: number;
  role: WarRoomScenarioRole;
  riskLevel: "low" | "moderate" | "high" | "critical";
}

export interface WarRoomPanelInterventionRow {
  stepIndex: number;
  decisionId: string;
  decisionType: string;
  targetScenarioId: string;
  status: "queued" | "applied" | "rejected";
}

export interface CreateWarRoomSessionInput {
  sessionId: string;
  title: string;
  baselineScenarioId?: string;
  scenarioIds?: readonly string[];
}

export interface OrchestrateWarRoomSimulationInput {
  session: WarRoomSimulationSession;
  state: WarRoomOrchestrationState;
  history: WarRoomSessionHistory;
  forest: ScenarioBranchForestState;
  scenarioSlots: readonly WarRoomScenarioSlot[];
  /** Working timelines keyed by scenarioId (never mutates forest). */
  timelinesByScenarioId: Readonly<Record<string, OperationalTimeline>>;
  interventions?: readonly WarRoomInterventionStep[];
  syncAtTick?: number;
  runComparisons?: boolean;
  resourceAvailability?: Readonly<Record<string, number>>;
  priorOrchestrationFingerprints?: readonly string[];
}

export type WarRoomOrchestrationResult =
  | { ok: true; snapshot: WarRoomOrchestrationSnapshot; panelContract: WarRoomPanelOrchestrationContract }
  | { ok: false; guard: WarRoomGuardResult };
