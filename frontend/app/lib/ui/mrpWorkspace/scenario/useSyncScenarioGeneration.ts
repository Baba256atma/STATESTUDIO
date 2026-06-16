"use client";

import React from "react";

import { useMrpContextStoreSnapshot } from "../../mrpContext/useMrpContextHeader.ts";
import type { ScenarioGenerationDataInput } from "./scenarioGenerationContract.ts";
import { syncScenarioGeneration } from "./scenarioGenerationRuntime.ts";

export type SyncScenarioGenerationInput = ScenarioGenerationDataInput;

export function useSyncScenarioGeneration(input: SyncScenarioGenerationInput): void {
  const mrpSnapshot = useMrpContextStoreSnapshot();

  React.useEffect(() => {
    syncScenarioGeneration({
      selectedObjectId: input.selectedObjectId ?? mrpSnapshot.selectedObjectId,
      selectedObjectLabel: input.selectedObjectLabel ?? mrpSnapshot.header.selectedObject,
      routeObjectId: input.routeObjectId ?? null,
      routeObjectName: input.routeObjectName ?? null,
    });
  }, [
    mrpSnapshot.revision,
    mrpSnapshot.selectedObjectId,
    mrpSnapshot.header.selectedObject,
    input.selectedObjectId,
    input.selectedObjectLabel,
    input.routeObjectId,
    input.routeObjectName,
  ]);
}

export default useSyncScenarioGeneration;
