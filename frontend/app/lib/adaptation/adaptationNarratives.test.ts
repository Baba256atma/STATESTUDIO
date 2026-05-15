import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAdaptationExecutiveImpact,
  buildAdaptationGuidance,
  buildAdaptationSummary,
  buildAdaptationTitle,
} from "./adaptationNarratives.ts";

test("adaptation narratives are executive and flexibility-oriented", () => {
  const title = buildAdaptationTitle({
    adaptationState: "adaptive",
    relatedObjectIds: ["supplier", "delivery"],
  });
  const summary = buildAdaptationSummary({
    adaptationState: "rigid",
    relatedObjectIds: ["supplier", "delivery"],
  });
  const impact = buildAdaptationExecutiveImpact({
    adaptationState: "strained",
  });
  const guidance = buildAdaptationGuidance({
    adaptationState: "rigid",
    bottleneckLabels: ["Rigid dependency concentration"],
    relatedObjectIds: ["supplier", "delivery"],
  });

  assert.match(title, /Adaptive Adaptation/);
  assert.match(summary, /Rigid operational dependencies/);
  assert.match(impact, /Limited flexibility/);
  assert.match(guidance, /rigid dependency concentration/);
  assert.doesNotMatch(`${title} ${summary} ${impact} ${guidance}`, /autonomous|guaranteed|self-modifying/i);
});
