import assert from "node:assert/strict";
import test from "node:test";
import {
  buildResilienceExecutiveImpact,
  buildResilienceStrengtheningGuidance,
  buildResilienceSummary,
  buildResilienceTitle,
} from "./resilienceNarratives.ts";

test("resilience narratives are executive recovery-oriented and evidence disciplined", () => {
  const title = buildResilienceTitle({
    resilienceState: "recovering",
    relatedObjectIds: ["supplier", "delivery"],
  });
  const summary = buildResilienceSummary({
    resilienceState: "recovering",
    relatedObjectIds: ["supplier", "delivery"],
  });
  const impact = buildResilienceExecutiveImpact({
    resilienceState: "adaptive",
  });
  const guidance = buildResilienceStrengtheningGuidance({
    resilienceState: "fragile",
    relatedObjectIds: ["supplier", "delivery"],
  });

  assert.match(title, /Recovering Resilience/);
  assert.match(summary, /recovery is emerging/i);
  assert.match(impact, /Adaptive capacity/);
  assert.match(guidance, /Prioritize stabilization/);
  assert.doesNotMatch(`${title} ${summary} ${impact} ${guidance}`, /guaranteed|definitely|perfect/i);
});
