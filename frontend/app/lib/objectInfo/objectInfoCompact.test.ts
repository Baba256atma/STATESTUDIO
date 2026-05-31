import { describe, expect, it } from "vitest";

import { buildExecutiveObjectInfoLayout } from "./executiveObjectInfoLayout";
import { OBJECT_INFO_HIERARCHY } from "./executiveObjectInformationHierarchy";
import { buildExecutiveObjectSummary, EXECUTIVE_OBJECT_SUMMARY_MAX_CHARS } from "./executiveObjectSummaryRuntime";
import {
  DEFAULT_OBJECT_INFO_DISCLOSURE_VIEW,
  isObjectInfoFieldVisible,
  resolveObjectInfoDisclosureLevels,
} from "./objectInfoProgressiveDisclosure";

describe("executiveObjectInformationHierarchy", () => {
  it("defines four hierarchy levels with primary and secondary defaults", () => {
    expect(Object.keys(OBJECT_INFO_HIERARCHY)).toEqual(["PRIMARY", "SECONDARY", "CONTEXT", "ADVANCED"]);
    expect(OBJECT_INFO_HIERARCHY.PRIMARY).toContain("health");
    expect(OBJECT_INFO_HIERARCHY.SECONDARY).toContain("summary");
  });
});

describe("executiveObjectSummaryRuntime", () => {
  it("truncates summaries to executive length", () => {
    const summary = buildExecutiveObjectSummary({
      selectedObjectId: "revenue",
      objectName: "Revenue",
      executiveSummary: "Revenue is experiencing elevated margin pressure with moderate systemic impact across downstream fulfillment lanes.",
      signals: [],
    });
    expect(summary.length).toBeLessThanOrEqual(EXECUTIVE_OBJECT_SUMMARY_MAX_CHARS);
  });
});

describe("objectInfoProgressiveDisclosure", () => {
  it("defaults to standard view with primary and secondary only", () => {
    expect(DEFAULT_OBJECT_INFO_DISCLOSURE_VIEW).toBe("standard");
    expect(resolveObjectInfoDisclosureLevels("standard")).toEqual(["PRIMARY", "SECONDARY"]);
    expect(isObjectInfoFieldVisible("health", "standard")).toBe(true);
    expect(isObjectInfoFieldVisible("relationships", "standard")).toBe(false);
    expect(isObjectInfoFieldVisible("relationships", "detailed")).toBe(true);
  });
});

describe("buildExecutiveObjectInfoLayout", () => {
  it("builds compact layout with signal overflow", () => {
    const layout = buildExecutiveObjectInfoLayout({
      selectedObjectId: "revenue",
      objectName: "Revenue",
      objectType: "Finance",
      healthLabel: "Watch",
      riskLevel: "medium",
      reliabilityLabel: "Ready",
      frsiScore: 0.62,
      statusTone: "elevated",
      signals: ["Finance", "Revenue", "Margin", "Demand", "Inventory", "Logistics"],
      relationshipCount: 4,
    });

    expect(layout?.secondary.signals).toHaveLength(4);
    expect(layout?.secondary.signalOverflow).toBe(2);
    expect(layout?.primary.frsi).toBe("62");
  });
});
