import { describe, expect, it, beforeEach } from "vitest";

import { resolveSceneHudZoneContract } from "../scene/sceneHudZoneContract.ts";
import {
  resolveHudAuditVerdict,
  HUD_AUDIT_PORTAL_HOST_REGISTRY,
  HUD_AUDIT_ZONE_DEFINITIONS,
} from "./hudZoneContractAudit.ts";
import {
  auditHudZoneContract,
  resetHudZoneAuditForTests,
  runHudZoneContractAudit,
} from "./hudZoneAuditRuntime.ts";
import { buildHudZoneAuditReport } from "./hudZoneAuditReportBuilder.ts";

function desktopContract(overrides: Record<string, unknown> = {}) {
  return resolveSceneHudZoneContract({
    viewportWidth: 1440,
    viewportHeight: 900,
    sceneWidth: 900,
    sceneHeight: 800,
    scenePanelVisible: true,
    timelineVisible: true,
    topBarVisible: true,
    mainRightPanelWidth: 430,
    mainRightPanelVisible: true,
    ...overrides,
  });
}

describe("hudZoneContractAudit", () => {
  beforeEach(() => {
    resetHudZoneAuditForTests();
  });

  it("defines all six audit zones A–F", () => {
    expect(Object.keys(HUD_AUDIT_ZONE_DEFINITIONS).sort()).toEqual(["A", "B", "C", "D", "E", "F"]);
  });

  it("registers all required portal hosts", () => {
    const ids = HUD_AUDIT_PORTAL_HOST_REGISTRY.map((entry) => entry.id);
    expect(ids).toContain("nexora-right-panel-root");
    expect(ids).toContain("nexora-visible-mrp-host");
    expect(ids).toContain("nexora-object-panel-host");
  });

  it("returns PASS when no overlaps or hidden hosts", () => {
    expect(
      resolveHudAuditVerdict({
        overlapDetected: false,
        hiddenHostDetected: false,
        visibleOverlapCount: 0,
        contractMrpOverlapDetected: false,
        safeZoneViolationCount: 0,
      })
    ).toBe("pass");
  });

  it("returns FAIL when visible overlaps exist", () => {
    expect(
      resolveHudAuditVerdict({
        overlapDetected: true,
        hiddenHostDetected: false,
        visibleOverlapCount: 1,
        contractMrpOverlapDetected: false,
        safeZoneViolationCount: 0,
      })
    ).toBe("fail");
  });

  it("returns WARNING for contract MRP overlap without visible collision", () => {
    expect(
      resolveHudAuditVerdict({
        overlapDetected: true,
        hiddenHostDetected: false,
        visibleOverlapCount: 0,
        contractMrpOverlapDetected: true,
        safeZoneViolationCount: 1,
      })
    ).toBe("warning");
  });
});

describe("hudZoneAuditRuntime acceptance scenarios", () => {
  beforeEach(() => {
    resetHudZoneAuditForTests();
  });

  it("Test 1 — fresh load desktop executive layout", () => {
    const contract = desktopContract();
    const result = runHudZoneContractAudit({ sceneHudContract: contract, useVisibleMrpHost: true });
    expect(result.auditId).toBe("MRP_HUD:10:1");
    expect(result.zones).toHaveLength(6);
    expect(result.contractMrpOverlapDetected).toBe(false);
    expect(result.verdict).not.toBe("fail");
  });

  it("Test 2 — dashboard mode contract", () => {
    const result = runHudZoneContractAudit({
      sceneHudContract: desktopContract(),
      activeMrpTab: "dashboard",
      useVisibleMrpHost: true,
    });
    expect(result.notes.some((note) => note.includes("dashboard"))).toBe(true);
    expect(result.contractOverlapDetected).toBe(false);
  });

  it("Test 3 — assistant mode contract", () => {
    const result = runHudZoneContractAudit({
      sceneHudContract: desktopContract(),
      activeMrpTab: "assistant",
      useVisibleMrpHost: true,
    });
    expect(result.notes.some((note) => note.includes("assistant"))).toBe(true);
  });

  it("Test 4 — object selection does not move timeline zone height", () => {
    const compact = desktopContract({ objectPanelExpanded: false });
    const expanded = desktopContract({ objectPanelExpanded: true });
    expect(compact.timelineZone.top).toEqual(expanded.timelineZone.top);
    expect(compact.timelineZone.height).toEqual(expanded.timelineZone.height);
    const audit = runHudZoneContractAudit({ sceneHudContract: expanded });
    const timeline = audit.zones.find((zone) => zone.zoneId === "D");
    expect(timeline?.label).toContain("Timeline");
  });

  it("Test 5 — timeline visible reserves bottom safe zone", () => {
    const contract = desktopContract({ timelineVisible: true });
    expect(contract.timelineZone.height).toBeGreaterThan(0);
    const result = runHudZoneContractAudit({ sceneHudContract: contract });
    expect(result.contractOverlapDetected).toBe(false);
  });

  it("Test 6 — window resize enforces object panel safe zone on viewport fallback", () => {
    const contract = resolveSceneHudZoneContract({
      viewportWidth: 1440,
      viewportHeight: 900,
      mainRightPanelWidth: 430,
      mainRightPanelVisible: true,
    });
    expect(contract.mrpOverlapDetected).toBe(false);
    const result = runHudZoneContractAudit({ sceneHudContract: contract });
    expect(result.verdict).not.toBe("fail");
  });

  it("Test 7 — multiple object panel widths stay inside scene bound", () => {
    for (const expanded of [false, true]) {
      const contract = desktopContract({ objectPanelExpanded: expanded });
      expect(contract.objectPanelZone.left + contract.objectPanelZone.width).toBeLessThanOrEqual(
        contract.sceneWidth
      );
    }
  });

  it("Test 8 — repeated audit is signature-deduped", () => {
    const contract = desktopContract();
    const first = auditHudZoneContract({ sceneHudContract: contract });
    const second = auditHudZoneContract({ sceneHudContract: contract });
    expect(first.timestamp).toBe(second.timestamp);
  });
});

describe("hudZoneAuditReportBuilder", () => {
  it("produces all required report sections", () => {
    const result = runHudZoneContractAudit({
      sceneHudContract: desktopContract(),
      useVisibleMrpHost: true,
    });
    const report = buildHudZoneAuditReport(result);
    expect(report).toContain("## Zone Inventory");
    expect(report).toContain("## Visible Runtime Layout");
    expect(report).toContain("## Hidden Runtime Hosts");
    expect(report).toContain("## Portal Inventory");
    expect(report).toContain("## Overlap Inventory");
    expect(report).toContain("## HUD Brake Inventory");
    expect(report).toContain("## Safe Zone Violations");
    expect(report).toContain("## Recommended Fix Order");
    expect(report).toContain("## Risk Assessment");
    expect(report).toContain("## Audit Verdict");
  });
});
