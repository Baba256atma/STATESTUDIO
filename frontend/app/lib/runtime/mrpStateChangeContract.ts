/**
 * MRP-STAB-1 — meaningful MRP state change contract.
 * Write only when view, tab, surface, context, or selected object actually changes.
 */

export type MrpStateSnapshot = Readonly<{
  view: string | null;
  tab: string | null;
  dashboardContext: string | null;
  dashboardMode: string | null;
  surfaceId: string | null;
  contextId: string | null;
  selectedObjectId: string | null;
  workspaceId: string | null;
}>;

export function buildMrpStateSnapshot(input: {
  view?: string | null;
  tab?: string | null;
  dashboardContext?: string | null;
  dashboardMode?: string | null;
  surfaceId?: string | null;
  contextId?: string | null;
  selectedObjectId?: string | null;
  workspaceId?: string | null;
}): MrpStateSnapshot {
  return Object.freeze({
    view: input.view ?? null,
    tab: input.tab ?? null,
    dashboardContext: input.dashboardContext ?? null,
    dashboardMode: input.dashboardMode ?? null,
    surfaceId: input.surfaceId ?? null,
    contextId: input.contextId ?? null,
    selectedObjectId: input.selectedObjectId ?? null,
    workspaceId: input.workspaceId ?? null,
  });
}

export function buildMrpStateSignature(snapshot: MrpStateSnapshot): string {
  return JSON.stringify({
    view: snapshot.view,
    tab: snapshot.tab,
    dashboardContext: snapshot.dashboardContext,
    dashboardMode: snapshot.dashboardMode,
    surfaceId: snapshot.surfaceId,
    contextId: snapshot.contextId,
    selectedObjectId: snapshot.selectedObjectId,
    workspaceId: snapshot.workspaceId,
  });
}

export function isMeaningfulMrpStateChange(
  previous: MrpStateSnapshot,
  next: MrpStateSnapshot
): boolean {
  return (
    previous.view !== next.view ||
    previous.tab !== next.tab ||
    previous.dashboardContext !== next.dashboardContext ||
    previous.dashboardMode !== next.dashboardMode ||
    previous.surfaceId !== next.surfaceId ||
    previous.contextId !== next.contextId ||
    previous.selectedObjectId !== next.selectedObjectId ||
    previous.workspaceId !== next.workspaceId
  );
}

/** Workspace dispatch dedup — excludes derived panel/view fields. */
export function isMeaningfulWorkspaceCommit(
  previous: MrpStateSnapshot,
  next: MrpStateSnapshot
): boolean {
  return (
    previous.tab !== next.tab ||
    previous.dashboardContext !== next.dashboardContext ||
    previous.dashboardMode !== next.dashboardMode ||
    previous.selectedObjectId !== next.selectedObjectId ||
    previous.workspaceId !== next.workspaceId
  );
}
