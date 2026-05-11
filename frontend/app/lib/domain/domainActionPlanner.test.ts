import { test } from "node:test";
import * as assert from "node:assert/strict";

import { buildDomainActionPlan } from "./domainActionPlanner.ts";
import type { DomainChatInterpretation } from "./domainChatIntents.ts";

function interpretation(overrides: Partial<DomainChatInterpretation>): DomainChatInterpretation {
  return {
    rawText: "add supplier inventory",
    detectedDomainId: "supply_chain",
    intent: "create_object",
    confidence: 0.82,
    entities: [
      { label: "Supplier", matchedTemplateId: "supply_chain_supplier", matchedDomainId: "supply_chain", confidence: 0.9 },
      { label: "Inventory", matchedTemplateId: "supply_chain_inventory", matchedDomainId: "supply_chain", confidence: 0.88 },
      { label: "Logistics", matchedTemplateId: "supply_chain_logistics", matchedDomainId: "supply_chain", confidence: 0.78 },
    ],
    suggestedActions: [],
    ...overrides,
  };
}

test("create object plan caps automatic creation at two objects", () => {
  const actions = buildDomainActionPlan(interpretation({}));

  assert.equal(actions.length, 2);
  assert.equal(actions.every((action) => action.type === "ADD_DOMAIN_OBJECT"), true);
});

test("connect object plan creates one connection action", () => {
  const actions = buildDomainActionPlan(interpretation({ intent: "connect_objects" }));

  assert.equal(actions.length, 1);
  assert.equal(actions[0]?.type, "CONNECT_DOMAIN_OBJECTS");
});

test("open risk intent creates panel action", () => {
  const actions = buildDomainActionPlan(interpretation({ intent: "analyze_risk", entities: [] }));

  assert.equal(actions.length, 1);
  assert.equal(actions[0]?.type, "OPEN_PANEL");
});

test("duplicate actions are prevented", () => {
  const actions = buildDomainActionPlan(interpretation({
    entities: [
      { label: "Supplier", matchedTemplateId: "supply_chain_supplier", matchedDomainId: "supply_chain", confidence: 0.9 },
      { label: "Supplier", matchedTemplateId: "supply_chain_supplier", matchedDomainId: "supply_chain", confidence: 0.9 },
    ],
  }));

  assert.equal(actions.length, 1);
});
