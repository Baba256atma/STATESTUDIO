import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDriftAttentionGuidance,
  buildStrategicDriftExecutiveImpact,
  buildStrategicDriftSummary,
  buildStrategicDriftTitle,
} from "./strategicDriftNarratives.ts";

test("strategic drift narratives are calm executive early-warning language", () => {
  const title = buildStrategicDriftTitle({
    driftType: "fragility_reemergence",
    relatedObjectIds: ["supplier", "delivery"],
  });
  const summary = buildStrategicDriftSummary({
    driftType: "fragility_reemergence",
    relatedObjectIds: ["supplier", "delivery"],
  });
  const impact = buildStrategicDriftExecutiveImpact({
    driftType: "monitoring_gap",
  });
  const guidance = buildDriftAttentionGuidance({
    driftType: "monitoring_gap",
    relatedObjectIds: ["supplier", "delivery"],
  });

  assert.match(title, /Fragility Re-Emergence/);
  assert.match(summary, /gradually re-emerging/);
  assert.match(impact, /visibility/i);
  assert.match(guidance, /Increase monitoring visibility/);
  assert.doesNotMatch(`${title} ${summary} ${impact} ${guidance}`, /ALERT|catastrophic|definitely/i);
});
