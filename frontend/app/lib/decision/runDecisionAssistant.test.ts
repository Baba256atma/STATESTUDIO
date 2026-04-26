/**
 * Deterministic Decision Assistant — orchestration smoke + scoring invariants.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { runDecisionAssistant } from "./runDecisionAssistant.ts";
import { buildDecisionAssistantTelemetrySignature } from "./decisionAssistantTelemetry.ts";

test("business domain + critical risk: top scenario is stability-leaning (buffer, restore flow, or cost discipline)", () => {
  const out = runDecisionAssistant({
    domainId: "retail_ops",
    riskLevel: "critical",
    fragileObjectIds: ["sku_constraint"],
    highlightedDriverIds: ["supplier_delay"],
    systemSummary: "Supplier delay on constraint SKU; fulfillment risk elevated.",
  });
  assert.ok(out.scenarios.length > 0);
  const top = out.scenarios[0];
  assert.ok(
    top.id === "biz_buffer_inventory" ||
      top.id === "biz_restore_throughput" ||
      top.id === "biz_cost_discipline" ||
      top.id === "biz_baseline"
  );
  assert.ok(top.score > 0);
});

test("low risk + generic domain: completes with recommendation and ranked scenarios", () => {
  const out = runDecisionAssistant({
    domainId: "unknown_vertical",
    riskLevel: "low",
  });
  assert.ok(out.scenarios.length > 0);
  assert.ok(out.recommendation.recommendedScenarioId);
  assert.ok(out.recommendation.primaryAction.length > 0);
  const top = out.scenarios[0];
  assert.equal(out.recommendation.recommendedScenarioId, top.id);
});

test("selected fragile object is reflected in top scenario affectedObjectIds when relevant", () => {
  const out = runDecisionAssistant({
    domainId: "business",
    riskLevel: "high",
    selectedObjectId: "node_a",
    fragileObjectIds: ["node_a", "node_b"],
  });
  const top = out.scenarios[0];
  assert.ok(top.affectedObjectIds.includes("node_a"));
});

test("panel + scene adapters are present on unified output", () => {
  const out = runDecisionAssistant({ domainId: "strategy", riskLevel: "medium" });
  assert.ok(out.panelData.advice && typeof out.panelData.advice === "object");
  assert.ok(out.panelData.compare && typeof out.panelData.compare === "object");
  assert.ok(out.executiveBrief.headline.length > 0);
  assert.ok(Array.isArray(out.sceneAction.highlightObjectIds));
});

test("telemetry signature is stable for identical assistant output + merge/scene metadata", () => {
  const out = runDecisionAssistant({ domainId: "generic", riskLevel: "low" });
  const emptyTrace = [
    { slice: "advice" as const, changed: false, filledFields: [] as string[] },
    { slice: "compare" as const, changed: false, filledFields: [] },
    { slice: "timeline" as const, changed: false, filledFields: [] },
    { slice: "warRoom" as const, changed: false, filledFields: [] },
  ];
  const input = {
    output: out,
    panelMergeTrace: emptyTrace,
    sceneApplied: false,
    sceneSkippedReason: "no_assistant_scene_hints",
  };
  assert.equal(buildDecisionAssistantTelemetrySignature(input), buildDecisionAssistantTelemetrySignature(input));
});
