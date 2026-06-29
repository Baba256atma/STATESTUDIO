/**
 * APP-2:10 — Executive Scenario Workspace view types.
 * Workspace-safe read-only view models — no UI artifacts.
 */

import type {
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
} from "./scenarioIntelligenceTypes.ts";
import type { ExecutiveScenarioSummary } from "./executiveScenarioSummaryResult.ts";
import type { ExecutiveRecommendationPortfolio } from "./executiveRecommendationResult.ts";
import type { ExecutiveScenarioPackage } from "./executiveScenarioPackage.ts";
import { EXECUTIVE_SCENARIO_PACKAGE_VERSION } from "./executiveScenarioPackageManifest.ts";
import type { ExecutiveScenarioWorkspaceDiagnostic } from "./executiveScenarioWorkspaceDiagnostics.ts";

export const EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION = "APP-2/10" as const;

export type ExecutiveScenarioWorkspaceRefreshState =
  | "idle"
  | "refreshing"
  | "synchronized"
  | "stale"
  | "unavailable";

export type ExecutiveScenarioWorkspaceSelectionState =
  | "active"
  | "none"
  | "invalid"
  | "archived"
  | "unavailable";

export type ExecutiveScenarioWorkspaceStatus =
  | "available"
  | "partial"
  | "unavailable";

export type ExecutiveScenarioWorkspaceHookKind = "refresh" | "selection" | "status";

export type ExecutiveScenarioWorkspaceHook = Readonly<{
  hookId: string;
  kind: ExecutiveScenarioWorkspaceHookKind;
  label: string;
  description: string;
  readOnly: true;
}>;

export type ExecutiveScenarioWorkspaceView = Readonly<{
  workspaceId: ScenarioIntelligenceWorkspaceId;
  scenarioId: ScenarioIntelligenceScenarioId | null;
  packageVersion: typeof EXECUTIVE_SCENARIO_PACKAGE_VERSION;
  adapterVersion: typeof EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION;
  packageId: string | null;
  summary: ExecutiveScenarioSummary | null;
  recommendationPortfolio: ExecutiveRecommendationPortfolio | null;
  status: ExecutiveScenarioWorkspaceStatus;
  selectionState: ExecutiveScenarioWorkspaceSelectionState;
  refreshState: ExecutiveScenarioWorkspaceRefreshState;
  hooks: readonly ExecutiveScenarioWorkspaceHook[];
  diagnostics: readonly ExecutiveScenarioWorkspaceDiagnostic[];
  generatedAt: string;
  readOnly: true;
}>;

export type ExecutiveScenarioWorkspaceAdapterRequest = Readonly<{
  package: ExecutiveScenarioPackage;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  selectedScenarioId?: ScenarioIntelligenceScenarioId | null;
  refreshState?: ExecutiveScenarioWorkspaceRefreshState;
  generatedAt: string;
}>;

export const EXECUTIVE_SCENARIO_WORKSPACE_REFRESH_STATES = Object.freeze([
  "idle",
  "refreshing",
  "synchronized",
  "stale",
  "unavailable",
] as const satisfies readonly ExecutiveScenarioWorkspaceRefreshState[]);

export const EXECUTIVE_SCENARIO_WORKSPACE_SELECTION_STATES = Object.freeze([
  "active",
  "none",
  "invalid",
  "archived",
  "unavailable",
] as const satisfies readonly ExecutiveScenarioWorkspaceSelectionState[]);

export const EXECUTIVE_SCENARIO_WORKSPACE_HOOK_IDS = Object.freeze({
  refreshPackage: "workspace-hook-refresh-package",
  selectScenario: "workspace-hook-select-scenario",
  reportStatus: "workspace-hook-report-status",
} as const);

export function createExecutiveScenarioWorkspaceHook(
  input: Omit<ExecutiveScenarioWorkspaceHook, "readOnly">
): ExecutiveScenarioWorkspaceHook {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function buildDefaultExecutiveScenarioWorkspaceHooks(): readonly ExecutiveScenarioWorkspaceHook[] {
  return Object.freeze([
    createExecutiveScenarioWorkspaceHook({
      hookId: EXECUTIVE_SCENARIO_WORKSPACE_HOOK_IDS.refreshPackage,
      kind: "refresh",
      label: "Refresh Package",
      description: "Reload ExecutiveScenarioPackage without rebuilding intelligence.",
    }),
    createExecutiveScenarioWorkspaceHook({
      hookId: EXECUTIVE_SCENARIO_WORKSPACE_HOOK_IDS.selectScenario,
      kind: "selection",
      label: "Select Scenario",
      description: "Switch active scenario within the current workspace boundary.",
    }),
    createExecutiveScenarioWorkspaceHook({
      hookId: EXECUTIVE_SCENARIO_WORKSPACE_HOOK_IDS.reportStatus,
      kind: "status",
      label: "Report Status",
      description: "Expose current workspace integration status for the active package.",
    }),
  ]);
}

export function createExecutiveScenarioWorkspaceView(
  input: Omit<ExecutiveScenarioWorkspaceView, "readOnly">
): ExecutiveScenarioWorkspaceView {
  return Object.freeze({
    ...input,
    readOnly: true as const,
  });
}

export function createUnavailableExecutiveScenarioWorkspaceView(
  workspaceId: ScenarioIntelligenceWorkspaceId,
  generatedAt: string,
  diagnostics: readonly ExecutiveScenarioWorkspaceDiagnostic[]
): ExecutiveScenarioWorkspaceView {
  return createExecutiveScenarioWorkspaceView({
    workspaceId,
    scenarioId: null,
    packageVersion: EXECUTIVE_SCENARIO_PACKAGE_VERSION,
    adapterVersion: EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION,
    packageId: null,
    summary: null,
    recommendationPortfolio: null,
    status: "unavailable",
    selectionState: "unavailable",
    refreshState: "unavailable",
    hooks: Object.freeze([]),
    diagnostics,
    generatedAt,
  });
}
