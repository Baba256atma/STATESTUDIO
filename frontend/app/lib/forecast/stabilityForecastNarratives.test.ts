import test from "node:test";
import assert from "node:assert/strict";

import {
  buildForecastRationale,
  buildStabilityForecastSummary,
  buildStabilityForecastTitle,
  labelForForecastHorizon,
} from "./stabilityForecastNarratives.ts";

test("forecast narratives avoid false certainty", () => {
  const title = buildStabilityForecastTitle({
    direction: "degrading",
    focus: "Delivery stability",
  });
  const summary = buildStabilityForecastSummary({
    direction: "uncertain",
    focus: "Delivery stability",
  });

  assert.match(title, /expected to remain under pressure/);
  assert.match(summary, /remains uncertain/);
  assert.doesNotMatch(title + summary, /will fail|guaranteed|definitely|certainly/i);
  assert.equal(labelForForecastHorizon("near_term"), "Near-term decision cycle");
  assert.match(buildForecastRationale({ direction: "volatile" }), /unstable signal movement/);
});
