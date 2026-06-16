"use client";

import React from "react";

import { syncWarRoomActionPlan } from "./warRoomActionPlanRuntime.ts";
import { useWarRoomState } from "./useWarRoomState.ts";
import { useWarRoomWorkspaceState } from "./useWarRoomWorkspaceState.ts";

export function useSyncWarRoomActionPlan(): void {
  const workspaceState = useWarRoomWorkspaceState();
  const warRoomState = useWarRoomState();

  React.useEffect(() => {
    if (workspaceState.phase === "loading") return;
    syncWarRoomActionPlan();
  }, [
    workspaceState.phase,
    workspaceState.revision,
    workspaceState.workspaceContext.hasSelection,
    workspaceState.workspaceContext.selectedObjectId,
    warRoomState.revision,
    warRoomState.selectedStrategy,
    warRoomState.activeDecisionId,
    warRoomState.status,
  ]);
}

export default useSyncWarRoomActionPlan;
