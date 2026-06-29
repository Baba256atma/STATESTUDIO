/**
 * APP-2:10 — Executive Scenario Workspace Adapter.
 * Thin read-only adapter from ExecutiveScenarioPackage to workspace view models.
 */

import type { ExecutiveScenarioPackage } from "./executiveScenarioPackage.ts";
import { EXECUTIVE_SCENARIO_PACKAGE_VERSION } from "./executiveScenarioPackageManifest.ts";
import {
  buildDefaultExecutiveScenarioWorkspaceHooks,
  createExecutiveScenarioWorkspaceView,
  type ExecutiveScenarioWorkspaceAdapterRequest,
  type ExecutiveScenarioWorkspaceRefreshState,
  type ExecutiveScenarioWorkspaceSelectionState,
  type ExecutiveScenarioWorkspaceStatus,
  type ExecutiveScenarioWorkspaceView,
  EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION,
} from "./executiveScenarioWorkspaceView.ts";
import {
  createExecutiveScenarioWorkspaceDiagnostic,
  type ExecutiveScenarioWorkspaceDiagnostic,
} from "./executiveScenarioWorkspaceDiagnostics.ts";

export {
  EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION,
  type ExecutiveScenarioWorkspaceAdapterRequest,
  type ExecutiveScenarioWorkspaceView,
};

export const EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES = Object.freeze({
  readOnly: true,
  consumesPackageOnly: true,
  rebuildsIntelligence: false,
  modifiesWorkspace: false,
  executesRecommendations: false,
  noUi: true,
  noReact: true,
  noGlobalCache: true,
  workspaceIsolated: true,
  deterministic: true,
} as const);

export const EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_MANIFEST = Object.freeze({
  stageId: "APP-2/10",
  title: "Executive Scenario Workspace Adapter",
  goal: "Single read-only workspace integration boundary for APP-2.",
  adapterVersion: EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION,
  packageEngineModified: false,
  contractModified: false,
} as const);

function resolveSelectionState(
  pkg: ExecutiveScenarioPackage,
  selectedScenarioId: string | null | undefined
): ExecutiveScenarioWorkspaceSelectionState {
  if (selectedScenarioId === null || selectedScenarioId === undefined) {
    return "none";
  }
  if (selectedScenarioId !== pkg.scenarioId) {
    return "invalid";
  }
  const lifecycle = pkg.snapshot.state?.lifecycle ?? pkg.references.context.identity?.status;
  if (lifecycle === "archived") {
    return "archived";
  }
  return "active";
}

function resolveRefreshState(
  requested: ExecutiveScenarioWorkspaceRefreshState | undefined,
  diagnostics: readonly ExecutiveScenarioWorkspaceDiagnostic[]
): ExecutiveScenarioWorkspaceRefreshState {
  if (diagnostics.some((entry) => entry.code === "refresh_failure")) {
    return "unavailable";
  }
  if (diagnostics.some((entry) => entry.code === "stale_package")) {
    return "stale";
  }
  if (requested === "refreshing") {
    return "refreshing";
  }
  if (requested === "idle") {
    return "idle";
  }
  return requested ?? "synchronized";
}

function resolveWorkspaceStatus(
  pkg: ExecutiveScenarioPackage,
  diagnostics: readonly ExecutiveScenarioWorkspaceDiagnostic[]
): ExecutiveScenarioWorkspaceStatus {
  if (diagnostics.some((entry) => entry.severity === "error")) {
    return "unavailable";
  }
  if (
    pkg.summary.summaryStatus !== "complete" ||
    pkg.diagnostics.length > 0 ||
    diagnostics.some((entry) => entry.severity === "warning")
  ) {
    return "partial";
  }
  return "available";
}

function validatePackageForWorkspace(
  pkg: ExecutiveScenarioPackage,
  workspaceId: string,
  generatedAt: string,
  refreshState?: ExecutiveScenarioWorkspaceRefreshState
): readonly ExecutiveScenarioWorkspaceDiagnostic[] {
  const diagnostics: ExecutiveScenarioWorkspaceDiagnostic[] = [];

  if (!pkg.readOnly) {
    diagnostics.push(
      createExecutiveScenarioWorkspaceDiagnostic(
        "missing_package",
        "ExecutiveScenarioPackage must be read-only.",
        generatedAt
      )
    );
  }
  if (pkg.packageVersion !== EXECUTIVE_SCENARIO_PACKAGE_VERSION) {
    diagnostics.push(
      createExecutiveScenarioWorkspaceDiagnostic(
        "version_mismatch",
        "ExecutiveScenarioPackage version mismatch.",
        generatedAt,
        Object.freeze({ expected: EXECUTIVE_SCENARIO_PACKAGE_VERSION, actual: pkg.packageVersion })
      )
    );
  }
  if (pkg.workspaceId !== workspaceId.trim()) {
    diagnostics.push(
      createExecutiveScenarioWorkspaceDiagnostic(
        "workspace_isolation_failure",
        "Package workspace does not match requested workspace.",
        generatedAt,
        Object.freeze({ requestedWorkspaceId: workspaceId, packageWorkspaceId: pkg.workspaceId })
      )
    );
  }
  if (pkg.metadata.workspace !== workspaceId.trim()) {
    diagnostics.push(
      createExecutiveScenarioWorkspaceDiagnostic(
        "invalid_workspace",
        "Package metadata workspace mismatch.",
        generatedAt
      )
    );
  }
  if (refreshState === "unavailable") {
    diagnostics.push(
      createExecutiveScenarioWorkspaceDiagnostic(
        "refresh_failure",
        "Package refresh state is unavailable.",
        generatedAt
      )
    );
  }
  if (pkg.generatedAt !== generatedAt && refreshState !== "refreshing") {
    diagnostics.push(
      createExecutiveScenarioWorkspaceDiagnostic(
        "stale_package",
        "Package generatedAt differs from workspace view generatedAt.",
        generatedAt,
        Object.freeze({ packageGeneratedAt: pkg.generatedAt })
      )
    );
  }

  return Object.freeze(diagnostics);
}

function validateSelection(
  pkg: ExecutiveScenarioPackage,
  selectedScenarioId: string | null | undefined,
  generatedAt: string
): readonly ExecutiveScenarioWorkspaceDiagnostic[] {
  if (selectedScenarioId === null || selectedScenarioId === undefined) {
    return Object.freeze([]);
  }
  if (selectedScenarioId !== pkg.scenarioId) {
    return Object.freeze([
      createExecutiveScenarioWorkspaceDiagnostic(
        "invalid_selection",
        "Selected scenario does not match package scenario.",
        generatedAt,
        Object.freeze({ selectedScenarioId, packageScenarioId: pkg.scenarioId })
      ),
    ]);
  }
  if (pkg.scenarioId.length === 0) {
    return Object.freeze([
      createExecutiveScenarioWorkspaceDiagnostic(
        "invalid_scenario",
        "Package scenario ID is invalid.",
        generatedAt
      ),
    ]);
  }
  return Object.freeze([]);
}

export function adaptExecutiveScenarioPackageToWorkspaceView(
  request: ExecutiveScenarioWorkspaceAdapterRequest
): ExecutiveScenarioWorkspaceView {
  const { package: pkg, workspaceId, selectedScenarioId, refreshState, generatedAt } = request;

  const validationDiagnostics = validatePackageForWorkspace(
    pkg,
    workspaceId,
    generatedAt,
    refreshState
  );
  const selectionDiagnostics = validateSelection(pkg, selectedScenarioId, generatedAt);
  const diagnostics = Object.freeze([...validationDiagnostics, ...selectionDiagnostics]);

  const hasBlockingError = diagnostics.some((entry) => entry.severity === "error");
  const selectionState = hasBlockingError
    ? "unavailable"
    : resolveSelectionState(pkg, selectedScenarioId);
  const resolvedRefreshState = hasBlockingError
    ? "unavailable"
    : resolveRefreshState(refreshState, diagnostics);
  const status = hasBlockingError ? "unavailable" : resolveWorkspaceStatus(pkg, diagnostics);

  if (hasBlockingError) {
    return createExecutiveScenarioWorkspaceView({
      workspaceId,
      scenarioId: hasBlockingError ? null : pkg.scenarioId,
      packageVersion: pkg.packageVersion,
      adapterVersion: EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION,
      packageId: null,
      summary: null,
      recommendationPortfolio: null,
      status,
      selectionState,
      refreshState: resolvedRefreshState,
      hooks: Object.freeze([]),
      diagnostics,
      generatedAt,
    });
  }

  return createExecutiveScenarioWorkspaceView({
    workspaceId,
    scenarioId: selectionState === "none" ? null : pkg.scenarioId,
    packageVersion: pkg.packageVersion,
    adapterVersion: EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION,
    packageId: pkg.packageId,
    summary: pkg.summary,
    recommendationPortfolio: pkg.recommendationPortfolio,
    status,
    selectionState,
    refreshState: resolvedRefreshState,
    hooks: buildDefaultExecutiveScenarioWorkspaceHooks(),
    diagnostics,
    generatedAt,
  });
}

export const ExecutiveScenarioWorkspaceAdapter = Object.freeze({
  adaptExecutiveScenarioPackageToWorkspaceView,
  rules: EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES,
  manifest: EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_MANIFEST,
  version: EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION,
});
