"use client";

import React from "react";

import { syncScenarioProjection } from "./scenarioProjectionRuntime.ts";
import { useScenarioWorkspaceState } from "./useScenarioWorkspaceState.ts";

export function useSyncScenarioProjection(): void {
  const state = useScenarioWorkspaceState();

  React.useEffect(() => {
    if (state.phase === "loading") return;
    syncScenarioProjection();
  }, [
    state.phase,
    state.revision,
    state.generatedScenarios,
    state.comparisonMatrix,
    state.workspaceContext.projectionHorizon,
  ]);
}

export default useSyncScenarioProjection;
