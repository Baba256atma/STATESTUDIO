"use client";

import React from "react";

import { syncScenarioComparison } from "./scenarioComparisonRuntime.ts";
import { useScenarioWorkspaceState } from "./useScenarioWorkspaceState.ts";

export function useSyncScenarioComparison(): void {
  const state = useScenarioWorkspaceState();

  React.useEffect(() => {
    if (state.phase === "loading") return;
    syncScenarioComparison();
  }, [state.phase, state.revision, state.generatedScenarios]);
}

export default useSyncScenarioComparison;
