import test from "node:test";
import assert from "node:assert/strict";

import {
  deriveLessonsLearned,
  deriveStrategicHindsight,
} from "./deriveStrategicHindsight.ts";

test("strategic hindsight and lessons are evidence-oriented", () => {
  const changes = [
    {
      id: "confidence",
      type: "confidence_changed" as const,
      previousState: "0.6",
      currentState: "0.8",
      confidenceDrift: 0.2,
      relatedRecommendationIds: ["rec"],
      relatedObjectIds: ["supplier"],
    },
    {
      id: "fragility",
      type: "fragility_changed" as const,
      previousState: "elevated",
      currentState: "reduced",
      relatedRecommendationIds: ["rec"],
      relatedObjectIds: ["supplier"],
    },
  ];

  const hindsight = deriveStrategicHindsight({ changes });
  const lessons = deriveLessonsLearned({ changes });

  assert.ok(hindsight.some((item) => item.includes("confidence improved")));
  assert.ok(hindsight.some((item) => item.includes("Propagation exposure decreased")));
  assert.ok(lessons.some((item) => item.includes("Dependency concentration")));
});
