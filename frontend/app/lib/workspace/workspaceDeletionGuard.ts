/**
 * Same-realm mutation block while a Workspace deletion is in progress.
 * The set is filled from the Workspace registry by the deletion lifecycle.
 * Another browser tab does not share this set until it reads the registry.
 */

const blockedWorkspaceIds = new Set<string>();

export function blockWorkspaceMutations(workspaceId: string): void {
  blockedWorkspaceIds.add(workspaceId);
}

export function releaseWorkspaceMutationBlock(workspaceId: string): void {
  blockedWorkspaceIds.delete(workspaceId);
}

export function workspaceMutationsBlocked(workspaceId: string): boolean {
  return blockedWorkspaceIds.has(workspaceId);
}

export function resetWorkspaceDeletionGuardForTests(): void {
  blockedWorkspaceIds.clear();
}
