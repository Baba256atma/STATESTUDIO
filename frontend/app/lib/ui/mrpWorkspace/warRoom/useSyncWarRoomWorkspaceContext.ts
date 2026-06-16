"use client";

import React from "react";

import { useMrpContextStoreSnapshot } from "../../mrpContext/useMrpContextHeader.ts";
import type { WarRoomWorkspaceContextInput } from "./warRoomWorkspaceContextContract.ts";
import { syncWarRoomWorkspaceContextFromMrpSnapshot } from "./warRoomWorkspaceContextRuntime.ts";

export type SyncWarRoomWorkspaceContextInput = WarRoomWorkspaceContextInput;

export function useSyncWarRoomWorkspaceContext(
  input: SyncWarRoomWorkspaceContextInput
): void {
  const mrpSnapshot = useMrpContextStoreSnapshot();

  React.useEffect(() => {
    syncWarRoomWorkspaceContextFromMrpSnapshot(mrpSnapshot, input);
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

export default useSyncWarRoomWorkspaceContext;
