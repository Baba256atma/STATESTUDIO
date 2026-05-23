import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import {
  buildWorkspaceLayoutSignature,
  resolveWorkspaceLayoutContract,
  resetWorkspaceLayoutTraceStateForTests,
  workspaceHudPlacementStyle,
} from "./workspaceLayoutController";
import {
  logWorkspaceLayoutMounted,
  logWorkspaceLayoutPresetChanged,
  logWorkspaceLayoutRestored,
  resetWorkspaceLayoutInstrumentationForTests,
} from "./workspaceLayoutInstrumentation";
import {
  DEFAULT_WORKSPACE_LAYOUT_PRESET,
  readStoredWorkspaceLayoutPreset,
} from "./workspaceLayoutStore";
import { WORKSPACE_LAYOUT_PRESET_LABELS } from "./workspaceLayoutTypes";

describe("workspaceLayoutStore", () => {
  it("defaults to executive preset", () => {
    expect(DEFAULT_WORKSPACE_LAYOUT_PRESET).toBe("executive");
    expect(readStoredWorkspaceLayoutPreset()).toBe("executive");
  });
});

describe("resolveWorkspaceLayoutContract", () => {
  beforeEach(() => {
    resetWorkspaceLayoutTraceStateForTests();
  });

  it("provides distinct presets while keeping scene HUDs visible", () => {
    const executive = resolveWorkspaceLayoutContract("executive", 1440);
    const analysis = resolveWorkspaceLayoutContract("analysis", 1440);
    const simulation = resolveWorkspaceLayoutContract("simulation", 1440);

    expect(executive.hud.sceneInfoHud.visible).toBe(true);
    expect(analysis.hud.timelineHud.sizeMode).toBe("expanded");
    expect(simulation.rightRailStack.comparisonFlex).toBeGreaterThan(executive.rightRailStack.comparisonFlex);
    expect(analysis.rightRailWidthPx).toBeGreaterThan(executive.rightRailWidthPx);
  });

  it("builds stable signatures per preset", () => {
    const executiveSig = buildWorkspaceLayoutSignature(resolveWorkspaceLayoutContract("executive", 1440));
    const analysisSig = buildWorkspaceLayoutSignature(resolveWorkspaceLayoutContract("analysis", 1440));
    expect(executiveSig).not.toBe(analysisSig);
  });

  it("emits transition-ready HUD placement styles", () => {
    const contract = resolveWorkspaceLayoutContract("executive", 1440);
    const style = workspaceHudPlacementStyle(contract.hud.sceneInfoHud, contract.transitionMs);
    expect(style.position).toBe("absolute");
    expect(style.transition).toContain("180ms");
  });
});

describe("workspaceLayoutInstrumentation", () => {
  beforeEach(() => {
    resetWorkspaceLayoutInstrumentationForTests();
    vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs mount and restore once", () => {
    logWorkspaceLayoutMounted();
    logWorkspaceLayoutMounted();
    logWorkspaceLayoutRestored("executive");
    expect(console.info).toHaveBeenCalledTimes(2);
  });

  it("logs each preset change", () => {
    logWorkspaceLayoutPresetChanged("analysis");
    logWorkspaceLayoutPresetChanged("simulation");
    expect(console.info).toHaveBeenCalledTimes(2);
  });
});

describe("WORKSPACE_LAYOUT_PRESET_LABELS", () => {
  it("labels all presets for the control surface", () => {
    expect(WORKSPACE_LAYOUT_PRESET_LABELS.executive).toBe("Executive");
    expect(WORKSPACE_LAYOUT_PRESET_LABELS.analysis).toBe("Analysis");
    expect(WORKSPACE_LAYOUT_PRESET_LABELS.simulation).toBe("Simulation");
  });
});
