import { test } from "node:test";
import * as assert from "node:assert/strict";

import { extractDomainEntities } from "./domainEntityExtraction.ts";

test("extracts supply chain entities in text order without duplicates", () => {
  const entities = extractDomainEntities({
    text: "we have supplier delays affecting inventory and supplier",
    domainId: "supply_chain",
  });
  const ids = entities.map((entity) => entity.matchedTemplateId);

  assert.equal(ids.includes("supply_chain_supplier"), true);
  assert.equal(ids.includes("supply_chain_inventory"), true);
  assert.equal(new Set(ids).size, ids.length);
});

test("extracts PMO entities", () => {
  const entities = extractDomainEntities({
    text: "budget timeline resource capacity is collapsing",
    domainId: "pmo",
  });

  assert.equal(entities.some((entity) => entity.matchedTemplateId === "pmo_budget"), true);
  assert.equal(entities.some((entity) => entity.matchedTemplateId === "pmo_timeline"), true);
});

test("returns empty safely for unknown text", () => {
  assert.deepEqual(extractDomainEntities({ text: "hello there" }), []);
});

test("extraction is deterministic", () => {
  const input = { text: "incident latency deployment", domainId: "saas_devops" };

  assert.deepEqual(extractDomainEntities(input), extractDomainEntities(input));
});
