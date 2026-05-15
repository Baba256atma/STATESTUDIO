import { test } from "node:test";
import * as assert from "node:assert/strict";

import { explainDomainRelationship } from "./domainRelationshipExplanation.ts";

test("explains dependency relationships in executive language", () => {
  const explanation = explainDomainRelationship({
    sourceLabel: "Inventory",
    targetLabel: "Delivery",
    meta: { semantic: "dependency", strength: 0.82, directional: true },
    domainId: "supply_chain",
  });

  assert.equal(explanation, "Delivery depends on Inventory stability.");
});

test("explains monitoring relationships without inventing state", () => {
  const explanation = explainDomainRelationship({
    sourceLabel: "Alerting",
    targetLabel: "Database",
    meta: { semantic: "monitoring", strength: 0.48, directional: true },
  });

  assert.equal(explanation, "Alerting monitors Database conditions for executive awareness.");
});
