import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  scoreTimelineMomentum,
  stageFromTimelineTrend,
  trendFromTimelineMomentum,
} from "./scoreTimelineMomentum.ts";

test("timeline momentum scores are clamped and stable", () => {
  const input = {
    insights: [
      {
        id: "insight_supplier",
        title: "Supplier Fragility",
        summary: "Supplier pressure is high.",
        category: "dependency" as const,
        severity: "critical" as const,
        confidence: 0.9,
        priorityScore: 92,
        affectedObjectIds: ["supplier"],
        createdAt: 0,
      },
    ],
    recommendations: [
      {
        id: "rec_supplier",
        title: "Diversify Supplier",
        summary: "Reduce concentration.",
        category: "diversify" as const,
        rationale: "Dependency concentration is elevated.",
        affectedObjectIds: ["supplier"],
        confidence: 0.86,
        priority: "critical" as const,
        createdAt: 0,
      },
    ],
    propagationHints: [
      {
        sourceObjectId: "supplier",
        targetObjectId: "inventory",
        propagationStrength: 0.9,
        propagationType: "dependency" as const,
      },
    ],
  };

  const first = scoreTimelineMomentum(input);
  const second = scoreTimelineMomentum(input);

  assert.equal(second, first);
  assert.ok(first >= 0 && first <= 1);
});

test("trend derives critical and degrading movement", () => {
  assert.equal(
    trendFromTimelineMomentum({
      momentumScore: 0.84,
      insights: [],
      recommendations: [],
    }),
    "critical"
  );
  assert.equal(
    trendFromTimelineMomentum({
      momentumScore: 0.64,
      propagationHints: [
        {
          sourceObjectId: "a",
          targetObjectId: "b",
          propagationStrength: 0.7,
          propagationType: "risk",
        },
      ],
      memory: { previousPropagationIntensity: 0.2 },
    }),
    "degrading"
  );
});

test("timeline stage maps trend into executive lifecycle", () => {
  assert.equal(stageFromTimelineTrend({ trend: "critical", momentumScore: 0.9 }), "active_risk");
  assert.equal(stageFromTimelineTrend({ trend: "degrading", momentumScore: 0.62 }), "emerging_pressure");
  assert.equal(stageFromTimelineTrend({ trend: "improving", momentumScore: 0.2 }), "stabilization");
  assert.equal(stageFromTimelineTrend({ trend: "stable", momentumScore: 0.1, hasRecommendations: true }), "monitoring");
});
