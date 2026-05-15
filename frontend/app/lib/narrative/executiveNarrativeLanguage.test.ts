import test from "node:test";
import assert from "node:assert/strict";

import {
  buildExecutiveNarrativeHeadline,
  buildExecutiveNarrativeSummary,
  normalizeExecutiveNarrativeText,
  toneFromSeverity,
} from "./executiveNarrativeLanguage.ts";

test("executive narrative language stays calm and normalized", () => {
  assert.equal(normalizeExecutiveNarrativeText("  Supplier   pressure  "), "Supplier pressure");
  assert.equal(toneFromSeverity("critical"), "urgent");
  assert.equal(toneFromSeverity("high"), "cautionary");

  const headline = buildExecutiveNarrativeHeadline({
    focus: "Supplier dependency",
    tone: "urgent",
  });
  const summary = buildExecutiveNarrativeSummary({
    focus: "Supplier dependency",
    tone: "cautionary",
    objectCount: 2,
    signalCount: 3,
  });

  assert.equal(headline, "Supplier dependency requires executive attention.");
  assert.match(summary, /sustained pressure/);
  assert.doesNotMatch(headline, /!!!/);
});
