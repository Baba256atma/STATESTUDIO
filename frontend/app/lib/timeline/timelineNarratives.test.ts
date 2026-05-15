import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  buildExecutiveImpact,
  buildRecommendedTimelineAttention,
  buildTimelineSummary,
  buildTimelineTitle,
  labelForTimelineStage,
} from "./timelineNarratives.ts";

test("timeline narratives are executive and time-aware", () => {
  const title = buildTimelineTitle({
    trend: "degrading",
    focus: "supplier dependency",
  });
  const summary = buildTimelineSummary({
    trend: "degrading",
    focus: "supplier dependency",
  });
  const impact = buildExecutiveImpact({
    trend: "degrading",
    focus: "supplier dependency",
  });
  const attention = buildRecommendedTimelineAttention({
    trend: "degrading",
    focus: "supplier dependency",
  });

  assert.equal(title, "supplier dependency is degrading");
  assert.ok(summary.includes("expanding"));
  assert.ok(impact.includes("Escalation momentum"));
  assert.ok(attention.includes("before the next operational stage"));
});

test("timeline stage labels are stable", () => {
  assert.equal(labelForTimelineStage("early_signal"), "Early Signal");
  assert.equal(labelForTimelineStage("emerging_pressure"), "Emerging Pressure");
  assert.equal(labelForTimelineStage("active_risk"), "Active Risk");
});
