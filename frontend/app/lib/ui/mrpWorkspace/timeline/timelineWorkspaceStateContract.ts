/**
 * MRP:4D:1 / 4D:2 / 4D:3 / 4D:4 / 4D:5 — Timeline workspace runtime state contract.
 */

import { DEFAULT_TIMELINE_WORKSPACE_METRICS } from "./timelineWorkspaceMetricsContract.ts";
import {
  DEFAULT_TIMELINE_OBJECT_CONTEXT,
  type TimelineObjectContext,
} from "./timelineObjectContextContract.ts";
import {
  DEFAULT_TIMELINE_SCENE_COVERAGE,
  type TimelineSceneCoverage,
} from "./timelineSceneAwarenessContract.ts";
import type {
  TimelineDecisionHistoryRow,
  TimelineRecentEventRow,
} from "./timelineVisualSurfaceContract.ts";

export const TIMELINE_STATE_TAG = "[TIMELINE_STATE]" as const;
export const TIMELINE_RUNTIME_TAG = "[TIMELINE_RUNTIME]" as const;

export const TIMELINE_WORKSPACE_STATE_VERSION = "4D.5.0";

export type TimelineWorkspaceStatePhase = "loading" | "ready" | "empty";

export type TimelineFieldSnapshot = Readonly<{
  headline: string;
  detail: string;
}>;

export type TimelineWorkspaceState = Readonly<{
  phase: TimelineWorkspaceStatePhase;
  selectedObjectId: string | null;
  totalEvents: number;
  recentEventCount: number;
  decisionEventCount: number;
  riskEventCount: number;
  lastEventAt: number;
  objectContext: TimelineObjectContext;
  recentEventRows: readonly TimelineRecentEventRow[];
  decisionHistoryRows: readonly TimelineDecisionHistoryRow[];
  sceneCoverage: TimelineSceneCoverage;
  sceneAwarenessReadOnly: true;
  timelineSummary: TimelineFieldSnapshot;
  recentEvents: TimelineFieldSnapshot;
  importantChanges: TimelineFieldSnapshot;
  decisionHistory: TimelineFieldSnapshot;
  riskEvolution: TimelineFieldSnapshot;
  revision: number;
  signature: string;
}>;

export type TimelineWorkspaceStatePublishResult = Readonly<{
  changed: boolean;
  state: TimelineWorkspaceState;
  revision: number;
  guarded: boolean;
  guardReason?: string;
}>;

export const TIMELINE_LOADING_HEADLINE = "Loading…";
export const TIMELINE_LOADING_DETAIL = "Retrieving timeline workspace runtime state.";

export const TIMELINE_EMPTY_HEADLINE = "No data available";
export const TIMELINE_EMPTY_DETAIL = "Timeline workspace runtime returned an empty state.";

export const DEFAULT_TIMELINE_SUMMARY: TimelineFieldSnapshot = Object.freeze({
  headline: "No timeline summary signal",
  detail: "Runtime connected — timeline summary intelligence not wired in MRP:4D:1.",
});

export const DEFAULT_RECENT_EVENTS: TimelineFieldSnapshot = Object.freeze({
  headline: "No recent events signal",
  detail: "Runtime connected — recent events intelligence not wired in MRP:4D:1.",
});

export const DEFAULT_IMPORTANT_CHANGES: TimelineFieldSnapshot = Object.freeze({
  headline: "No important changes signal",
  detail: "Runtime connected — important changes intelligence not wired in MRP:4D:1.",
});

export const DEFAULT_DECISION_HISTORY: TimelineFieldSnapshot = Object.freeze({
  headline: "No decision history signal",
  detail: "Runtime connected — decision history intelligence not wired in MRP:4D:1.",
});

export const DEFAULT_RISK_EVOLUTION: TimelineFieldSnapshot = Object.freeze({
  headline: "No risk evolution signal",
  detail: "Runtime connected — risk evolution intelligence not wired in MRP:4D:1.",
});

export const DEFAULT_TIMELINE_READY_STATE: TimelineWorkspaceState = Object.freeze({
  phase: "ready",
  ...DEFAULT_TIMELINE_WORKSPACE_METRICS,
  objectContext: DEFAULT_TIMELINE_OBJECT_CONTEXT,
  recentEventRows: Object.freeze([]),
  decisionHistoryRows: Object.freeze([]),
  sceneCoverage: DEFAULT_TIMELINE_SCENE_COVERAGE,
  sceneAwarenessReadOnly: true,
  timelineSummary: DEFAULT_TIMELINE_SUMMARY,
  recentEvents: DEFAULT_RECENT_EVENTS,
  importantChanges: DEFAULT_IMPORTANT_CHANGES,
  decisionHistory: DEFAULT_DECISION_HISTORY,
  riskEvolution: DEFAULT_RISK_EVOLUTION,
  revision: 0,
  signature: "timeline:ready:defaults",
});
