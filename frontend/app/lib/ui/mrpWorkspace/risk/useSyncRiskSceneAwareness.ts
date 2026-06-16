"use client";

import React from "react";

import type { RiskSceneAwarenessInput } from "./riskSceneAwarenessContract.ts";
import { syncRiskSceneAwareness } from "./riskSceneAwarenessRuntime.ts";

export type SyncRiskSceneAwarenessInput = RiskSceneAwarenessInput;

export function useSyncRiskSceneAwareness(input: SyncRiskSceneAwarenessInput): void {
  const sceneJson = input.sceneJson;

  React.useEffect(() => {
    syncRiskSceneAwareness(input);
  }, [
    input.selectedObjectId,
    input.routeObjectId,
    sceneJson,
  ]);
}

export default useSyncRiskSceneAwareness;
