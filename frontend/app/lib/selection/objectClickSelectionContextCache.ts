import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import type { DashboardSurfaceId } from "../dashboard/dashboardSurfaceRegistry.ts";

export type ObjectClickSelectionContext = Readonly<{
  selectedObjectId: string;
  selectedObjectName: string;
  selectedObjectType: string | null;
  selectedWorkspaceId: string | null;
  dashboardContext: DashboardContext | null;
  surfaceId: DashboardSurfaceId | null;
  eventId: string | null;
  updatedAt: number;
}>;

let cachedSelectionContext: ObjectClickSelectionContext | null = null;

export function publishObjectClickSelectionContext(
  input: Readonly<{
    selectedObjectId: string;
    selectedObjectName?: string | null;
    selectedObjectType?: string | null;
    selectedWorkspaceId?: string | null;
    dashboardContext?: DashboardContext | null;
    surfaceId?: DashboardSurfaceId | null;
    eventId?: string | null;
  }>
): ObjectClickSelectionContext {
  const selectedObjectId = String(input.selectedObjectId ?? "").trim();
  const selectedObjectName = String(input.selectedObjectName ?? selectedObjectId).trim() || selectedObjectId;
  cachedSelectionContext = Object.freeze({
    selectedObjectId,
    selectedObjectName,
    selectedObjectType: input.selectedObjectType ?? null,
    selectedWorkspaceId: input.selectedWorkspaceId ?? null,
    dashboardContext: input.dashboardContext ?? null,
    surfaceId: input.surfaceId ?? null,
    eventId: input.eventId ?? null,
    updatedAt: Date.now(),
  });
  return cachedSelectionContext;
}

export function getObjectClickSelectionContext(): ObjectClickSelectionContext | null {
  return cachedSelectionContext;
}

export function clearObjectClickSelectionContext(): void {
  cachedSelectionContext = null;
}

export function resetObjectClickSelectionContextCacheForTests(): void {
  cachedSelectionContext = null;
}
