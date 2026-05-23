import { describe, expect, it } from "vitest";

import {
  EXECUTIVE_RIGHT_ASSISTANT_COLLAPSED_PX,
  EXECUTIVE_RIGHT_ASSISTANT_WIDTH_PX,
  EXECUTIVE_RIGHT_DOCK_COLLAPSED_PX,
  EXECUTIVE_RIGHT_DOCK_WIDTH_PX,
  executiveDockInsetRatios,
  resolveExecutiveWorkspaceBreakpoint,
  resolveExecutiveWorkspaceLayoutMetrics,
} from "./executiveWorkspaceLayout";

describe("executiveWorkspaceLayout", () => {
  it("resolves breakpoints from viewport width", () => {
    expect(resolveExecutiveWorkspaceBreakpoint(800)).toBe("mobile");
    expect(resolveExecutiveWorkspaceBreakpoint(1100)).toBe("tablet");
    expect(resolveExecutiveWorkspaceBreakpoint(1400)).toBe("compactDesktop");
    expect(resolveExecutiveWorkspaceBreakpoint(1800)).toBe("wideDesktop");
  });

  it("tightens right dock on tablet widths", () => {
    const metrics = resolveExecutiveWorkspaceLayoutMetrics(1100);
    expect(metrics.rightDockWidthPx).toBeLessThan(EXECUTIVE_RIGHT_DOCK_WIDTH_PX);
  });

  it("uses collapsed right dock width when object panel is collapsed", () => {
    const metrics = resolveExecutiveWorkspaceLayoutMetrics(1440, { rightDockExpanded: false });
    expect(metrics.rightDockWidthPx).toBe(EXECUTIVE_RIGHT_DOCK_COLLAPSED_PX);
  });

  it("removes left scene dock width when HUD replaces sidebar", () => {
    const metrics = resolveExecutiveWorkspaceLayoutMetrics(1440, { leftSceneDockVisible: false });
    expect(metrics.leftDockWidthPx).toBe(0);
  });

  it("removes right object dock width when HUD replaces sidebar", () => {
    const metrics = resolveExecutiveWorkspaceLayoutMetrics(1440, { rightObjectDockVisible: false });
    expect(metrics.rightDockWidthPx).toBe(0);
  });

  it("uses executive assistant width when right assistant is visible", () => {
    const metrics = resolveExecutiveWorkspaceLayoutMetrics(1440, {
      rightAssistantVisible: true,
      rightAssistantExpanded: true,
      rightObjectDockVisible: false,
    });
    expect(metrics.rightDockWidthPx).toBe(EXECUTIVE_RIGHT_ASSISTANT_WIDTH_PX);
  });

  it("uses collapsed assistant rail width when assistant is collapsed", () => {
    const metrics = resolveExecutiveWorkspaceLayoutMetrics(1440, {
      rightAssistantVisible: true,
      rightAssistantExpanded: false,
    });
    expect(metrics.rightDockWidthPx).toBe(EXECUTIVE_RIGHT_ASSISTANT_COLLAPSED_PX);
  });

  it("removes left command width when left command is hidden", () => {
    const metrics = resolveExecutiveWorkspaceLayoutMetrics(1440, {
      leftCommandVisible: false,
      leftCommandOpen: true,
    });
    expect(metrics.leftCommandWidthPx).toBe(0);
  });

  it("derives dock inset ratios for camera framing", () => {
    const metrics = resolveExecutiveWorkspaceLayoutMetrics(1440, { leftCommandOpen: false });
    const insets = executiveDockInsetRatios(metrics);
    expect(insets.leftDockInsetRatio).toBeGreaterThan(0.05);
    expect(insets.rightDockInsetRatio).toBeGreaterThan(0.1);
  });
});
