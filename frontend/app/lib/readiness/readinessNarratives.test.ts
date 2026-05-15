import assert from "node:assert/strict";
import test from "node:test";
import {
  buildReadinessRationale,
  buildReadinessSummary,
  buildReadinessTitle,
  buildTimingGuidance,
  readinessStateFromInputs,
} from "./readinessNarratives.ts";

test("readiness state progression is deterministic and conservative", () => {
  assert.equal(readinessStateFromInputs({ readinessScore: 0.85, uncertaintyLevel: 0.18, blockerCount: 0 }), "ready");
  assert.equal(readinessStateFromInputs({ readinessScore: 0.68, uncertaintyLevel: 0.25, blockerCount: 0 }), "ready_for_review");
  assert.equal(readinessStateFromInputs({ readinessScore: 0.5, uncertaintyLevel: 0.35, blockerCount: 1 }), "developing");
  assert.equal(readinessStateFromInputs({ readinessScore: 0.4, uncertaintyLevel: 0.7, blockerCount: 0 }), "limited");
  assert.equal(readinessStateFromInputs({ readinessScore: 0.2, uncertaintyLevel: 0.8, blockerCount: 3 }), "not_ready");
});

test("readiness narratives are executive timing-aware and non-approving", () => {
  const title = buildReadinessTitle({
    readinessState: "ready_for_review",
    relatedObjectIds: ["supplier", "delivery"],
  });
  const summary = buildReadinessSummary({
    readinessState: "limited",
    relatedObjectIds: ["supplier", "delivery"],
  });
  const rationale = buildReadinessRationale({
    readinessState: "developing",
    blockerCount: 1,
  });
  const guidance = buildTimingGuidance({
    readinessState: "limited",
    blockerLabels: ["Unresolved propagation corridor"],
  });

  assert.match(title, /Ready for Review/);
  assert.match(summary, /unresolved uncertainty/);
  assert.match(rationale, /blockers/);
  assert.match(guidance, /Delay executive action/);
  assert.doesNotMatch(`${title} ${summary} ${rationale} ${guidance}`, /approved|execute now|guaranteed/i);
});
