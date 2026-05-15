import { test } from "node:test";
import * as assert from "node:assert/strict";

import { buildDomainPropagationFrames } from "./domainPropagationBuilder.ts";
import { buildPropagationVisualizationState } from "./domainPropagationVisualization.ts";

const objects = [
  { id: "supplier" },
  { id: "inventory" },
];

test("visualization state is stable and renderer-safe metadata", () => {
  const frames = buildDomainPropagationFrames({
    objects,
    propagationHints: [
      {
        sourceObjectId: "supplier",
        targetObjectId: "inventory",
        propagationType: "risk",
        propagationStrength: 0.8,
      },
    ],
  });

  const first = buildPropagationVisualizationState({ frames });
  const second = buildPropagationVisualizationState({ frames });

  assert.deepEqual(first, second);
  assert.equal((first.objectHighlights.supplier as Record<string, unknown>).role, "propagation_source");
  assert.equal((first.objectHighlights.inventory as Record<string, unknown>).role, "propagation_target");
  assert.ok(Object.keys(first.edgeHighlights).length > 0);
  assert.ok(first.timelineSummary.includes("Supplier"));
});

test("visualization handles empty frames safely", () => {
  const state = buildPropagationVisualizationState({ frames: [] });

  assert.deepEqual(state.objectHighlights, {});
  assert.deepEqual(state.edgeHighlights, {});
  assert.equal(state.timelineSummary, "No propagation timeline is available yet.");
});
