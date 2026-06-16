"use client";

import React from "react";

import { useMrpContextStoreSnapshot } from "../../mrpContext/useMrpContextHeader.ts";
import type { ScenarioWorkspaceContextInput } from "./scenarioWorkspaceContextContract.ts";
import { syncScenarioWorkspaceContextFromMrpSnapshot } from "./scenarioWorkspaceContextRuntime.ts";

export type SyncScenarioWorkspaceContextInput = ScenarioWorkspaceContextInput;

export function useSyncScenarioWorkspaceContext(
  input: SyncScenarioWorkspaceContextInput
): void {
  const mrpSnapshot = useMrpContextStoreSnapshot();

  React.useEffect(() => {
    syncScenarioWorkspaceContextFromMrpSnapshot(mrpSnapshot, input);
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
  ]);
}

export default useSyncScenarioWorkspaceContext;
