/**
 * MRP:4E:4 — Sync future projection layer into workspace state (forecast-only).
 */

import {
  getScenarioWorkspaceState,
  publishScenarioWorkspaceState,
} from "./scenarioWorkspaceStateRuntime.ts";
import {
  MRP_SCENARIO_PROJECTION_TAG,
  SCENARIO_PROJECTION_CONTEXT,
  SCENARIO_PROJECTION_QUESTION,
  type ScenarioProjectionLayer,
  type ScenarioProjectionSurface,
} from "./scenarioProjectionContract.ts";
import {
  buildScenarioProjectionComparisonCells,
  buildScenarioProjectionSignature,
  deriveScenarioProjectionLayer,
} from "./scenarioProjectionResolver.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logProjectionOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(MRP_SCENARIO_PROJECTION_TAG, detail);
}

export function buildScenarioProjectionSurface(
  layer: ScenarioProjectionLayer
): ScenarioProjectionSurface {
  return Object.freeze({
    layer,
    question: SCENARIO_PROJECTION_QUESTION,
    dashboardContext: SCENARIO_PROJECTION_CONTEXT,
    readOnly: true,
  });
}

export function syncScenarioProjection(): ScenarioProjectionLayer {
  const state = getScenarioWorkspaceState();
  const layer = deriveScenarioProjectionLayer({
    scenarios: state.generatedScenarios,
    projectionHorizon: state.workspaceContext.projectionHorizon,
    comparisonCells: buildScenarioProjectionComparisonCells(state.comparisonMatrix.rows),
  });
  const signature = buildScenarioProjectionSignature(layer);

  const result = publishScenarioWorkspaceState({
    phase: state.phase === "loading" ? "ready" : state.phase,
    projectionLayer: layer,
    projectionReadOnly: true,
    futureProjection: Object.freeze({
      headline:
        layer.trends.length > 0
          ? "Future Projection Layer active"
          : "Future projection awaiting generated scenarios",
      detail:
        layer.trends.length > 0
          ? `${MRP_SCENARIO_PROJECTION_TAG} ${SCENARIO_PROJECTION_QUESTION} Forecast Expected, Best Case, and Worst Case trends across Operational, Financial, Risk, and Strategic impact — read-only.`
          : "Generate executive scenarios to activate the future projection layer.",
    }),
  });

  logProjectionOnce(signature, {
    action: "scenario_projection_synced",
    changed: result.changed,
    revision: result.revision,
    trendCount: layer.trends.length,
    sectionCount: layer.sections.length,
    horizon: layer.horizon,
    dashboardContext: SCENARIO_PROJECTION_CONTEXT,
  });

  return layer;
}

export function traceScenarioProjectionOnce(mountKey?: string | null): void {
  logProjectionOnce(`trace:${mountKey ?? "default"}`, {
    action: "scenario_projection_active",
    question: SCENARIO_PROJECTION_QUESTION,
    dashboardContext: SCENARIO_PROJECTION_CONTEXT,
    mountKey: mountKey ?? null,
  });
}

export function resetScenarioProjectionRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
