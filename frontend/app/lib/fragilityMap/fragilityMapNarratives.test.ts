import test from "node:test";
import assert from "node:assert/strict";

import {
  buildFragilityExecutiveImpact,
  buildFragilityZoneSummary,
  buildFragilityZoneTitle,
} from "./fragilityMapNarratives.ts";

test("fragility map narratives are executive and systemic", () => {
  const title = buildFragilityZoneTitle({
    zoneType: "critical_corridor",
    relatedObjectIds: ["supplier", "inventory", "delivery"],
  });
  const summary = buildFragilityZoneSummary({
    zoneType: "critical_corridor",
    relatedObjectIds: ["supplier", "inventory", "delivery"],
  });

  assert.match(title, /Critical fragility corridor/);
  assert.match(summary, /dependency corridor/);
  assert.match(buildFragilityExecutiveImpact({ zoneType: "systemic" }), /executive-level visibility/);
});
