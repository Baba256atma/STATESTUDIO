import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace, getWorkspaceById } from "./workspaceRegistryStore.ts";
import type {
  WorkspaceOwnedAssistantContext,
  WorkspaceOwnedDashboardState,
  WorkspaceOwnedDataSource,
  WorkspaceOwnedFutureReport,
  WorkspaceOwnedFutureSimulation,
  WorkspaceOwnedKpi,
  WorkspaceOwnedObject,
  WorkspaceOwnedRelationship,
  WorkspaceOwnedRisk,
  WorkspaceOwnedScenario,
  WorkspaceOwnershipCounts,
  WorkspaceScopedResourceCollections,
} from "./workspaceOwnershipContract.ts";

function emptyArray<T>(): readonly T[] {
  return Object.freeze([]) as readonly T[];
}

export function resolveWorkspaceIdForOwnership(workspaceId?: WorkspaceId | null): WorkspaceId {
  const explicit = workspaceId?.trim();
  if (explicit && getWorkspaceById(explicit)) return explicit;
  const active = getActiveWorkspace();
  return active?.workspaceId ?? "demo_workspace";
}

export function getWorkspaceObjects(workspaceId: WorkspaceId): readonly WorkspaceOwnedObject[] {
  void resolveWorkspaceIdForOwnership(workspaceId);
  return emptyArray<WorkspaceOwnedObject>();
}

export function getWorkspaceRelationships(workspaceId: WorkspaceId): readonly WorkspaceOwnedRelationship[] {
  void resolveWorkspaceIdForOwnership(workspaceId);
  return emptyArray<WorkspaceOwnedRelationship>();
}

export function getWorkspaceKpis(workspaceId: WorkspaceId): readonly WorkspaceOwnedKpi[] {
  void resolveWorkspaceIdForOwnership(workspaceId);
  return emptyArray<WorkspaceOwnedKpi>();
}

export function getWorkspaceRisks(workspaceId: WorkspaceId): readonly WorkspaceOwnedRisk[] {
  void resolveWorkspaceIdForOwnership(workspaceId);
  return emptyArray<WorkspaceOwnedRisk>();
}

export function getWorkspaceScenarios(workspaceId: WorkspaceId): readonly WorkspaceOwnedScenario[] {
  void resolveWorkspaceIdForOwnership(workspaceId);
  return emptyArray<WorkspaceOwnedScenario>();
}

export function getWorkspaceDataSources(workspaceId: WorkspaceId): readonly WorkspaceOwnedDataSource[] {
  void resolveWorkspaceIdForOwnership(workspaceId);
  return emptyArray<WorkspaceOwnedDataSource>();
}

export function getWorkspaceDashboardStates(workspaceId: WorkspaceId): readonly WorkspaceOwnedDashboardState[] {
  void resolveWorkspaceIdForOwnership(workspaceId);
  return emptyArray<WorkspaceOwnedDashboardState>();
}

export function getWorkspaceAssistantContexts(workspaceId: WorkspaceId): readonly WorkspaceOwnedAssistantContext[] {
  void resolveWorkspaceIdForOwnership(workspaceId);
  return emptyArray<WorkspaceOwnedAssistantContext>();
}

export function getWorkspaceReports(workspaceId: WorkspaceId): readonly WorkspaceOwnedFutureReport[] {
  void resolveWorkspaceIdForOwnership(workspaceId);
  return emptyArray<WorkspaceOwnedFutureReport>();
}

export function getWorkspaceSimulations(workspaceId: WorkspaceId): readonly WorkspaceOwnedFutureSimulation[] {
  void resolveWorkspaceIdForOwnership(workspaceId);
  return emptyArray<WorkspaceOwnedFutureSimulation>();
}

export function getWorkspaceOwnershipCounts(workspaceId: WorkspaceId): WorkspaceOwnershipCounts {
  const resolvedWorkspaceId = resolveWorkspaceIdForOwnership(workspaceId);
  const counts = Object.freeze({
    objects: getWorkspaceObjects(resolvedWorkspaceId).length,
    relationships: getWorkspaceRelationships(resolvedWorkspaceId).length,
    kpis: getWorkspaceKpis(resolvedWorkspaceId).length,
    risks: getWorkspaceRisks(resolvedWorkspaceId).length,
    scenarios: getWorkspaceScenarios(resolvedWorkspaceId).length,
    dataSources: getWorkspaceDataSources(resolvedWorkspaceId).length,
    dashboardStates: getWorkspaceDashboardStates(resolvedWorkspaceId).length,
    assistantContexts: getWorkspaceAssistantContexts(resolvedWorkspaceId).length,
    reports: getWorkspaceReports(resolvedWorkspaceId).length,
    simulations: getWorkspaceSimulations(resolvedWorkspaceId).length,
  });

  devDiagnosticLog("workspaceOwnership", "[WorkspaceOwnership]", {
    Workspace: resolvedWorkspaceId,
    "Owned Objects": counts.objects,
    "Owned Risks": counts.risks,
    "Owned Scenarios": counts.scenarios,
    "Owned Data Sources": counts.dataSources,
  });

  return counts;
}

export function getWorkspaceScopedResources(workspaceId: WorkspaceId): WorkspaceScopedResourceCollections {
  const resolvedWorkspaceId = resolveWorkspaceIdForOwnership(workspaceId);
  return Object.freeze({
    workspaceId: resolvedWorkspaceId,
    objects: getWorkspaceObjects(resolvedWorkspaceId),
    relationships: getWorkspaceRelationships(resolvedWorkspaceId),
    kpis: getWorkspaceKpis(resolvedWorkspaceId),
    risks: getWorkspaceRisks(resolvedWorkspaceId),
    scenarios: getWorkspaceScenarios(resolvedWorkspaceId),
    dataSources: getWorkspaceDataSources(resolvedWorkspaceId),
    dashboardStates: getWorkspaceDashboardStates(resolvedWorkspaceId),
    assistantContexts: getWorkspaceAssistantContexts(resolvedWorkspaceId),
    reports: getWorkspaceReports(resolvedWorkspaceId),
    simulations: getWorkspaceSimulations(resolvedWorkspaceId),
    counts: getWorkspaceOwnershipCounts(resolvedWorkspaceId),
  });
}
