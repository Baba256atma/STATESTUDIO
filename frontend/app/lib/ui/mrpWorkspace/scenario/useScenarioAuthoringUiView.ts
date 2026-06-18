"use client";

import { useSyncExternalStore } from "react";

import {
  getScenarioAuthoringUiServerSnapshot,
  getScenarioAuthoringUiView,
  subscribeScenarioAuthoringUi,
} from "./scenarioAuthoringUiRuntime.ts";
import type { ScenarioAuthoringUiView } from "./scenarioAuthoringUiContract.ts";

export function useScenarioAuthoringUiView(): ScenarioAuthoringUiView {
  return useSyncExternalStore(
    subscribeScenarioAuthoringUi,
    getScenarioAuthoringUiView,
    getScenarioAuthoringUiServerSnapshot
  );
}

export default useScenarioAuthoringUiView;
