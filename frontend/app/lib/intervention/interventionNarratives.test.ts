import test from "node:test";
import assert from "node:assert/strict";

import {
  buildExpectedInterventionImpact,
  buildExecutiveInterventionRationale,
  buildInterventionSummary,
  buildInterventionTitle,
} from "./interventionNarratives.ts";

test("intervention narratives are executive and stabilization-oriented", () => {
  const title = buildInterventionTitle({
    category: "reduce_dependency",
    relatedObjectIds: ["supplier", "inventory"],
  });
  const summary = buildInterventionSummary({
    category: "contain_propagation",
    relatedObjectIds: ["supplier", "inventory", "delivery"],
  });

  assert.match(title, /Reduce dependency concentration/);
  assert.match(summary, /downstream exposure/);
  assert.match(buildExpectedInterventionImpact({ category: "reduce_coupling", priority: "high" }), /fragility amplification/);
  assert.match(buildExecutiveInterventionRationale({ category: "stabilize", priority: "critical" }), /highest-leverage/);
});
