import { describe, expect, test } from "vitest";

import { buildSafeExecutiveAdvisorInputSignature } from "./executiveAdvisorSignatureSafety.ts";

describe("executive advisor signature safety", () => {
  test("caps oversized alert signatures without building an unbounded join", () => {
    const alerts = Array.from({ length: 300 }, (_, index) => ({
      id: `alert_${index}_${"x".repeat(1000)}`,
      level: "critical" as const,
      message: "Synthetic alert pressure",
      relatedObjectIds: ["obj_a"],
      timestamp: index,
      acknowledged: false,
    }));

    const result = buildSafeExecutiveAdvisorInputSignature({
      selectedObjectId: "obj_a",
      alerts,
    });

    expect(result.alertCount).toBe(300);
    expect(result.guardActivated).toBe(true);
    expect(result.truncatedLength).toBeLessThanOrEqual(4096);
    expect(result.signature.length).toBe(result.truncatedLength);
  });
});
