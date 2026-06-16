/**
 * MRP:4E:1–4E:6 — Scenario workspace contract.
 *
 * Future exploration only — no decision execution, timeline mutation, or War Room auto-open.
 */

import type { ScenarioWorkspaceContext } from "./scenarioWorkspaceContextContract.ts";
import type { ScenarioGenerationSurface } from "./scenarioGenerationContract.ts";
import type { ScenarioComparisonSurface } from "./scenarioComparisonContract.ts";
import type { ScenarioProjectionSurface } from "./scenarioProjectionContract.ts";
import type { ScenarioHandoffSurface } from "./scenarioHandoffContract.ts";

export const SCENARIO_FOUNDATION_TAG = "[MRP_SCENARIO_FOUNDATION]" as const;
export const SCENARIO_CERTIFIED_TAG = "[MRP_SCENARIO_CERTIFIED]" as const;
export const MRP_PHASE4E_COMPLETE_TAG = "[MRP_PHASE4E_COMPLETE]" as const;

export const SCENARIO_WORKSPACE_VERSION = "4E.6.0";

export const CANONICAL_SCENARIO_WORKSPACE_OWNER = "ScenarioWorkspace" as const;

export type ScenarioWorkspaceSectionId =
  | "scenario_summary"
  | "scenario_list"
  | "scenario_comparison"
  | "future_projection";

export type ScenarioWorkspaceCardTone =
  | "neutral"
  | "muted"
  | "success"
  | "warning"
  | "critical"
  | "accent";

export type ScenarioWorkspaceCardView = Readonly<{
  id: ScenarioWorkspaceSectionId;
  label: string;
  headline: string;
  detail: string;
  tone: ScenarioWorkspaceCardTone;
}>;

export type ScenarioWorkspaceView = Readonly<{
  workspaceId: "scenario";
  cards: readonly ScenarioWorkspaceCardView[];
  workspaceContext: ScenarioWorkspaceContext;
  generation: ScenarioGenerationSurface;
  comparison: ScenarioComparisonSurface;
  projection: ScenarioProjectionSurface;
  handoff: ScenarioHandoffSurface;
  scanPurpose: string;
  phase: "loading" | "ready" | "empty";
  revision: number;
  source: "scenario_workspace_foundation" | "scenario_workspace_runtime_state";
  exploresFuturesOnly: true;
}>;

export const SCENARIO_WORKSPACE_SECTION_ORDER: readonly ScenarioWorkspaceSectionId[] =
  Object.freeze([
    "scenario_summary",
    "scenario_list",
    "scenario_comparison",
    "future_projection",
  ]);

export const SCENARIO_WORKSPACE_SECTION_LABELS: Readonly<
  Record<ScenarioWorkspaceSectionId, string>
> = Object.freeze({
  scenario_summary: "Scenario Summary",
  scenario_list: "Scenario List",
  scenario_comparison: "Scenario Comparison Area",
  future_projection: "Future Projection Area",
});
