"use client";

import React from "react";

import { useMrpContextStoreSnapshot } from "../../mrpContext/useMrpContextHeader.ts";
import type { TimelineWorkspaceDataInput } from "./timelineWorkspaceMetricsContract.ts";
import { syncTimelineWorkspaceDataFromMrpSnapshot } from "./timelineWorkspaceDataRuntime.ts";

export type SyncTimelineWorkspaceDataInput = TimelineWorkspaceDataInput;

export function useSyncTimelineWorkspaceData(input: SyncTimelineWorkspaceDataInput): void {
  const mrpSnapshot = useMrpContextStoreSnapshot();
  const sceneJson = input.sceneJson;

  React.useEffect(() => {
    syncTimelineWorkspaceDataFromMrpSnapshot(mrpSnapshot, input);
  }, [
    mrpSnapshot.revision,
    mrpSnapshot.selectedObjectId,
    mrpSnapshot.header.selectedObject,
    input.selectedObjectId,
    input.selectedObjectLabel,
    input.routeObjectId,
    input.routeObjectName,
    sceneJson,
    input.navigationHistoryEntries,
  ]);
}

export default useSyncTimelineWorkspaceData;
