import { describe, expect, it, beforeEach } from "vitest";

import {
  getWorkspaceViewMode,
  hydrateWorkspaceViewMode,
  resetWorkspaceViewModeRuntimeForTests,
  setWorkspaceViewMode,
  toggleWorkspaceViewMode,
} from "./workspaceViewModeRuntime";
import { clearWorkspaceViewModePreferenceForTests } from "./workspaceViewModePersistence";
import { DEFAULT_WORKSPACE_VIEW_MODE } from "./workspaceViewModeTypes";
import { resolveExecutiveDefaultCameraForMode } from "./workspaceModeTransitionRuntime";
import { resolveWorkspaceDensityProfile } from "../scene/density/workspaceDensityModeProfiles";

describe("workspaceViewModeRuntime", () => {
  beforeEach(() => {
    resetWorkspaceViewModeRuntimeForTests();
    clearWorkspaceViewModePreferenceForTests();
  });

  it("defaults to 2D on startup", () => {
    expect(getWorkspaceViewMode()).toBe("2D");
    expect(DEFAULT_WORKSPACE_VIEW_MODE).toBe("2D");
  });

  it("toggles between 2D and 3D without destructive side effects", () => {
    expect(getWorkspaceViewMode()).toBe("2D");
    toggleWorkspaceViewMode("test");
    expect(getWorkspaceViewMode()).toBe("3D");
    setWorkspaceViewMode("2D", "test");
    expect(getWorkspaceViewMode()).toBe("2D");
  });

  it("hydrates persisted preference", () => {
    setWorkspaceViewMode("3D", "test");
    resetWorkspaceViewModeRuntimeForTests();
    hydrateWorkspaceViewMode();
    expect(getWorkspaceViewMode()).toBe("3D");
  });

  it("provides dedicated camera defaults per mode", () => {
    const twoD = resolveExecutiveDefaultCameraForMode("2D");
    const threeD = resolveExecutiveDefaultCameraForMode("3D");
    expect(twoD.position[1]).toBeGreaterThan(threeD.position[1]);
    expect(twoD.fov).toBeLessThan(threeD.fov);
  });

  it("provides density profiles per mode", () => {
    expect(resolveWorkspaceDensityProfile("2D").relationshipDensity).toBe("FULL");
    expect(resolveWorkspaceDensityProfile("3D").relationshipDensity).toBe("FOCUSED");
  });
});
