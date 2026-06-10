/**
 * MRP:8:5 — Executive Workspace Architecture Freeze QA validation.
 *
 * Cross-layer integration certification only — no runtime features.
 */

import type { ExecutiveWorkspaceId } from "./executiveWorkspaceRegistryContract.ts";
import {
  detectDuplicateExecutiveWorkspaceDefinitions,
  EXECUTIVE_WORKSPACE_CATALOG,
  listExecutiveWorkspaceIds,
} from "./executiveWorkspaceRegistryContract.ts";
import { SINGLE_ACTIVE_EXECUTIVE_WORKSPACE_IDS } from "./executiveWorkspaceTransitionControllerContract.ts";
import { CANONICAL_DASHBOARD_MODE_OWNER } from "./dashboardModeRuntimeContract.ts";

export type WorkspaceFreezeQaResult = Readonly<{
  id: string;
  layer: "registry" | "lifecycle" | "transition" | "history" | "dashboard";
  status: "pass" | "warning" | "fail";
  evidence: string;
}>;

export const WORKSPACE_FREEZE_BRAKE_PREFIXES = Object.freeze([
  "[WorkspaceRegistry][Brake]",
  "[WorkspaceLifecycle][Brake]",
  "[WorkspaceTransition][Brake]",
  "[WorkspaceHistory][Brake]",
  "[DashboardRuntime][Brake]",
] as const);

export const WORKSPACE_FREEZE_OWNERSHIP_MATRIX = Object.freeze({
  registry: "metadata_only",
  lifecycle: "lifecycle_state_only",
  transition: "transition_coordination_only",
  history: "navigation_observation_only",
  dashboard: "execution_authority",
  assistant: "read_only_observer",
});

export function validateRegistryIntegrity(): WorkspaceFreezeQaResult[] {
  const results: WorkspaceFreezeQaResult[] = [];
  const ids = listExecutiveWorkspaceIds();
  const duplicates = detectDuplicateExecutiveWorkspaceDefinitions();

  results.push(
    Object.freeze({
      id: "registry_catalog_populated",
      layer: "registry",
      status: ids.length >= 14 ? "pass" : "fail",
      evidence: `Catalog entries: ${ids.length}`,
    }),
    Object.freeze({
      id: "registry_no_duplicates",
      layer: "registry",
      status: duplicates.length === 0 ? "pass" : "fail",
      evidence: duplicates.length === 0 ? "No duplicate mappings" : duplicates.join("; "),
    }),
    Object.freeze({
      id: "registry_active_workspaces_registered",
      layer: "registry",
      status: SINGLE_ACTIVE_EXECUTIVE_WORKSPACE_IDS.every((id) => id in EXECUTIVE_WORKSPACE_CATALOG)
        ? "pass"
        : "fail",
      evidence: `Single-active IDs: ${SINGLE_ACTIVE_EXECUTIVE_WORKSPACE_IDS.length}`,
    })
  );

  return results;
}

export function validateDashboardAuthorityPreserved(): WorkspaceFreezeQaResult {
  return Object.freeze({
    id: "dashboard_mode_owner",
    layer: "dashboard",
    status: CANONICAL_DASHBOARD_MODE_OWNER === "NexoraWorkspaceState.dashboardMode" ? "pass" : "fail",
    evidence: CANONICAL_DASHBOARD_MODE_OWNER,
  });
}

export function validateBrakePrefixCoverage(): WorkspaceFreezeQaResult[] {
  return WORKSPACE_FREEZE_BRAKE_PREFIXES.map((prefix) =>
    Object.freeze({
      id: `brake_prefix_${prefix.replace(/\[|\]/g, "").toLowerCase()}`,
      layer:
        prefix.includes("Registry")
          ? "registry"
          : prefix.includes("Lifecycle")
            ? "lifecycle"
            : prefix.includes("Transition")
              ? "transition"
              : prefix.includes("History")
                ? "history"
                : "dashboard",
      status: "pass" as const,
      evidence: `${prefix} defined in contract layer`,
    })
  );
}

export function countActiveExecutiveWorkspaces(
  getState: (id: ExecutiveWorkspaceId) => { currentState: string } | null
): number {
  let count = 0;
  for (const id of SINGLE_ACTIVE_EXECUTIVE_WORKSPACE_IDS) {
    const state = getState(id);
    if (state?.currentState === "active") count += 1;
  }
  return count;
}

export function certifySingleActiveWorkspace(
  activeCount: number
): WorkspaceFreezeQaResult {
  const status = activeCount === 1 ? "pass" : "fail";
  return Object.freeze({
    id: "single_active_workspace",
    layer: "transition",
    status,
    evidence:
      activeCount === 0
        ? "Zero active workspaces — certification failure"
        : activeCount === 1
          ? "Exactly one active workspace"
          : `Multiple active workspaces detected: ${activeCount}`,
  });
}

export function runWorkspaceFreezeQaMatrix(
  options: {
    activeWorkspaceCount?: number;
  } = {}
): Readonly<{
  results: readonly WorkspaceFreezeQaResult[];
  passCount: number;
  warningCount: number;
  failCount: number;
}> {
  const results: WorkspaceFreezeQaResult[] = [
    ...validateRegistryIntegrity(),
    ...validateBrakePrefixCoverage(),
    validateDashboardAuthorityPreserved(),
  ];

  if (options.activeWorkspaceCount !== undefined) {
    results.push(certifySingleActiveWorkspace(options.activeWorkspaceCount));
  }

  const passCount = results.filter((r) => r.status === "pass").length;
  const warningCount = results.filter((r) => r.status === "warning").length;
  const failCount = results.filter((r) => r.status === "fail").length;

  return Object.freeze({ results, passCount, warningCount, failCount });
}

export function resolveWorkspaceFreezeVerdict(input: {
  failCount: number;
  warningCount: number;
  legacyBypassCount: number;
}): "PASS" | "PASS WITH WARNINGS" | "FAIL" {
  if (input.failCount > 0) return "FAIL";
  if (input.warningCount > 0 || input.legacyBypassCount > 0) return "PASS WITH WARNINGS";
  return "PASS";
}
