"use client";

import React from "react";

import { useMrpContextStoreSnapshot } from "../../mrpContext/useMrpContextHeader.ts";
import {
  syncGovernanceWorkspaceContext,
  type GovernanceWorkspaceContextInput,
} from "./governanceWorkspaceState.ts";

export type SyncGovernanceWorkspaceContextInput = GovernanceWorkspaceContextInput;

export function useSyncGovernanceWorkspaceContext(
  input: SyncGovernanceWorkspaceContextInput
): void {
  const mrpSnapshot = useMrpContextStoreSnapshot();

  React.useEffect(() => {
    syncGovernanceWorkspaceContext(mrpSnapshot, input);
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

export default useSyncGovernanceWorkspaceContext;
