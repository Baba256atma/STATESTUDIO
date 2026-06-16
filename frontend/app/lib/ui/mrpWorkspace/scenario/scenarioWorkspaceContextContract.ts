/**
 * MRP:4E:1 — Scenario workspace context contract.
 *
 * Read-only structural integration — explores futures only under Rule #11.
 */

import { DEFAULT_MRP_SELECTED_OBJECT } from "../../mrpContext/mrpContextStoreContract.ts";

export const SCENARIO_WORKSPACE_CONTEXT_TAG = "[MRP_SCENARIO_CONTEXT]" as const;

export const SCENARIO_WORKSPACE_CONTEXT_VERSION = "4E.1.0";

export const SCENARIO_NO_OBJECT_SELECTED_LABEL = "No object selected." as const;

export type ScenarioWorkspaceContext = Readonly<{
  selectedObjectId: string | null;
  selectedObject: string;
  explorationScope: string;
  comparisonMode: string;
  projectionHorizon: string;
  hasSelection: boolean;
}>;

export type ScenarioWorkspaceContextInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
}>;

export const DEFAULT_SCENARIO_WORKSPACE_CONTEXT: ScenarioWorkspaceContext = Object.freeze({
  selectedObjectId: null,
  selectedObject: SCENARIO_NO_OBJECT_SELECTED_LABEL,
  explorationScope: "Awaiting selection",
  comparisonMode: "None",
  projectionHorizon: "None",
  hasSelection: false,
});

export const SCENARIO_WORKSPACE_CONTEXT_FIELD_LABELS = Object.freeze({
  selectedObject: "Selected Object",
  explorationScope: "Exploration Scope",
  comparisonMode: "Comparison Mode",
  projectionHorizon: "Projection Horizon",
});

/** Structural fixtures for known demo object labels — not business intelligence. */
export const SCENARIO_KNOWN_OBJECT_FIXTURES: Readonly<
  Record<
    string,
    Readonly<{
      explorationScope: string;
      comparisonMode: string;
      projectionHorizon: string;
    }>
  >
> = Object.freeze({
  "factory a": Object.freeze({
    explorationScope: "Operational futures",
    comparisonMode: "Baseline vs stress",
    projectionHorizon: "30 days",
  }),
  "supplier network": Object.freeze({
    explorationScope: "Supply continuity",
    comparisonMode: "Dual-path review",
    projectionHorizon: "60 days",
  }),
  "production line": Object.freeze({
    explorationScope: "Capacity futures",
    comparisonMode: "Load scenarios",
    projectionHorizon: "14 days",
  }),
  "project alpha": Object.freeze({
    explorationScope: "Delivery futures",
    comparisonMode: "Schedule branches",
    projectionHorizon: "90 days",
  }),
});
