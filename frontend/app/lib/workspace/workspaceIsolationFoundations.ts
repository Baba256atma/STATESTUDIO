import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import {
  getWorkspaceAssistantContexts,
  getWorkspaceDashboardStates,
  getWorkspaceDataSources,
  getWorkspaceObjects,
  getWorkspaceRelationships,
  getWorkspaceRisks,
  getWorkspaceScenarios,
  getWorkspaceScopedResources,
  resolveWorkspaceIdForOwnership,
} from "./workspaceContextResolver.ts";

export type WorkspaceSceneIsolationContext = Readonly<{
  workspaceId: WorkspaceId;
  objectCount: number;
  relationshipCount: number;
  isolated: true;
}>;

export type WorkspaceDashboardIsolationContext = Readonly<{
  workspaceId: WorkspaceId;
  dashboardStateCount: number;
  riskCount: number;
  scenarioCount: number;
  isolated: true;
}>;

export type WorkspaceAssistantIsolationContext = Readonly<{
  workspaceId: WorkspaceId;
  assistantContextCount: number;
  isolated: true;
}>;

export type WorkspaceDataSourceIsolationContext = Readonly<{
  workspaceId: WorkspaceId;
  dataSourceCount: number;
  isolated: true;
}>;

export type WorkspaceIsolationContext = Readonly<{
  workspaceId: WorkspaceId;
  scene: WorkspaceSceneIsolationContext;
  dashboard: WorkspaceDashboardIsolationContext;
  assistant: WorkspaceAssistantIsolationContext;
  dataSources: WorkspaceDataSourceIsolationContext;
}>;

export function resolveWorkspaceSceneIsolation(workspaceId?: WorkspaceId | null): WorkspaceSceneIsolationContext {
  const resolvedWorkspaceId = resolveWorkspaceIdForOwnership(workspaceId);
  return Object.freeze({
    workspaceId: resolvedWorkspaceId,
    objectCount: getWorkspaceObjects(resolvedWorkspaceId).length,
    relationshipCount: getWorkspaceRelationships(resolvedWorkspaceId).length,
    isolated: true,
  });
}

export function resolveWorkspaceDashboardIsolation(workspaceId?: WorkspaceId | null): WorkspaceDashboardIsolationContext {
  const resolvedWorkspaceId = resolveWorkspaceIdForOwnership(workspaceId);
  return Object.freeze({
    workspaceId: resolvedWorkspaceId,
    dashboardStateCount: getWorkspaceDashboardStates(resolvedWorkspaceId).length,
    riskCount: getWorkspaceRisks(resolvedWorkspaceId).length,
    scenarioCount: getWorkspaceScenarios(resolvedWorkspaceId).length,
    isolated: true,
  });
}

export function resolveWorkspaceAssistantIsolation(workspaceId?: WorkspaceId | null): WorkspaceAssistantIsolationContext {
  const resolvedWorkspaceId = resolveWorkspaceIdForOwnership(workspaceId);
  return Object.freeze({
    workspaceId: resolvedWorkspaceId,
    assistantContextCount: getWorkspaceAssistantContexts(resolvedWorkspaceId).length,
    isolated: true,
  });
}

export function resolveWorkspaceDataSourceIsolation(workspaceId?: WorkspaceId | null): WorkspaceDataSourceIsolationContext {
  const resolvedWorkspaceId = resolveWorkspaceIdForOwnership(workspaceId);
  return Object.freeze({
    workspaceId: resolvedWorkspaceId,
    dataSourceCount: getWorkspaceDataSources(resolvedWorkspaceId).length,
    isolated: true,
  });
}

export function resolveWorkspaceIsolationContext(workspaceId?: WorkspaceId | null): WorkspaceIsolationContext {
  const resolvedWorkspaceId = resolveWorkspaceIdForOwnership(workspaceId);
  getWorkspaceScopedResources(resolvedWorkspaceId);
  return Object.freeze({
    workspaceId: resolvedWorkspaceId,
    scene: resolveWorkspaceSceneIsolation(resolvedWorkspaceId),
    dashboard: resolveWorkspaceDashboardIsolation(resolvedWorkspaceId),
    assistant: resolveWorkspaceAssistantIsolation(resolvedWorkspaceId),
    dataSources: resolveWorkspaceDataSourceIsolation(resolvedWorkspaceId),
  });
}
