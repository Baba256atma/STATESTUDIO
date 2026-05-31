import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  buildExecutiveDecisionTraceInputSignature,
  extractExecutiveDecisionTraceSignatureInput,
  extractDecisionTracePanelWriteSignature,
} from "./executiveDecisionTraceSignature";
import {
  getExecutiveDecisionTraceCache,
  resetExecutiveDecisionTraceCacheForTests,
  setExecutiveDecisionTraceCache,
} from "./executiveDecisionTraceCache";
import { resolveExecutiveDashboardDecisionTrace } from "./executiveDecisionTraceRuntime";
import { resetDecisionTraceDiagnosticsForTests } from "./decisionTraceDiagnostics";

describe("executiveDecisionTraceSignature", () => {
  it("builds stable signatures for equivalent business inputs", () => {
    const input = extractExecutiveDecisionTraceSignatureInput({
      responseData: {
        canonical_recommendation: {
          id: "rec-1",
          primary: { action: "Stabilize supply" },
          alternatives: [],
          reasoning: { why: "Risk elevated" },
          confidence: { score: 0.72, level: "medium" },
          source: "ai_reasoning",
          created_at: 1,
        },
        timeline_impact: {
          events: [{ id: "e1", type: "recommendation" }],
        },
      },
      memoryEntries: [{ id: "mem-1", decision_id: "dec-1" } as any],
      sceneJson: { scene: { objects: [{ id: "obj-a" }], fragility: { level: "high", score: 0.81 } } },
      objectSelection: { selected_object_id: "obj-a" },
      activeMode: "executive",
      scenarioId: "scenario-1",
    });

    const first = buildExecutiveDecisionTraceInputSignature(input);
    const second = buildExecutiveDecisionTraceInputSignature({
      ...input,
      visibleObjectIds: ["obj-a"],
    });
    expect(first).toBe(second);
  });

  it("changes signature when recommendation id changes", () => {
    const base = buildExecutiveDecisionTraceInputSignature({
      activeRecommendationId: "rec-1",
      selectedObjectId: "obj-a",
      visibleObjectIds: ["obj-a"],
    });
    const next = buildExecutiveDecisionTraceInputSignature({
      activeRecommendationId: "rec-2",
      selectedObjectId: "obj-a",
      visibleObjectIds: ["obj-a"],
    });
    expect(base).not.toBe(next);
  });

  it("builds stable panel write signatures", () => {
    const signature = extractDecisionTracePanelWriteSignature({
      responseData: {
        executive_summary_surface: { happened: "Pressure rising" },
        canonical_recommendation: {
          id: "rec-1",
          primary: { action: "Hold inventory buffer" },
          alternatives: [{ action: "Cut spend" }],
          reasoning: { why: "x", risk_summary: "high" },
          confidence: { score: 0.7, level: "medium" },
          source: "ai_reasoning",
          created_at: 1,
        },
      },
      selectedObjectId: "obj-a",
      scenarioId: "scenario-1",
    });
    expect(signature).toContain("Hold inventory buffer");
  });
});

describe("executiveDecisionTraceRuntime", () => {
  beforeEach(() => {
    resetExecutiveDecisionTraceCacheForTests();
    resetDecisionTraceDiagnosticsForTests();
  });

  it("returns cached trace for identical signatures without recomputing", () => {
    const signatureInput = extractExecutiveDecisionTraceSignatureInput({
      responseData: {
        canonical_recommendation: {
          id: "rec-cache",
          primary: { action: "Test" },
          alternatives: [],
          reasoning: { why: "because" },
          confidence: { score: 0.5, level: "medium" },
          source: "generic",
          created_at: 1,
        },
      },
      memoryEntries: [],
    });
    const signature = buildExecutiveDecisionTraceInputSignature(signatureInput);
    setExecutiveDecisionTraceCache(signature, [
      {
        id: "cached-event",
        timestamp: 1,
        type: "recommendation",
        title: "Cached",
        summary: "Cached summary",
        source: "recommendation_engine",
        sourceLabel: "Recommendation",
      },
    ]);

    const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = resolveExecutiveDashboardDecisionTrace({
      signatureInput,
      responseData: { canonical_recommendation: { id: "rec-cache" } },
      memoryEntries: [],
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Cached");
    expect(getExecutiveDecisionTraceCache(signature)?.traceResult).toHaveLength(1);
    expect(warn).not.toHaveBeenCalled();

    debug.mockRestore();
    warn.mockRestore();
  });
});
