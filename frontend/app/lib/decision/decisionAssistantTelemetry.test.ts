/**
 * Decision Assistant telemetry — signature, summary shape, dedupe safety.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { runDecisionAssistant } from "./runDecisionAssistant.ts";
import {
  buildDecisionAssistantTelemetrySignature,
  buildPanelMergeTraceFromEnrichment,
  diffFilledFields,
  logDecisionAssistantTelemetryOnce,
  summarizeDecisionAssistantTelemetry,
} from "./decisionAssistantTelemetry.ts";

test("buildDecisionAssistantTelemetrySignature: changes when top scenario changes", () => {
  const low = runDecisionAssistant({ domainId: "business", riskLevel: "low" });
  const critical = runDecisionAssistant({ domainId: "business", riskLevel: "critical" });
  const baseTrace = [
    { slice: "advice" as const, changed: false, filledFields: [] as string[] },
    { slice: "compare" as const, changed: false, filledFields: [] },
    { slice: "timeline" as const, changed: false, filledFields: [] },
    { slice: "warRoom" as const, changed: false, filledFields: [] },
  ];
  const a = buildDecisionAssistantTelemetrySignature({
    output: low,
    panelMergeTrace: baseTrace,
    sceneApplied: false,
    sceneSkippedReason: "no_assistant_scene_hints",
  });
  const b = buildDecisionAssistantTelemetrySignature({
    output: critical,
    panelMergeTrace: baseTrace,
    sceneApplied: false,
    sceneSkippedReason: "no_assistant_scene_hints",
  });
  assert.notEqual(a, b);
  assert.notEqual(low.scenarios[0]?.id, critical.scenarios[0]?.id);
});

test("buildDecisionAssistantTelemetrySignature: differs for scene applied vs skipped", () => {
  const out = runDecisionAssistant({ domainId: "generic", riskLevel: "medium" });
  const trace = [
    { slice: "advice" as const, changed: true, filledFields: ["summary"] },
    { slice: "compare" as const, changed: false, filledFields: [] },
    { slice: "timeline" as const, changed: false, filledFields: [] },
    { slice: "warRoom" as const, changed: false, filledFields: [] },
  ];
  const applied = buildDecisionAssistantTelemetrySignature({
    output: out,
    panelMergeTrace: trace,
    sceneApplied: true,
    sceneSkippedReason: null,
  });
  const skipped = buildDecisionAssistantTelemetrySignature({
    output: out,
    panelMergeTrace: trace,
    sceneApplied: false,
    sceneSkippedReason: "backend_scene_authority",
  });
  assert.notEqual(applied, skipped);
});

test("summarizeDecisionAssistantTelemetry: no full panel payloads in summary", () => {
  const out = runDecisionAssistant({ domainId: "strategy", riskLevel: "high" });
  const summary = summarizeDecisionAssistantTelemetry({
    output: out,
    panelMergeTrace: [
      { slice: "advice", changed: true, filledFields: ["summary", "recommendation"] },
      { slice: "compare", changed: false, filledFields: [] },
      { slice: "timeline", changed: false, filledFields: [] },
      { slice: "warRoom", changed: false, filledFields: [] },
    ],
    sceneApplied: false,
    sceneSkippedReason: "duplicate_reaction_signature",
  });
  const json = JSON.stringify(summary);
  assert.ok(!json.includes("recommended_actions"));
  assert.ok(!json.includes("options"));
  assert.equal(typeof summary.domainId, "string");
  assert.ok(Array.isArray(summary.panelSlicesChanged));
  assert.ok(typeof summary.filledFieldsBySlice === "object");
});

test("logDecisionAssistantTelemetryOnce: dedupe does not throw", () => {
  const out = runDecisionAssistant({ domainId: "politics", riskLevel: "medium" });
  const input = {
    output: out,
    panelMergeTrace: [
      { slice: "advice" as const, changed: true, filledFields: ["title"] },
      { slice: "compare" as const, changed: false, filledFields: [] },
      { slice: "timeline" as const, changed: false, filledFields: [] },
      { slice: "warRoom" as const, changed: false, filledFields: [] },
    ],
    sceneApplied: true,
    sceneSkippedReason: null as string | null,
  };
  const ref = { current: null as string | null };
  const prevLog = globalThis.console.log;
  globalThis.console.log = () => {};
  try {
    assert.doesNotThrow(() => {
      logDecisionAssistantTelemetryOnce(input, ref);
      logDecisionAssistantTelemetryOnce(input, ref);
    });
  } finally {
    globalThis.console.log = prevLog;
  }
});

test("diffFilledFields: caps at 12 keys", () => {
  const before: Record<string, unknown> = {};
  const after: Record<string, unknown> = {};
  for (let i = 0; i < 20; i += 1) {
    after[`k${i}`] = `v${i}`;
  }
  const filled = diffFilledFields(before, after);
  assert.equal(filled.length, 12);
});

test("buildPanelMergeTraceFromEnrichment: detects filled top-level fields only", () => {
  const traces = buildPanelMergeTraceFromEnrichment({
    mappedAdvice: {},
    mappedCompare: null,
    mappedTimeline: { headline: "" },
    mappedWarRoom: {},
    mergedAdvice: { summary: "x" },
    mergedCompare: { summary: "y" },
    mergedTimeline: { headline: "now" },
    mergedWarRoom: {},
  });
  const advice = traces.find((t) => t.slice === "advice");
  assert.ok(advice?.changed);
  assert.ok(advice?.filledFields.includes("summary"));
  const timeline = traces.find((t) => t.slice === "timeline");
  assert.ok(timeline?.changed);
});
