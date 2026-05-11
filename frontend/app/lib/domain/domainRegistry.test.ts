import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  findDomainObjectTemplate,
  getDomainDefinition,
  inferDomainFromText,
  listDomainDefinitions,
} from "./index.ts";

test("unknown domain falls back to general", () => {
  assert.equal(getDomainDefinition("unknown_domain").id, "general");
  assert.equal(getDomainDefinition(null).id, "general");
});

test("every domain has object templates", () => {
  const domains = listDomainDefinitions();
  assert.ok(domains.length >= 7);

  for (const domain of domains) {
    assert.ok(domain.objectTemplates.length >= 5, `${domain.id} should have starter templates`);
  }
});

test("every object template has id, label, and role", () => {
  for (const domain of listDomainDefinitions()) {
    for (const template of domain.objectTemplates) {
      assert.ok(template.id, `${domain.id} template missing id`);
      assert.ok(template.label, `${domain.id} template missing label`);
      assert.ok(template.role, `${domain.id} template missing role`);
    }
  }
});

test("inferDomainFromText detects supply chain or retail inventory language", () => {
  assert.equal(inferDomainFromText("inventory supplier delay"), "supply_chain");
});

test("inferDomainFromText detects finance language", () => {
  assert.equal(inferDomainFromText("cash flow and revenue pressure"), "finance");
});

test("inferDomainFromText detects PMO language", () => {
  assert.equal(inferDomainFromText("timeline budget resource risk"), "pmo");
});

test("inferDomainFromText detects SaaS DevOps language", () => {
  assert.equal(inferDomainFromText("incident latency reliability problem"), "saas_devops");
});

test("inferDomainFromText detects security language", () => {
  assert.equal(inferDomainFromText("vulnerability access exposure"), "security");
});

test("findDomainObjectTemplate is case-insensitive and alias-aware", () => {
  const template = findDomainObjectTemplate("supply_chain", "Vendor lead time is slipping");
  assert.equal(template?.id, "supply_chain_supplier");
});
