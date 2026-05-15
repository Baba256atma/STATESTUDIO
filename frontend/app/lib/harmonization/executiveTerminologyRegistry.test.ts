import assert from "node:assert/strict";
import test from "node:test";

import {
  canonicalExecutiveTerm,
  getExecutiveTerminology,
  harmonizeExecutiveTerminology,
  listExecutiveTerminology,
} from "./executiveTerminologyRegistry.ts";

test("executive terminology registry maps aliases to canonical terms", () => {
  assert.equal(canonicalExecutiveTerm("instability spread"), "propagation");
  assert.equal(canonicalExecutiveTerm("recovery capability"), "resilience");
  assert.equal(getExecutiveTerminology("operational synchronization")?.concept, "coordination");
});

test("executive terminology entries discourage semantic drift", () => {
  const terms = listExecutiveTerminology();

  assert.equal(terms.length >= 10, true);
  assert.equal(terms.every((entry) => entry.canonicalTerm.length > 0), true);
  assert.equal(terms.some((entry) => entry.discouragedPhrases.includes("catastrophic weakness")), true);
});

test("harmonizes discouraged dramatic language", () => {
  const text = harmonizeExecutiveTerminology("Critical catastrophic weakness is creating instability spread.");

  assert.equal(text.includes("catastrophic weakness"), false);
  assert.equal(text.includes("instability spread"), false);
  assert.equal(text.includes("fragility"), true);
  assert.equal(text.includes("propagation"), true);
});
