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
import { getWorkspaceDiscoveredRelationships } from "./workspaceRelationshipDiscoveryContract.ts";
import { resolveWorkspaceDataSources } from "./workspaceDataSourceResolver.ts";
import { listPipelineWorkspaceObjects } from "./objectCreationPipeline.ts";

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
  const resolvedWorkspaceId = resolveWorkspaceIdForOwnership(workspaceId);
  return Object.freeze(
    listPipelineWorkspaceObjects(resolvedWorkspaceId).map((object) =>
      Object.freeze({
        workspaceId: object.workspaceId,
        resourceId: object.objectId,
        resourceKind: "object" as const,
        objectId: object.objectId,
        objectName: object.objectName,
        createdAt: object.createdAt,
        updatedAt: object.updatedAt,
      })
    )
  );
}

export function getWorkspaceRelationships(workspaceId: WorkspaceId): readonly WorkspaceOwnedRelationship[] {
  const resolvedWorkspaceId = resolveWorkspaceIdForOwnership(workspaceId);
  return Object.freeze(
    getWorkspaceDiscoveredRelationships(resolvedWorkspaceId).map((relationship) =>
      Object.freeze({
        workspaceId: relationship.workspaceId,
        resourceId: relationship.relationshipId,
        resourceKind: "relationship" as const,
        relationshipId: relationship.relationshipId,
        sourceObjectId: relationship.sourceObjectId,
        targetObjectId: relationship.targetObjectId,
        createdAt: relationship.createdAt,
      })
    )
  );
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
  const resolvedWorkspaceId = resolveWorkspaceIdForOwnership(workspaceId);
  return Object.freeze(
    resolveWorkspaceDataSources(resolvedWorkspaceId).map((dataSource) =>
      Object.freeze({
        workspaceId: dataSource.workspaceId,
        resourceId: dataSource.dataSourceId,
        resourceKind: "data_source" as const,
        dataSourceId: dataSource.dataSourceId,
        label: dataSource.name,
        sourceType: dataSource.type,
        createdAt: dataSource.createdAt,
        updatedAt: dataSource.updatedAt,
      })
    )
  );
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
