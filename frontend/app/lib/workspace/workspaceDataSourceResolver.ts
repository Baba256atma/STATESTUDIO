import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import {
  getWorkspaceDataSource as readWorkspaceDataSourceFromRegistry,
  listWorkspaceDataSources as listWorkspaceDataSourcesFromRegistry,
  registerWorkspaceDataSource,
  removeWorkspaceDataSource,
  updateWorkspaceDataSource,
  type WorkspaceDataSource,
  type WorkspaceDataSourceMutationResult,
} from "./workspaceDataSourceRegistry.ts";
import {
  guardWorkspaceDataSourceAccess,
  type WorkspaceDataSourceIsolationGuardResult,
} from "./workspaceDataSourceIsolationGuard.ts";
import type { RegisterWorkspaceDataSourceInput } from "./workspaceDataSourceRegistry.ts";
import type { UpdateWorkspaceDataSourceInput } from "./workspaceDataSourceRegistry.ts";

export type WorkspaceDataSourceResolverContext = Readonly<{
  workspaceId: WorkspaceId;
  dataSources: readonly WorkspaceDataSource[];
  dataSourceCount: number;
}>;

export type WorkspaceDataSourceBindResult = Readonly<{
  success: boolean;
  dataSource: WorkspaceDataSource | null;
  bindToken: string | null;
  reason: string;
  guard: WorkspaceDataSourceIsolationGuardResult;
}>;

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function denyMutation(
  guard: WorkspaceDataSourceIsolationGuardResult
): WorkspaceDataSourceMutationResult {
  return Object.freeze({
    success: false,
    dataSource: null,
    reason: guard.reason,
  });
}

export function resolveWorkspaceDataSourceContext(
  workspaceId?: WorkspaceId | null
): WorkspaceDataSourceResolverContext | null {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return null;

  const listGuard = guardWorkspaceDataSourceAccess({
    action: "read",
    workspaceId: resolvedWorkspaceId,
  });
  if (!listGuard.allowed) return null;

  const dataSources = listWorkspaceDataSourcesFromRegistry(resolvedWorkspaceId).filter((source) =>
    guardWorkspaceDataSourceAccess({
      action: "read",
      workspaceId: resolvedWorkspaceId,
      dataSource: source,
    }).allowed
  );

  return Object.freeze({
    workspaceId: resolvedWorkspaceId,
    dataSources,
    dataSourceCount: dataSources.length,
  });
}

export function resolveWorkspaceDataSources(
  workspaceId?: WorkspaceId | null
): readonly WorkspaceDataSource[] {
  return resolveWorkspaceDataSourceContext(workspaceId)?.dataSources ?? Object.freeze([]);
}

export function resolveActiveWorkspaceDataSources(): readonly WorkspaceDataSource[] {
  return resolveWorkspaceDataSources(getActiveWorkspace()?.workspaceId ?? null);
}

export function resolveWorkspaceDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceDataSource | null {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return null;

  const source = readWorkspaceDataSourceFromRegistry(resolvedWorkspaceId, dataSourceId);
  const guard = guardWorkspaceDataSourceAccess({
    action: "read",
    workspaceId: resolvedWorkspaceId,
    dataSource: source,
    dataSourceId,
  });
  if (!guard.allowed || !source) return null;
  return source;
}

export function bindWorkspaceDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceDataSourceBindResult {
  const source = resolveWorkspaceDataSource(workspaceId, dataSourceId);
  const guard = guardWorkspaceDataSourceAccess({
    action: "bind",
    workspaceId: resolveWorkspaceId(workspaceId),
    dataSource: source,
    dataSourceId,
  });

  if (!guard.allowed || !source) {
    return Object.freeze({
      success: false,
      dataSource: null,
      bindToken: null,
      reason: guard.reason,
      guard,
    });
  }

  return Object.freeze({
    success: true,
    dataSource: source,
    bindToken: `bind:${source.workspaceId}:${source.dataSourceId}`,
    reason: "bound",
    guard,
  });
}

export function importWorkspaceDataSource(
  input: RegisterWorkspaceDataSourceInput
): WorkspaceDataSourceMutationResult {
  const workspaceId = resolveWorkspaceId(input.workspaceId);
  const guard = guardWorkspaceDataSourceAccess({
    action: "import",
    workspaceId,
  });
  if (!guard.allowed) return denyMutation(guard);

  const result = registerWorkspaceDataSource({ ...input, workspaceId });
  if (result.success && result.dataSource) {
    const verifyGuard = guardWorkspaceDataSourceAccess({
      action: "import",
      workspaceId: result.dataSource.workspaceId,
      dataSource: result.dataSource,
    });
    if (!verifyGuard.allowed) {
      removeWorkspaceDataSource(result.dataSource.workspaceId, result.dataSource.dataSourceId);
      return denyMutation(verifyGuard);
    }
  }
  return result;
}

export function updateOwnedWorkspaceDataSource(
  input: UpdateWorkspaceDataSourceInput
): WorkspaceDataSourceMutationResult {
  const workspaceId = input.workspaceId.trim();
  const existing = readWorkspaceDataSourceFromRegistry(workspaceId, input.dataSourceId);
  const guard = guardWorkspaceDataSourceAccess({
    action: "update",
    workspaceId,
    dataSource: existing,
    dataSourceId: input.dataSourceId,
  });
  if (!guard.allowed) return denyMutation(guard);
  return updateWorkspaceDataSource(input);
}

export function removeOwnedWorkspaceDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceDataSourceMutationResult {
  const resolvedWorkspaceId = workspaceId.trim();
  const existing = readWorkspaceDataSourceFromRegistry(resolvedWorkspaceId, dataSourceId);
  const guard = guardWorkspaceDataSourceAccess({
    action: "delete",
    workspaceId: resolvedWorkspaceId,
    dataSource: existing,
    dataSourceId,
  });
  if (!guard.allowed) return denyMutation(guard);
  return removeWorkspaceDataSource(resolvedWorkspaceId, dataSourceId);
}
