import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  NEXORA_VISUAL_INTELLIGENCE_BOUNDARY,
  applyNexoraVisualViewRuntime,
  composeNexoraVisualAdvisorCopy,
  emptyNexoraVisualViewRuntime,
  nexoraExampleOperationsVisualEvidence,
  resolveNexoraVisualView,
  verifyNexoraVisualIntelligence,
} from "./nexoraVisualIntelligence.ts";

const evidence = nexoraExampleOperationsVisualEvidence();

describe("DIR:VI Visual Intelligence", () => {
  it("is reusable and presentation-only", () => {
    assert.equal(verifyNexoraVisualIntelligence().ok, true);
    assert.equal(NEXORA_VISUAL_INTELLIGENCE_BOUNDARY.requiresNexEnt, false);
    assert.equal(NEXORA_VISUAL_INTELLIGENCE_BOUNDARY.writesEvidence, false);
    assert.equal(NEXORA_VISUAL_INTELLIGENCE_BOUNDARY.equalsBusinessObject, false);
    assert.equal(NEXORA_VISUAL_INTELLIGENCE_BOUNDARY.fabricatesPeriods, false);
    assert.equal(evidence.acceptedIntoDataReality, false);
  });

  it("resolves TREND from ordered time points without chart vocabulary", () => {
    const resolution = resolveNexoraVisualView({
      purpose: "TREND",
      evidence,
      subjectId: "delivery",
    });
    assert.equal(resolution.status, "SUPPORTED");
    if (resolution.status !== "SUPPORTED") return;
    assert.equal(resolution.view.purpose, "TREND");
    assert.equal(resolution.view.representation, "TREND_LINE");
    assert.equal(resolution.view.series[0].points.length, 2);
    assert.equal(resolution.view.isBusinessObject, false);
    assert.equal(resolution.view.isDataObject, false);
    assert.equal(resolution.view.isDecision, false);
    assert.equal(resolution.view.mutatesFocus, false);
    assert.equal(resolution.view.series[0].unit, null);
    assert.match(resolution.view.series[0].displayLabel, /likely/i);
  });

  it("does not fabricate six months from two observations", () => {
    const resolution = resolveNexoraVisualView({
      purpose: "TREND",
      evidence,
      subjectId: "delivery",
      requestedMonths: 6,
    });
    assert.equal(resolution.status, "INSUFFICIENT_EVIDENCE");
    if (resolution.status !== "INSUFFICIENT_EVIDENCE") return;
    assert.equal(resolution.offerAvailableTrend, true);
    assert.match(resolution.reason, /2 monthly|two monthly|2 monthly observations/i);
    assert.doesNotMatch(resolution.reason, /2026-01|2026-12/);
  });

  it("refuses UNKNOWN field as a named trend", () => {
    const resolution = resolveNexoraVisualView({
      purpose: "TREND",
      evidence,
      subjectId: "value",
    });
    assert.equal(resolution.status, "INSUFFICIENT_EVIDENCE");
    if (resolution.status !== "INSUFFICIENT_EVIDENCE") return;
    assert.doesNotMatch(resolution.reason, /Backlog Trend/i);
    assert.match(resolution.reason, /value/i);
  });

  it("requires clarification for unresolved comparison", () => {
    const resolution = resolveNexoraVisualView({
      purpose: "COMPARE",
      evidence,
    });
    assert.equal(resolution.status, "AMBIGUOUS");
  });

  it("compares two periods without picking a winner", () => {
    const resolution = resolveNexoraVisualView({
      purpose: "COMPARE",
      evidence,
      comparableIds: ["otd-periods", "otd-periods"],
    });
    assert.equal(resolution.status, "SUPPORTED");
    if (resolution.status !== "SUPPORTED") return;
    assert.equal(resolution.view.representation, "COMPARISON_BARS");
    assert.match(composeNexoraVisualAdvisorCopy(resolution, "PRESENT"), /does not pick a winner/i);
    assert.match(composeNexoraVisualAdvisorCopy(resolution, "DECISION"), /does not choose/i);
    assert.match(composeNexoraVisualAdvisorCopy(resolution, "CAUSE"), /not the cause|doesn.t prove|pattern/i);
  });

  it("does not invent a common unit across unlike fields", () => {
    const mixed = {
      ...evidence,
      series: evidence.series.map((item, index) =>
        index === 1 ? { ...item, unit: "count" } : item,
      ),
    };
    const resolution = resolveNexoraVisualView({
      purpose: "COMPARE",
      evidence: mixed,
      comparableIds: ["otd", "ord-qty"],
    });
    assert.equal(resolution.status, "INSUFFICIENT_EVIDENCE");
  });

  it("replacement is a single view runtime", () => {
    const trend = resolveNexoraVisualView({
      purpose: "TREND",
      evidence,
      subjectId: "delivery",
    });
    assert.equal(trend.status, "SUPPORTED");
    if (trend.status !== "SUPPORTED") return;
    const first = applyNexoraVisualViewRuntime({ request: trend.view });
    const compare = resolveNexoraVisualView({
      purpose: "COMPARE",
      evidence,
      comparableIds: ["otd-periods", "otd-periods"],
    });
    assert.equal(compare.status, "SUPPORTED");
    if (compare.status !== "SUPPORTED") return;
    const second = applyNexoraVisualViewRuntime({ previous: first, request: compare.view });
    assert.equal(second.view?.purpose, "COMPARE");
    const dismissed = applyNexoraVisualViewRuntime({ previous: second, dismiss: true });
    assert.equal(dismissed.view, null);
    assert.equal(emptyNexoraVisualViewRuntime().view, null);
  });

  it("identical inputs are deterministic", () => {
    const a = resolveNexoraVisualView({ purpose: "TREND", evidence, subjectId: "delivery" });
    const b = resolveNexoraVisualView({ purpose: "TREND", evidence, subjectId: "delivery" });
    assert.deepEqual(a, b);
  });

  it("empty evidence does not decorate a chart", () => {
    const resolution = resolveNexoraVisualView({ purpose: "TREND", evidence: null });
    assert.equal(resolution.status, "INSUFFICIENT_EVIDENCE");
    if (resolution.status !== "INSUFFICIENT_EVIDENCE") return;
    assert.equal(resolution.view, null);
  });
});
