/**
 * MRP:8:1 — Executive Workspace Registry runtime.
 *
 * Initializes once. Dashboard discovers workspaces through registry queries.
 */

import type { DashboardMode } from "./dashboardModeRuntimeContract.ts";
import type { ObjectPanelDashboardAction } from "../object-panel/objectPanelActionRouterContract.ts";
import {
  detectDuplicateExecutiveWorkspaceDefinitions,
  EXECUTIVE_WORKSPACE_REGISTRY_VERSION,
  getExecutiveWorkspaceEntry,
  listExecutiveWorkspaceIds,
  resolveExecutiveWorkspaceByDashboardMode,
  resolveExecutiveWorkspaceByObjectPanelAction,
  type ExecutiveWorkspaceCatalogEntry,
  type ExecutiveWorkspaceId,
} from "./executiveWorkspaceRegistryContract.ts";

let registryInitialized = false;

export function initializeExecutiveWorkspaceRegistry(): Readonly<{
  version: string;
  workspaceCount: number;
  duplicates: readonly string[];
}> {
  if (registryInitialized) {
    return Object.freeze({
      version: EXECUTIVE_WORKSPACE_REGISTRY_VERSION,
      workspaceCount: listExecutiveWorkspaceIds().length,
      duplicates: Object.freeze([]),
    });
  }

  registryInitialized = true;
  const duplicates = detectDuplicateExecutiveWorkspaceDefinitions();

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[WorkspaceRegistry][Init]", {
      version: EXECUTIVE_WORKSPACE_REGISTRY_VERSION,
      workspaceCount: listExecutiveWorkspaceIds().length,
      duplicates: duplicates.length,
    });
  }

  return Object.freeze({
    version: EXECUTIVE_WORKSPACE_REGISTRY_VERSION,
    workspaceCount: listExecutiveWorkspaceIds().length,
    duplicates,
  });
}

export function resetExecutiveWorkspaceRegistryRuntimeForTests(): void {
  registryInitialized = false;
}

export function discoverExecutiveWorkspace(
  query:
    | { by: "id"; id: ExecutiveWorkspaceId }
    | { by: "dashboardMode"; mode: DashboardMode }
    | { by: "objectPanelAction"; action: ObjectPanelDashboardAction }
): ExecutiveWorkspaceCatalogEntry | null {
  initializeExecutiveWorkspaceRegistry();

  switch (query.by) {
    case "id":
      return getExecutiveWorkspaceEntry(query.id);
    case "dashboardMode":
      return resolveExecutiveWorkspaceByDashboardMode(query.mode);
    case "objectPanelAction":
      return resolveExecutiveWorkspaceByObjectPanelAction(query.action);
    default:
      return null;
  }
}

export function listAvailableExecutiveWorkspaces(): readonly ExecutiveWorkspaceCatalogEntry[] {
  initializeExecutiveWorkspaceRegistry();
  return Object.freeze(
    listExecutiveWorkspaceIds()
      .map((id) => getExecutiveWorkspaceEntry(id))
      .filter((entry) => entry.availability === "available")
  );
}

export function listFutureExecutiveWorkspaces(): readonly ExecutiveWorkspaceCatalogEntry[] {
  initializeExecutiveWorkspaceRegistry();
  return Object.freeze(
    listExecutiveWorkspaceIds()
      .map((id) => getExecutiveWorkspaceEntry(id))
      .filter((entry) => entry.availability === "future")
  );
}
