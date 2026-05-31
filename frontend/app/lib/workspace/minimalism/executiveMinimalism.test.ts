import { describe, expect, it, beforeEach } from "vitest";

import { resetAuditedResolveForTests } from "../../audit/auditedResolve";
import {
  auditExecutiveMinimalism,
  getInformationOwner,
  resolveAttentionTier,
  resolveExecutiveEmptyState,
  resolveExecutiveLabelReduction,
  resolveTopBarPriority,
  shouldHideDuplicateInformation,
  resetExecutiveMinimalismInstrumentationForTests,
} from "./index";

describe("executive minimalism runtimes", () => {
  beforeEach(() => {
    resetAuditedResolveForTests();
    resetExecutiveMinimalismInstrumentationForTests();
  });

  it("assigns canonical information owners", () => {
    expect(getInformationOwner("decision_status")).toBe("command_bar");
    expect(getInformationOwner("selected_object")).toBe("object_info");
    expect(getInformationOwner("current_view")).toBe("scene_info");
  });

  it("flags duplicate readiness on status hud when command bar is visible", () => {
    expect(
      shouldHideDuplicateInformation("readiness", {
        surface: "status_hud",
        commandBarVisible: true,
        statusHudVisible: true,
      })
    ).toBe(true);
  });

  it("keeps readiness on command bar", () => {
    expect(
      shouldHideDuplicateInformation("readiness", {
        surface: "command_bar",
        commandBarVisible: true,
      })
    ).toBe(false);
  });

  it("resolves top bar overflow for compact executive surface", () => {
    const snapshot = resolveTopBarPriority({
      viewportWidth: 1024,
      quickActionsVisible: true,
      statusHudVisible: true,
    });
    expect(snapshot.primaryBlocks).toContain("decision");
    expect(snapshot.overflowItems).toContain("readiness");
    expect(snapshot.showInlineActions).toBe(false);
    expect(snapshot.showMiniInsight).toBe(false);
  });

  it("audits visible and redundant elements", () => {
    const report = auditExecutiveMinimalism({
      commandBarVisible: true,
      statusHudVisible: true,
      sceneInfoVisible: true,
    });
    expect(report.visibleElements.length).toBeGreaterThan(0);
    expect(report.duplicateElements.some((entry) => entry.id === "status_hud_frsi")).toBe(true);
  });

  it("resolves executive empty states", () => {
    expect(resolveExecutiveEmptyState("no_selection")).toContain("Select");
    expect(resolveExecutiveEmptyState("unknown")).toBe("Assessment Pending");
    expect(resolveExecutiveEmptyState("loading")).toBe("Monitoring Ready");
  });

  it("assigns attention hierarchy tiers", () => {
    expect(resolveAttentionTier("selected_object")).toBe("PRIMARY");
    expect(resolveAttentionTier("timeline")).toBe("SECONDARY");
    expect(resolveAttentionTier("decorative_glow")).toBe("BACKGROUND");
  });

  it("reduces label visibility for low-priority objects at density", () => {
    const state = resolveExecutiveLabelReduction({
      objectCount: 48,
      selected: false,
      focused: false,
      isConnected: false,
    });
    expect(state.priorityRank).toBe(5);
    expect(state.visible).toBe(false);
  });
});
