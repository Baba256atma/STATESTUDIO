import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  focusObject,
  requestCameraPreset,
  requestGlobalSceneReset,
  requestSceneNavigationAction,
  requestSceneNavigationMode,
} from "./sceneNavigationContract";
import { resetGlobalSceneResetRuntimeForTests } from "./navigation/globalSceneResetRuntime";
import {
  getSceneNavigationMode,
  getSelectedCameraPresetId,
  resetSceneNavigationStoreForTests,
} from "./sceneNavigationStore";
import { resetSceneNavigationInstrumentationForTests } from "../ui/sceneNavigationInstrumentation";
import { resolveSceneNavigationToolbarPlacement } from "./sceneNavigationPlacement";
import { EXECUTIVE_SCENE_HUD_GRID } from "./executiveSceneHudGrid";
import { resolveWorkspaceLayoutContract } from "../ui/workspaceLayoutController";
import { ensureBrowserLocalStorageHarness } from "../test-harness/browserLocalStorageHarness.ts";

describe("sceneNavigationContract", () => {
  beforeEach(() => {
    resetSceneNavigationStoreForTests();
    resetSceneNavigationInstrumentationForTests();
    resetGlobalSceneResetRuntimeForTests();
    ensureBrowserLocalStorageHarness({ includeEventDispatch: true });
    vi.spyOn(window, "dispatchEvent").mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("routes navigation mode and preset through the store", () => {
    requestSceneNavigationMode("orbit", "toolbar");
    requestCameraPreset("risk", "toolbar");
    expect(getSceneNavigationMode()).toBe("orbit");
    expect(getSelectedCameraPresetId()).toBe("risk");
  });

  it("dispatches centralized focus requests", () => {
    focusObject("node-1", "assistant");
    expect(window.dispatchEvent).toHaveBeenCalled();
    const event = vi.mocked(window.dispatchEvent).mock.calls.at(-1)?.[0] as CustomEvent;
    expect(event.type).toBe("nexora:scene-navigation-focus");
    expect(event.detail.objectId).toBe("node-1");
  });

  it("maps legacy fit action to fit_scene", () => {
    requestSceneNavigationAction("fit_scene", "legacy");
    const event = vi.mocked(window.dispatchEvent).mock.calls.at(-1)?.[0] as CustomEvent;
    expect(event.type).toBe("nexora:scene-navigation-action");
    expect(event.detail.action).toBe("fit_scene");
  });

  it("dispatches global reset with monotonic generation", () => {
    requestGlobalSceneReset("panel");
    const first = vi.mocked(window.dispatchEvent).mock.calls.at(-1)?.[0] as CustomEvent;
    expect(first.type).toBe("nexora:scene-navigation-preset");
    expect(first.detail.presetId).toBe("global");
    expect(first.detail.resetGeneration).toBe(1);

    requestGlobalSceneReset("panel");
    const second = vi.mocked(window.dispatchEvent).mock.calls.at(-1)?.[0] as CustomEvent;
    expect(second.detail.resetGeneration).toBe(2);
  });
});

describe("sceneNavigationPlacement", () => {
  it("places top-center toolbar on the E2:57 unified top baseline", () => {
    const contract = resolveWorkspaceLayoutContract("analysis", 1280);
    // Pre-unification fixture: a top-docked timeline must not displace the toolbar.
    // E2:21/E2:57 keep the toolbar on EXECUTIVE_SCENE_HUD_GRID.topMargin with peer HUDs.
    contract.hud.timelineHud = {
      ...contract.hud.timelineHud,
      bottom: undefined,
      top: 12,
      left: "50%",
      transform: "translateX(-50%)",
    };
    const style = resolveSceneNavigationToolbarPlacement(contract);
    expect(style.top).toBe(EXECUTIVE_SCENE_HUD_GRID.topMargin);
    expect(style.left).toBe("50%");
  });
});
