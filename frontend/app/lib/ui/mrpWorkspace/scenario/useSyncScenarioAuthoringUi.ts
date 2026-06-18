"use client";

import React from "react";

import { useMrpContextStoreSnapshot } from "../../mrpContext/useMrpContextHeader.ts";
import { syncScenarioAuthoringUi } from "./scenarioAuthoringUiRuntime.ts";
import type { ScenarioAuthoringUiSyncInput } from "./scenarioAuthoringUiContract.ts";

export function useSyncScenarioAuthoringUi(input: ScenarioAuthoringUiSyncInput = {}): void {
  const mrpSnapshot = useMrpContextStoreSnapshot();

  React.useEffect(() => {
    syncScenarioAuthoringUi({
      selectedObjectId: input.selectedObjectId ?? mrpSnapshot.selectedObjectId,
    });
  }, [input.selectedObjectId, mrpSnapshot.revision, mrpSnapshot.selectedObjectId]);
}

export default useSyncScenarioAuthoringUi;
