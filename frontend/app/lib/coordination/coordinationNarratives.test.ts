import test from "node:test";
import assert from "node:assert/strict";

import {
  buildAlignmentGuidance,
  buildCoordinationExecutiveImpact,
  buildCoordinationSummary,
  buildCoordinationTitle,
} from "./coordinationNarratives.ts";

test("coordination narratives are executive and operationally aware", () => {
  const title = buildCoordinationTitle({
    dependencyType: "cross_domain_sync",
    relatedObjectIds: ["supplier", "delivery"],
  });
  const summary = buildCoordinationSummary({
    dependencyType: "operational_alignment",
    relatedObjectIds: ["supplier", "delivery"],
  });

  assert.match(title, /Cross-domain coordination/);
  assert.match(summary, /synchronized alignment/);
  assert.match(buildCoordinationExecutiveImpact({ dependencyType: "monitoring_dependency" }), /Visibility gaps/);
  assert.match(buildAlignmentGuidance({ dependencyType: "execution_dependency", relatedObjectIds: ["supplier", "delivery"] }), /execution cadence/);
});
