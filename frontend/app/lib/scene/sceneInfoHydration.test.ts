import { describe, expect, it, beforeEach, afterEach } from "vitest";

import { ensureBrowserLocalStorageHarness } from "../test-harness/browserLocalStorageHarness.ts";
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
  let restoreWindow: (() => void) | undefined;

  beforeEach(() => {
    resetPanelGovernanceRuntimeForTests();
    resetSceneInfoHydrationLogsForTests();
    restoreWindow = ensureBrowserLocalStorageHarness();
    window.localStorage.removeItem("nexora:panel-governance");
  });

  afterEach(() => {
    window.localStorage?.removeItem("nexora:panel-governance");
    resetPanelGovernanceRuntimeForTests();
    restoreWindow?.();
    restoreWindow = undefined;
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

  it("no-ops persistence safely when window is absent", () => {
    restoreWindow?.();
    restoreWindow = undefined;
    Reflect.deleteProperty(globalThis, "window");
    resetPanelGovernanceRuntimeForTests();

    persistSceneInfoCollapsePreference(true);
    expect(loadSceneInfoCollapsePreference()).toBe(false);

    restoreWindow = ensureBrowserLocalStorageHarness();
    expect(loadSceneInfoCollapsePreference()).toBe(false);
  });

  it("does not leak collapse state across harness restore cycles", () => {
    persistSceneInfoCollapsePreference(true);
    expect(loadSceneInfoCollapsePreference()).toBe(true);

    restoreWindow?.();
    restoreWindow = ensureBrowserLocalStorageHarness();
    resetPanelGovernanceRuntimeForTests();
    window.localStorage.removeItem("nexora:panel-governance");

    expect(loadSceneInfoCollapsePreference()).toBe(false);
    setPanelCollapseState("sceneInfoHud", "collapsed");
    expect(loadSceneInfoCollapsePreference()).toBe(true);
  });
});
