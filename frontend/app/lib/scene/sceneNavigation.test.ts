import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  focusObject,
  requestCameraPreset,
  requestSceneNavigationAction,
  requestSceneNavigationMode,
} from "./sceneNavigationContract";
import {
  getSceneNavigationMode,
  getSelectedCameraPresetId,
  resetSceneNavigationStoreForTests,
} from "./sceneNavigationStore";
import { resetSceneNavigationInstrumentationForTests } from "../ui/sceneNavigationInstrumentation";
import { resolveSceneNavigationToolbarPlacement } from "./sceneNavigationPlacement";
import { resolveWorkspaceLayoutContract } from "../ui/workspaceLayoutController";

describe("sceneNavigationContract", () => {
  beforeEach(() => {
    resetSceneNavigationStoreForTests();
    resetSceneNavigationInstrumentationForTests();
    if (typeof globalThis.window === "undefined") {
      (globalThis as typeof globalThis & { window: Window }).window = {
        dispatchEvent: () => true,
      } as unknown as Window;
    }
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
});

describe("sceneNavigationPlacement", () => {
  it("offsets top-center toolbar when top-docked HUDs are visible", () => {
    const contract = resolveWorkspaceLayoutContract("analysis", 1280);
    contract.hud.timelineHud = {
      ...contract.hud.timelineHud,
      bottom: undefined,
      top: 12,
      left: "50%",
      transform: "translateX(-50%)",
    };
    const style = resolveSceneNavigationToolbarPlacement(contract);
    expect(style.top).toBeGreaterThan(12);
    expect(style.left).toBe("50%");
  });
});
