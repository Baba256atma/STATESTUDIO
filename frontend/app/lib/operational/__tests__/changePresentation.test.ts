import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { OperationalChangeSummary } from "../changeDetectionTypes.ts";
import {
  formatOperationalTopChangeLine,
  getOperationalChangeLabel,
  getOperationalChangeSummaryTone,
  getOperationalChangeTone,
  getOperationalExecutiveSignal,
} from "../changePresentation.ts";

describe("changePresentation", () => {
  it("resolves labels for known change types", () => {
    assert.equal(getOperationalChangeLabel("new_signal"), "New signal");
    assert.equal(getOperationalChangeLabel("severity_increase"), "Severity increased");
  });

  it("falls back safely for unknown change types", () => {
    assert.equal(getOperationalChangeLabel("not_a_real_type"), "Operational update");
    assert.equal(getOperationalChangeLabel(""), "Operational update");
  });

  it("derives change severity tones", () => {
    assert.equal(getOperationalChangeTone("critical"), "critical");
    assert.equal(getOperationalChangeTone("high"), "negative");
    assert.equal(getOperationalChangeTone("medium"), "caution");
    assert.equal(getOperationalChangeTone("low"), "neutral");
    assert.equal(getOperationalChangeTone("unknown_severity"), "neutral");
  });

  it("returns degradation tone when worsening dominates", () => {
    const s: OperationalChangeSummary = {
      totalChanges: 4,
      criticalChanges: 0,
      worseningCount: 3,
      improvingCount: 1,
      stableCount: 0,
      affectedObjectIds: [],
      executiveSummary: "x",
      generatedAt: "t",
    };
    assert.equal(getOperationalChangeSummaryTone(s), "negative");
  });

  it("returns recovery tone when improving dominates", () => {
    const s: OperationalChangeSummary = {
      totalChanges: 3,
      criticalChanges: 0,
      worseningCount: 1,
      improvingCount: 2,
      stableCount: 0,
      affectedObjectIds: [],
      executiveSummary: "x",
      generatedAt: "t",
    };
    assert.equal(getOperationalChangeSummaryTone(s), "positive");
  });

  it("returns stable neutral tone when no material changes", () => {
    const s: OperationalChangeSummary = {
      totalChanges: 0,
      criticalChanges: 0,
      worseningCount: 0,
      improvingCount: 0,
      stableCount: 0,
      affectedObjectIds: [],
      executiveSummary: "No operational changes detected.",
      generatedAt: "t",
    };
    assert.equal(getOperationalChangeSummaryTone(s), "neutral");
  });

  it("returns critical tone when critical changes exist", () => {
    const s: OperationalChangeSummary = {
      totalChanges: 2,
      criticalChanges: 1,
      worseningCount: 0,
      improvingCount: 2,
      stableCount: 0,
      affectedObjectIds: [],
      executiveSummary: "x",
      generatedAt: "t",
    };
    assert.equal(getOperationalChangeSummaryTone(s), "critical");
  });

  it("executive signal is safe and non-empty for active summaries", () => {
    const s: OperationalChangeSummary = {
      totalChanges: 1,
      criticalChanges: 0,
      worseningCount: 1,
      improvingCount: 0,
      stableCount: 0,
      affectedObjectIds: ["n1"],
      topChange: {
        id: "1",
        type: "new_signal",
        objectId: "supply_chain_node",
        message: "New operational signal Alpha (src).",
        severity: "high",
        detectedAt: "t",
      },
      executiveSummary: "Operational delta: 1 change(s), 0 critical. Worsening 1, improving 0, stable 0.",
      generatedAt: "t",
    };
    const line = getOperationalExecutiveSignal(s);
    assert.ok(line.includes("supply_chain_node"));
    assert.ok(!/\bNaN\b/.test(line));
  });

  it("returns caution tone when worsening equals improving with activity", () => {
    const s: OperationalChangeSummary = {
      totalChanges: 4,
      criticalChanges: 0,
      worseningCount: 2,
      improvingCount: 2,
      stableCount: 0,
      affectedObjectIds: [],
      executiveSummary: "x",
      generatedAt: "t",
    };
    assert.equal(getOperationalChangeSummaryTone(s), "caution");
  });

  it("formats top change line with object id when present", () => {
    const line = formatOperationalTopChangeLine(
      {
        id: "x",
        type: "severity_increase",
        objectId: "supply_chain_node",
        message: "Severity increased for inventory node (connector).",
        severity: "high",
        detectedAt: "t",
      },
      120
    );
    assert.ok(line.includes("supply_chain_node"));
    assert.ok(line.includes("Severity increased"));
  });
});
