import { describe, expect, it, beforeEach } from "vitest";

import {
  dashboardModeLabel,
  resetMainRightPanelStateContractForTests,
  resolveMainRightPanelPresentation,
} from "./mainRightPanelStateContract";

describe("mainRightPanelStateContract", () => {
  beforeEach(() => {
    resetMainRightPanelStateContractForTests();
  });

  it("defaults to dashboard overview", () => {
    const state = resolveMainRightPanelPresentation({});
    expect(state.activeTab).toBe("dashboard");
    expect(state.dashboardMode).toBe("overview");
  });

  it("normalizes invalid tab to dashboard", () => {
    const state = resolveMainRightPanelPresentation({ activeTab: "timeline" });
    expect(state.activeTab).toBe("dashboard");
  });

  it("preserves assistant tab", () => {
    const state = resolveMainRightPanelPresentation({ activeTab: "assistant" });
    expect(state.activeTab).toBe("assistant");
  });

  it("labels dashboard runtime modes for placeholder UI", () => {
    expect(dashboardModeLabel("war_room")).toBe("War Room");
    expect(dashboardModeLabel("analyze")).toBe("Analyze");
  });
});
