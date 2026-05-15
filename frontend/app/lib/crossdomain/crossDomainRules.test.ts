import test from "node:test";
import assert from "node:assert/strict";

import {
  findCrossDomainInfluenceRules,
  listCrossDomainInfluenceRules,
} from "./crossDomainRules.ts";

test("cross-domain influence rules are deterministic and copy-safe", () => {
  const first = listCrossDomainInfluenceRules();
  const second = listCrossDomainInfluenceRules();

  assert.deepEqual(first, second);
  assert.ok(first.length >= 6);
  first[0].label = "mutated";
  assert.notEqual(listCrossDomainInfluenceRules()[0].label, "mutated");
});

test("cross-domain rule lookup finds supply chain delivery impact", () => {
  const rules = findCrossDomainInfluenceRules({
    sourceDomainId: "supply_chain",
    relationshipType: "delivery_impact",
  });

  assert.equal(rules.length, 1);
  assert.equal(rules[0].targetDomainId, "retail");
});
