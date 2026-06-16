"use client";

import React from "react";

import { useMrpContextStoreSnapshot } from "../../mrpContext/useMrpContextHeader.ts";
import type { RiskWorkspaceDataInput } from "./riskWorkspaceMetricsContract.ts";
import { syncRiskWorkspaceDataFromMrpSnapshot } from "./riskWorkspaceDataRuntime.ts";

export type SyncRiskWorkspaceDataInput = RiskWorkspaceDataInput;

export function useSyncRiskWorkspaceData(input: SyncRiskWorkspaceDataInput): void {
  const mrpSnapshot = useMrpContextStoreSnapshot();
  const sceneJson = input.sceneJson;

  React.useEffect(() => {
    syncRiskWorkspaceDataFromMrpSnapshot(mrpSnapshot, input);
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
  ]);
}

export default useSyncRiskWorkspaceData;
