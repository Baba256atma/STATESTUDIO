import { test } from "node:test";
import * as assert from "node:assert/strict";

import { createDomainSceneObject } from "./domainObjectCreation.ts";

test("valid domain object creation returns normalized scene object", () => {
  const result = createDomainSceneObject({
    domainId: "supply_chain",
    templateId: "supply_chain_supplier",
    source: "user_add",
    preferredPosition: "auto",
  });

  assert.equal(result.success, true);
  assert.equal(result.createdObjectId, "domain_supply_chain_supplier");
  assert.equal(result.normalizedObject?.label, "Supplier");
  assert.equal(result.normalizedObject?.domain, "supply_chain");
  assert.equal(result.normalizedObject?.semantic?.role, "input");
  assert.equal(result.targetPanel, "objects");
});

test("invalid template safely falls back to first domain template", () => {
  const result = createDomainSceneObject({
    domainId: "finance",
    templateId: "missing_template",
    source: "user_add",
  });

  assert.equal(result.success, true);
  assert.equal(result.normalizedObject?.id, "domain_finance_revenue");
  assert.ok(result.warnings?.some((warning) => warning.startsWith("template_not_found")));
});

test("unknown runtime domain falls back to general", () => {
  const result = createDomainSceneObject({
    domainId: "not_real" as never,
    templateId: "general_risk",
    label: "Custom Risk",
    source: "chat_inferred",
  });

  assert.equal(result.success, true);
  assert.equal(result.normalizedObject?.domain, "general");
  assert.equal(result.normalizedObject?.label, "Custom Risk");
  assert.ok(result.warnings?.includes("domain_fallback_applied"));
});

test("metadata is preserved when supported by scene object schema", () => {
  const result = createDomainSceneObject({
    domainId: "security",
    templateId: "security_vulnerability",
    source: "scenario_generation",
  });
  const meta = result.normalizedObject?.meta as Record<string, unknown> | undefined;

  assert.equal(meta?.domainId, "security");
  assert.equal(meta?.templateId, "security_vulnerability");
  assert.equal(meta?.createdFrom, "domain_catalog");
  assert.equal(meta?.creationSource, "scenario_generation");
  assert.equal(meta?.semanticRole, "risk");
  assert.equal(typeof meta?.createdAt, "string");
});

test("ids are stable and valid for same request label", () => {
  const a = createDomainSceneObject({
    domainId: "retail",
    templateId: "retail_inventory",
    label: "Store Inventory",
    source: "user_add",
  });
  const b = createDomainSceneObject({
    domainId: "retail",
    templateId: "retail_inventory",
    label: "Store Inventory",
    source: "user_add",
  });

  assert.equal(a.createdObjectId, b.createdObjectId);
  assert.equal(a.createdObjectId, "domain_retail_store_inventory");
});
