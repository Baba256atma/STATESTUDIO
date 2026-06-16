/**
 * MRP:4E:3 — Sync scenario comparison matrix into workspace state (read-only).
 */

import {
  getScenarioWorkspaceState,
  publishScenarioWorkspaceState,
} from "./scenarioWorkspaceStateRuntime.ts";
import {
  MRP_SCENARIO_COMPARISON_TAG,
  SCENARIO_COMPARISON_CONTEXT,
  type ScenarioComparisonMatrix,
  type ScenarioComparisonSurface,
} from "./scenarioComparisonContract.ts";
import {
  buildScenarioComparisonSignature,
  deriveScenarioComparisonMatrix,
} from "./scenarioComparisonResolver.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logComparisonOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(MRP_SCENARIO_COMPARISON_TAG, detail);
}

export function buildScenarioComparisonSurface(
  matrix: ScenarioComparisonMatrix
): ScenarioComparisonSurface {
  return Object.freeze({
    matrix,
    dashboardContext: SCENARIO_COMPARISON_CONTEXT,
    readOnly: true,
  });
}

export function syncScenarioComparison(): ScenarioComparisonMatrix {
  const state = getScenarioWorkspaceState();
  const matrix = deriveScenarioComparisonMatrix({
    scenarios: state.generatedScenarios,
  });
  const signature = buildScenarioComparisonSignature(matrix);

  const result = publishScenarioWorkspaceState({
    phase: state.phase === "loading" ? "ready" : state.phase,
    comparisonMatrix: matrix,
    comparisonReadOnly: true,
    scenarioComparison: Object.freeze({
      headline:
        matrix.columns.length > 0
          ? "Scenario Comparison Matrix active"
          : "Scenario comparison awaiting generated futures",
      detail:
        matrix.columns.length > 0
          ? `${MRP_SCENARIO_COMPARISON_TAG} Compare Scenario A, B, and C across Risk, Cost, Timeline Impact, Operational Impact, and Strategic Impact — read-only.`
          : "Generate executive scenarios to activate the comparison matrix.",
    }),
  });

  logComparisonOnce(signature, {
    action: "scenario_comparison_synced",
    changed: result.changed,
    revision: result.revision,
    columnCount: matrix.columns.length,
    rowCount: matrix.rows.length,
    dashboardContext: SCENARIO_COMPARISON_CONTEXT,
  });

  return matrix;
}

export function traceScenarioComparisonOnce(mountKey?: string | null): void {
  logComparisonOnce(`trace:${mountKey ?? "default"}`, {
    action: "scenario_comparison_active",
    dashboardContext: SCENARIO_COMPARISON_CONTEXT,
    mountKey: mountKey ?? null,
  });
}

export function resetScenarioComparisonRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
