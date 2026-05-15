import assert from "node:assert/strict";
import test from "node:test";

import { getExecutiveVisualTreatment, limitExecutiveActionLabels } from "./executiveVisualLanguage.ts";

test("keeps critical visual treatment calm and non-flashing", () => {
  const treatment = getExecutiveVisualTreatment({
    severity: "critical",
    level: "immediate_focus",
    active: true,
  });

  assert.equal(treatment.intensity, "urgent");
  assert.equal(treatment.animation, "subtle");
  assert.equal(treatment.allowFlash, false);
  assert.equal(treatment.maxVisibleActions, 1);
});

test("keeps low priority supporting intelligence quiet", () => {
  const treatment = getExecutiveVisualTreatment({
    severity: "low",
    level: "supporting_intelligence",
  });

  assert.equal(treatment.intensity, "quiet");
  assert.equal(treatment.animation, "none");
  assert.equal(treatment.maxVisibleActions, 0);
});

test("limits visible executive actions by visual treatment", () => {
  const treatment = getExecutiveVisualTreatment({
    severity: "high",
    level: "strategic_context",
  });

  assert.deepEqual(limitExecutiveActionLabels(["Review", "Compare", "Escalate"], treatment), ["Review"]);
});
