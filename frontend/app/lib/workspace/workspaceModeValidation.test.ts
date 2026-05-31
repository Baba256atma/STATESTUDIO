import { describe, expect, it, beforeEach } from "vitest";

import {
  resetWorkspaceViewModeRuntimeForTests,
  setWorkspaceViewMode,
} from "./workspaceViewModeRuntime";
import { clearWorkspaceViewModePreferenceForTests } from "./workspaceViewModePersistence";
import {
  resetWorkspaceModeValidationLogsForTests,
  validateWorkspaceModeActivation,
} from "./workspaceModeValidation";

describe("workspaceModeValidation", () => {
  beforeEach(() => {
    resetWorkspaceViewModeRuntimeForTests();
    clearWorkspaceViewModePreferenceForTests();
    resetWorkspaceModeValidationLogsForTests();
  });

  it("reports store activation when mode changes", () => {
    setWorkspaceViewMode("3D", "test");
    const report = validateWorkspaceModeActivation({
      requestedMode: "3D",
      source: "test",
      sceneSubscribed: true,
      cameraApplied: true,
    });
    expect(report.passed).toBe(true);
    expect(report.currentMode).toBe("3D");
    expect(report.stages).toContain("transition_completed");
  });

  it("flags store mismatch when mode was not applied", () => {
    const report = validateWorkspaceModeActivation({
      requestedMode: "3D",
      source: "test",
      sceneSubscribed: true,
      cameraApplied: false,
    });
    expect(report.passed).toBe(false);
    expect(report.notes.some((note) => note.includes("store_mode_mismatch"))).toBe(true);
  });
});
