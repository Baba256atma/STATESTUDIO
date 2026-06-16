"use client";

import { useSyncExternalStore } from "react";

import {
  getScenarioWorkspaceState,
  getScenarioWorkspaceStateServerSnapshot,
  subscribeScenarioWorkspaceState,
} from "./scenarioWorkspaceStateRuntime.ts";
import { buildScenarioWorkspaceViewFromState } from "./scenarioWorkspaceStateViewMapper.ts";
import type { ScenarioWorkspaceState } from "./scenarioWorkspaceStateContract.ts";
import type { ScenarioWorkspaceView } from "./scenarioWorkspaceContract.ts";

export function useScenarioWorkspaceState(): ScenarioWorkspaceState {
  return useSyncExternalStore(
    subscribeScenarioWorkspaceState,
    getScenarioWorkspaceState,
    getScenarioWorkspaceStateServerSnapshot
  );
}

export function useScenarioWorkspaceView(): ScenarioWorkspaceView {
  const state = useScenarioWorkspaceState();
  return buildScenarioWorkspaceViewFromState(state);
}

export default useScenarioWorkspaceState;
