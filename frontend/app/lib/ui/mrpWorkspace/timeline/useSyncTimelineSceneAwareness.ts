"use client";

import React from "react";

import type { TimelineSceneAwarenessInput } from "./timelineSceneAwarenessContract.ts";
import { syncTimelineSceneAwareness } from "./timelineSceneAwarenessRuntime.ts";

export type SyncTimelineSceneAwarenessInput = TimelineSceneAwarenessInput;

export function useSyncTimelineSceneAwareness(input: SyncTimelineSceneAwarenessInput): void {
  const sceneJson = input.sceneJson;

  React.useEffect(() => {
    syncTimelineSceneAwareness(input);
  }, [input.selectedObjectId, input.routeObjectId, sceneJson, input.navigationHistoryEntries]);
}

export default useSyncTimelineSceneAwareness;
