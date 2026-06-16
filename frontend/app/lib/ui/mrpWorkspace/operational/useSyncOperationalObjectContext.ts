"use client";

import React from "react";

import { useMrpContextStoreSnapshot } from "../../mrpContext/useMrpContextHeader.ts";
import type { OperationalObjectContextInput } from "./operationalObjectContextContract.ts";
import { syncOperationalObjectContextFromMrpSnapshot } from "./operationalObjectContextRuntime.ts";

export type SyncOperationalObjectContextInput = OperationalObjectContextInput;

export function useSyncOperationalObjectContext(
  input: SyncOperationalObjectContextInput
): void {
  const mrpSnapshot = useMrpContextStoreSnapshot();

  React.useEffect(() => {
    syncOperationalObjectContextFromMrpSnapshot(mrpSnapshot, input);
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

export default useSyncOperationalObjectContext;
