import { describe, expect, it } from "vitest";

import {
  buildPanelValidationCacheKey,
  validatePanelSharedDataWithDiagnostics,
} from "./validatePanelSharedDataWithDiagnostics";
import {
  getPanelValidationCacheEntry,
  resetPanelValidationCacheForTests,
} from "./panelValidationCache";

describe("panel validation cache", () => {
  it("converts fragility.drivers object map to array before validation", () => {
    const result = validatePanelSharedDataWithDiagnostics({
      fragility: {
        level: "high",
        score: 0.62,
        summary: "Elevated operational fragility.",
        drivers: {
          inventory_pressure: 0.58,
          time_pressure: 0.67,
        },
      },
    });

    expect(Array.isArray(result.data.fragility?.drivers)).toBe(true);
    expect(result.data.fragility?.drivers).toEqual([0.58, 0.67]);
    expect(result.contractFailed).toBe(false);
  });

  it("buildPanelValidationCacheKey is stable across object identity and volatile fields", () => {
    const keyA = buildPanelValidationCacheKey({
      risk: { level: "high", summary: "Stable risk.", edges: [{ id: "a" }] },
      updatedAt: 1,
      runId: "run-a",
      rawTimestamp: "2026-01-01T00:00:00Z",
    });
    const keyB = buildPanelValidationCacheKey({
      risk: { level: "high", summary: "Different summary text.", edges: [{ id: "b" }] },
      updatedAt: 99,
      runId: "run-b",
      rawTimestamp: "2026-05-20T12:00:00Z",
    });
    expect(keyA).toBe(keyB);
  });

  it("returns module cache hit on second identical validation", () => {
    resetPanelValidationCacheForTests();
    const input = {
      advice: { summary: "Hold course.", recommendations: [{ title: "Monitor" }] },
      timeline: { events: [{ label: "Review" }] },
    };
    const cacheKey = buildPanelValidationCacheKey(input);
    expect(getPanelValidationCacheEntry(cacheKey)).toBeNull();

    const first = validatePanelSharedDataWithDiagnostics(input);
    expect(getPanelValidationCacheEntry(cacheKey)).not.toBeNull();

    const second = validatePanelSharedDataWithDiagnostics({
      ...input,
      updatedAt: Date.now(),
      responseData: { trace_id: "new-id" },
    });
    expect(second).toBe(first);
  });
});
