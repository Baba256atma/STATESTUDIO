"use client";

import React from "react";

import type { OperationalObjectContext } from "./operationalObjectContextContract.ts";
import { syncOperationalSceneAwarenessFromObjectContext } from "./operationalSceneAwarenessRuntime.ts";

export function useSyncOperationalSceneAwareness(
  objectContext: OperationalObjectContext
): void {
  React.useEffect(() => {
    syncOperationalSceneAwarenessFromObjectContext(objectContext);
  }, [
    objectContext.selectedObjectId,
    objectContext.selectedObject,
    objectContext.objectOperationalStatus,
    objectContext.objectActivityLevel,
    objectContext.objectAttentionPriority,
    objectContext.hasSelection,
  ]);
}

export default useSyncOperationalSceneAwareness;
