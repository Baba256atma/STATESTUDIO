"use client";

import React from "react";

import { useMrpContextStoreSnapshot } from "../../mrpContext/useMrpContextHeader.ts";
import type { AdvisoryWorkspaceContextInput } from "./advisoryWorkspaceContextContract.ts";
import { syncAdvisoryWorkspaceContextFromMrpSnapshot } from "./advisoryWorkspaceContextRuntime.ts";

export type SyncAdvisoryWorkspaceContextInput = AdvisoryWorkspaceContextInput;

export function useSyncAdvisoryWorkspaceContext(
  input: SyncAdvisoryWorkspaceContextInput
): void {
  const mrpSnapshot = useMrpContextStoreSnapshot();

  React.useEffect(() => {
    syncAdvisoryWorkspaceContextFromMrpSnapshot(mrpSnapshot, input);
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

export default useSyncAdvisoryWorkspaceContext;
