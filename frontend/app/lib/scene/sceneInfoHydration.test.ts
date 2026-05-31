import { describe, expect, it, beforeEach } from "vitest";

import { resetPanelGovernanceRuntimeForTests, setPanelCollapseState } from "../workspace/panelGovernanceRuntime";
import { DEFAULT_SCENE_INFO_STATE } from "./sceneInfoInitialState";
import { resetSceneInfoHydrationLogsForTests } from "./sceneInfoHydrationContract";
import {
  getSceneInfoSSRInitialCollapsed,
  hydrateSceneInfoCollapseState,
  loadSceneInfoCollapsePreference,
  persistSceneInfoCollapsePreference,
} from "./sceneInfoPreferenceRuntime";

describe("sceneInfoPreferenceRuntime", () => {
  beforeEach(() => {
    resetPanelGovernanceRuntimeForTests();
    resetSceneInfoHydrationLogsForTests();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("nexora:panel-governance");
    }
  });

  it("uses expanded SSR initial state", () => {
    expect(getSceneInfoSSRInitialCollapsed()).toBe(false);
    expect(DEFAULT_SCENE_INFO_STATE.collapsed).toBe(false);
  });

  it("loads persisted collapse preference after hydration", () => {
    persistSceneInfoCollapsePreference(true);
    expect(loadSceneInfoCollapsePreference()).toBe(true);
    const hydrated = hydrateSceneInfoCollapseState();
    expect(hydrated.collapsed).toBe(true);
    expect(hydrated.storedPreference).toBe(true);
  });

  it("defaults to expanded when no preference exists", () => {
    expect(loadSceneInfoCollapsePreference()).toBe(false);
  });
});
