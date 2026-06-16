"use client";

import React from "react";

import { useMrpContextStoreSnapshot } from "../../mrpContext/useMrpContextHeader.ts";
import type { ExecutiveSummaryObjectContextInput } from "./executiveSummaryObjectContextContract.ts";
import { syncExecutiveSummaryObjectContextFromMrpSnapshot } from "./executiveSummaryObjectContextRuntime.ts";

export type SyncExecutiveSummaryObjectContextInput = ExecutiveSummaryObjectContextInput;

export function useSyncExecutiveSummaryObjectContext(
  input: SyncExecutiveSummaryObjectContextInput
): void {
  const mrpSnapshot = useMrpContextStoreSnapshot();

  React.useEffect(() => {
    syncExecutiveSummaryObjectContextFromMrpSnapshot(mrpSnapshot, input);
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

export default useSyncExecutiveSummaryObjectContext;
