/**
 * MRP:3:3 — Restore plan builder for MRP back navigation.
 */

import type { NexoraWorkspaceAction } from "../../workspace/nexoraWorkspaceStateContract.ts";
import type { MrpContextHistoryEntry } from "./mrpContextHistoryContract.ts";

export type MrpContextRestorePlan = Readonly<{
  actions: readonly NexoraWorkspaceAction[];
  subWorkspaceMode: string | null;
  selectedObjectId: string | null;
  selectedObjectLabel: string | null;
  panelName: string;
  activeMode: string;
  selectedObject: string;
}>;

export function buildMrpContextRestorePlan(entry: MrpContextHistoryEntry): MrpContextRestorePlan {
  const routeObjectId = entry.routeObjectId?.trim() || entry.selectedObjectId?.trim() || "";
  const routeObjectName =
    entry.routeObjectName?.trim() ||
    entry.selectedObjectLabel?.trim() ||
    routeObjectId ||
    "";
  const routeObject =
    routeObjectId.length > 0
      ? Object.freeze({
          objectId: routeObjectId,
          objectName: routeObjectName || routeObjectId,
        })
      : undefined;

  const actions: NexoraWorkspaceAction[] = [];

  if (entry.dashboardMode === "overview" && entry.dashboardContext !== "overview") {
    actions.push(Object.freeze({ type: "setDashboardContext", context: entry.dashboardContext }));
  } else {
    actions.push(
      Object.freeze({
        type: "setDashboardMode",
        mode: entry.dashboardMode,
        routeObject,
      })
    );
  }

  actions.push(Object.freeze({ type: "setMRPTab", tab: entry.activeTab }));

  if (entry.selectedObjectId?.trim()) {
    actions.push(
      Object.freeze({
        type: "selectObject",
        objectId: entry.selectedObjectId.trim(),
      })
    );
  }

  return Object.freeze({
    actions: Object.freeze(actions),
    subWorkspaceMode: entry.subWorkspaceMode,
    selectedObjectId: entry.selectedObjectId,
    selectedObjectLabel: entry.selectedObjectLabel,
    panelName: entry.panelName,
    activeMode: entry.activeMode,
    selectedObject: entry.selectedObject,
  });
}
