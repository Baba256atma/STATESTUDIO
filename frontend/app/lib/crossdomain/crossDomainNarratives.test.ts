import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCrossDomainExecutiveImpact,
  buildCrossDomainSummary,
  buildCrossDomainTitle,
} from "./crossDomainNarratives.ts";

test("cross-domain narratives are executive and systems-oriented", () => {
  const title = buildCrossDomainTitle({
    sourceDomainId: "supply_chain",
    targetDomainId: "retail",
    relationshipType: "delivery_impact",
  });
  const summary = buildCrossDomainSummary({
    sourceDomainId: "supply_chain",
    targetDomainId: "retail",
    relationshipType: "delivery_impact",
    focus: "Supplier dependency",
  });
  const impact = buildCrossDomainExecutiveImpact({
    severity: "high",
    sourceDomainId: "supply_chain",
    targetDomainId: "retail",
  });

  assert.equal(title, "supply chain pressure is affecting retail");
  assert.ok(summary.includes("downstream retail delivery fragility"));
  assert.ok(impact.includes("executive attention"));
});
