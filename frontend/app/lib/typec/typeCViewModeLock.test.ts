import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  armTypeCViewModeLock,
  isTypeCViewModeLocked,
  normalizeWorkspaceViewModeForTypeC,
  resetTypeCViewModeLockForTests,
  shouldHideTypeCViewModeToggle,
} from "./typeCViewModeLock";
import {
  getWorkspaceViewMode,
  resetWorkspaceViewModeRuntimeForTests,
  setWorkspaceViewMode,
  toggleWorkspaceViewMode,
} from "../workspace/workspaceViewModeRuntime";

describe("typeCViewModeLock", () => {
  beforeEach(() => {
    resetTypeCViewModeLockForTests();
    resetWorkspaceViewModeRuntimeForTests();
    vi.restoreAllMocks();
  });

  it("normalizes 2D requests back to 3D when locked", () => {
    armTypeCViewModeLock();
    const normalized = normalizeWorkspaceViewModeForTypeC({ mode: "2D", source: "toolbar" });
    expect(normalized.mode).toBe("3D");
    expect(normalized.blocked).toBe(true);
    expect(normalized.source).toContain("type_c_locked_to_executive_3d");
  });

  it("keeps 3D requests unchanged when locked", () => {
    armTypeCViewModeLock();
    const normalized = normalizeWorkspaceViewModeForTypeC({ mode: "3D", source: "type_c_default_3d" });
    expect(normalized.mode).toBe("3D");
    expect(normalized.blocked).toBe(false);
  });

  it("blocks workspace toggle while locked", () => {
    armTypeCViewModeLock();
    setWorkspaceViewMode("3D", "type_c_default_3d");
    toggleWorkspaceViewMode("toolbar");
    expect(getWorkspaceViewMode()).toBe("3D");
  });

  it("ignores 2D set attempts while locked", () => {
    armTypeCViewModeLock();
    setWorkspaceViewMode("3D", "type_c_default_3d");
    setWorkspaceViewMode("2D", "toolbar");
    expect(getWorkspaceViewMode()).toBe("3D");
  });

  it("hides view mode toggle only when locked", () => {
    expect(shouldHideTypeCViewModeToggle()).toBe(false);
    armTypeCViewModeLock();
    expect(shouldHideTypeCViewModeToggle()).toBe(true);
    expect(isTypeCViewModeLocked()).toBe(true);
  });

  it("logs lock diagnostic once", () => {
    armTypeCViewModeLock();
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    setWorkspaceViewMode("2D", "toolbar");
    setWorkspaceViewMode("2D", "toolbar");
    const logs = infoSpy.mock.calls.filter((call) => call[0] === "[Nexora][TypeCViewModeLock]");
    expect(logs).toHaveLength(1);
  });
});
