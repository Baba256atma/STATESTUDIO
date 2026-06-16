"use client";

import React from "react";

import { useMrpContextStoreSnapshot } from "../../mrpContext/useMrpContextHeader.ts";
import type { TimelineObjectContextInput } from "./timelineObjectContextContract.ts";
import { syncTimelineObjectContextFromMrpSnapshot } from "./timelineObjectContextRuntime.ts";

export type SyncTimelineObjectContextInput = TimelineObjectContextInput;

export function useSyncTimelineObjectContext(input: SyncTimelineObjectContextInput): void {
  const mrpSnapshot = useMrpContextStoreSnapshot();
  const sceneJson = input.sceneJson;

  React.useEffect(() => {
    syncTimelineObjectContextFromMrpSnapshot(mrpSnapshot, input);
  }, [
    mrpSnapshot.revision,
    mrpSnapshot.selectedObjectId,
    mrpSnapshot.header.selectedObject,
    input.selectedObjectId,
    input.selectedObjectLabel,
    input.selectedObjectType,
    input.selectedObjectStatus,
    input.routeObjectId,
    input.routeObjectName,
    sceneJson,
    input.navigationHistoryEntries,
  ]);
}

export default useSyncTimelineObjectContext;
