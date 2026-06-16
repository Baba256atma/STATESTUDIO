/**
 * MRP:4E:1 / 4E:2 / 4E:3 / 4E:4 / 4E:5 — Scenario workspace runtime state contract.
 */

import type { GeneratedScenario, GeneratedScenarioId } from "./scenarioGenerationContract.ts";
import {
  DEFAULT_SCENARIO_COMPARISON_MATRIX,
  type ScenarioComparisonMatrix,
} from "./scenarioComparisonContract.ts";
import {
  DEFAULT_SCENARIO_PROJECTION_LAYER,
  type ScenarioProjectionLayer,
} from "./scenarioProjectionContract.ts";
import type { ScenarioCommitPackage } from "./scenarioHandoffContract.ts";
import {
  DEFAULT_SCENARIO_WORKSPACE_CONTEXT,
  type ScenarioWorkspaceContext,
} from "./scenarioWorkspaceContextContract.ts";

export const SCENARIO_STATE_TAG = "[SCENARIO_STATE]" as const;
export const SCENARIO_RUNTIME_TAG = "[SCENARIO_RUNTIME]" as const;

export const SCENARIO_WORKSPACE_STATE_VERSION = "4E.6.0";

export type ScenarioWorkspaceStatePhase = "loading" | "ready" | "empty";

export type ScenarioFieldSnapshot = Readonly<{
  headline: string;
  detail: string;
}>;

export type ScenarioWorkspaceState = Readonly<{
  phase: ScenarioWorkspaceStatePhase;
  workspaceContext: ScenarioWorkspaceContext;
  generatedScenarios: readonly GeneratedScenario[];
  generationReadOnly: true;
  comparisonMatrix: ScenarioComparisonMatrix;
  comparisonReadOnly: true;
  projectionLayer: ScenarioProjectionLayer;
  projectionReadOnly: true;
  activeScenarioId: GeneratedScenarioId | null;
  selectedScenarioId: GeneratedScenarioId | null;
  pendingCommitPackage: ScenarioCommitPackage | null;
  handoffReady: boolean;
  scenarioSummary: ScenarioFieldSnapshot;
  scenarioList: ScenarioFieldSnapshot;
  scenarioComparison: ScenarioFieldSnapshot;
  futureProjection: ScenarioFieldSnapshot;
  revision: number;
  signature: string;
}>;

export type ScenarioWorkspaceStatePublishResult = Readonly<{
  changed: boolean;
  state: ScenarioWorkspaceState;
  revision: number;
  guarded: boolean;
  guardReason?: string;
}>;

export const SCENARIO_LOADING_HEADLINE = "Loading…";
export const SCENARIO_LOADING_DETAIL = "Retrieving scenario workspace runtime state.";

export const SCENARIO_EMPTY_HEADLINE = "No data available";
export const SCENARIO_EMPTY_DETAIL = "Scenario workspace runtime returned an empty state.";

export const DEFAULT_SCENARIO_SUMMARY: ScenarioFieldSnapshot = Object.freeze({
  headline: "No scenario summary signal",
  detail: "Runtime connected — scenario summary intelligence not wired in MRP:4E:1.",
});

export const DEFAULT_SCENARIO_LIST: ScenarioFieldSnapshot = Object.freeze({
  headline: "No scenario list signal",
  detail: "Runtime connected — scenario list intelligence not wired in MRP:4E:1.",
});

export const DEFAULT_SCENARIO_COMPARISON: ScenarioFieldSnapshot = Object.freeze({
  headline: "No comparison area signal",
  detail: "Runtime connected — scenario comparison intelligence not wired in MRP:4E:1.",
});

export const DEFAULT_FUTURE_PROJECTION: ScenarioFieldSnapshot = Object.freeze({
  headline: "No future projection signal",
  detail: "Runtime connected — future projection intelligence not wired in MRP:4E:1.",
});

export const DEFAULT_SCENARIO_READY_STATE: ScenarioWorkspaceState = Object.freeze({
  phase: "ready",
  workspaceContext: DEFAULT_SCENARIO_WORKSPACE_CONTEXT,
  generatedScenarios: Object.freeze([]),
  generationReadOnly: true,
  comparisonMatrix: DEFAULT_SCENARIO_COMPARISON_MATRIX,
  comparisonReadOnly: true,
  projectionLayer: DEFAULT_SCENARIO_PROJECTION_LAYER,
  projectionReadOnly: true,
  activeScenarioId: null,
  selectedScenarioId: null,
  pendingCommitPackage: null,
  handoffReady: false,
  scenarioSummary: DEFAULT_SCENARIO_SUMMARY,
  scenarioList: DEFAULT_SCENARIO_LIST,
  scenarioComparison: DEFAULT_SCENARIO_COMPARISON,
  futureProjection: DEFAULT_FUTURE_PROJECTION,
  revision: 0,
  signature: "scenario:ready:defaults",
});
