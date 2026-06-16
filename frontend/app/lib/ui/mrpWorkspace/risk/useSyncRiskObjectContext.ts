"use client";

import React from "react";

import { useMrpContextStoreSnapshot } from "../../mrpContext/useMrpContextHeader.ts";
import type { RiskObjectContextInput } from "./riskObjectContextContract.ts";
import { syncRiskObjectContextFromMrpSnapshot } from "./riskObjectContextRuntime.ts";

export type SyncRiskObjectContextInput = RiskObjectContextInput;

export function useSyncRiskObjectContext(input: SyncRiskObjectContextInput): void {
  const mrpSnapshot = useMrpContextStoreSnapshot();
  const sceneJson = input.sceneJson;

  React.useEffect(() => {
    syncRiskObjectContextFromMrpSnapshot(mrpSnapshot, input);
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

export default useSyncRiskObjectContext;
