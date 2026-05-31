import { describe, expect, it, beforeEach } from "vitest";

import {
  auditExecutiveTypographyScale,
  auditExecutiveUxConsistency,
  auditExecutiveVocabulary,
  canPerformPanelBehavior,
  harmonizeExecutiveVocabulary,
  resolveExecutiveControlButtonStyle,
  resolveExecutiveHarmonizationSnapshot,
  resolveExecutiveIcon,
  resolveExecutiveStatusFromPriority,
  resolveExecutiveTypography,
  resolveExecutiveVocabulary,
  resolvePanelBehaviorContract,
  resolveExecutiveMotion,
  resetExecutiveHarmonizationInstrumentationForTests,
  TYPE_C_WORKSPACE_IDENTITY_CONTRACT,
  verifyDayNightHarmonizationParity,
} from "./index";
import { resolveSceneThemeTokens } from "../../theme/sceneThemeTokens";

describe("executive harmonization runtimes", () => {
  beforeEach(() => {
    resetExecutiveHarmonizationInstrumentationForTests();
  });

  it("audits UX consistency and groups findings", () => {
    const report = auditExecutiveUxConsistency({
      surfaces: ["sceneInfoHud", "objectInfoHud", "timelineHud", "executiveStatusHud", "commandBar"],
      themeMode: "night",
      commandBarVisible: true,
      statusHudVisible: true,
      sceneInfoVisible: true,
      objectInfoVisible: true,
      timelineVisible: true,
      assistantVisible: true,
      quickActionsVisible: true,
      usesLegacyShellWithoutSurface: ["timelineHud"],
      mixedVocabularyHits: ["Experiment"],
    });
    expect(report.legacyPatterns.length).toBeGreaterThan(0);
    expect(report.inconsistencies.length).toBeGreaterThan(0);
    expect(report.score).toBeLessThan(100);
  });

  it("resolves canonical executive vocabulary", () => {
    expect(resolveExecutiveVocabulary("Experiment")).toBe("Scenario");
    expect(harmonizeExecutiveVocabulary("Run Analysis on supplier Experiment")).toContain("Scenario");
    expect(auditExecutiveVocabulary("Run an Experiment")).toContain("Experiment");
  });

  it("standardizes interaction button styles", () => {
    const tokens = resolveSceneThemeTokens("night");
    const style = resolveExecutiveControlButtonStyle(tokens, "disabled");
    expect(style.opacity).toBeLessThan(1);
    expect(style.cursor).toBe("not-allowed");
  });

  it("defines predictable panel behavior contracts", () => {
    const timeline = resolvePanelBehaviorContract("timelineHud");
    expect(timeline.supportsCollapse).toBe(true);
    expect(canPerformPanelBehavior("commandBar", "pin")).toBe(true);
    expect(canPerformPanelBehavior("commandBar", "collapse")).toBe(false);
  });

  it("unifies typography roles with scanning-friendly scales", () => {
    const metric = resolveExecutiveTypography("metric");
    expect(metric.fontSize).toBe(14);
    expect(auditExecutiveTypographyScale(17)).toBe(true);
    expect(auditExecutiveTypographyScale(20)).toBe(false);
  });

  it("resolves unified icon descriptors", () => {
    const icon = resolveExecutiveIcon("status_critical");
    expect(icon?.glyph).toBe("◉");
    expect(icon?.kind).toBe("status");
  });

  it("presents status consistently from priority semantics", () => {
    const tokens = resolveSceneThemeTokens("day");
    const critical = resolveExecutiveStatusFromPriority("critical", tokens);
    expect(critical.kind).toBe("critical");
    expect(critical.dotSizePx).toBe(6);
  });

  it("caps executive motion within subtle bounds", () => {
    const motion = resolveExecutiveMotion("panel");
    expect(motion.durationMs).toBeLessThanOrEqual(320);
  });

  it("verifies day/night surface parity", () => {
    expect(
      verifyDayNightHarmonizationParity([
        "sceneInfoHud",
        "objectInfoHud",
        "timelineHud",
        "executiveStatusHud",
        "commandBar",
        "quickActionsDock",
        "aiAssistant",
      ])
    ).toBe(true);
  });

  it("orchestrates harmonization snapshot with identity contract", () => {
    const snapshot = resolveExecutiveHarmonizationSnapshot({
      surfaces: ["sceneInfoHud", "commandBar"],
      themeMode: "night",
      commandBarVisible: true,
      statusHudVisible: false,
      sceneInfoVisible: true,
      objectInfoVisible: false,
      timelineVisible: false,
      assistantVisible: true,
      quickActionsVisible: false,
    });
    expect(snapshot.identityVersion).toBe(TYPE_C_WORKSPACE_IDENTITY_CONTRACT.version);
    expect(snapshot.audit.surfaces).toContain("sceneInfoHud");
  });
});
