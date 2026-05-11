import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  buildDomainObjectCatalog,
  getAddObjectMenuItemsForDomain,
  getSuggestedVisualForRole,
} from "./index.ts";

function assertNoDuplicateIds(ids: string[]): void {
  assert.equal(new Set(ids).size, ids.length);
}

test("general catalog builds", () => {
  const catalog = buildDomainObjectCatalog("general");
  assert.ok(catalog.length >= 5);
  assert.equal(catalog[0]?.domainId, "general");
});

test("retail catalog builds", () => {
  const catalog = buildDomainObjectCatalog("retail");
  assert.ok(catalog.some((item) => item.templateId === "retail_inventory"));
  assert.ok(catalog.some((item) => item.label === "Customer Demand"));
});

test("unknown domain falls back to general catalog", () => {
  const catalog = buildDomainObjectCatalog("not_real");
  assert.ok(catalog.length >= 5);
  assert.ok(catalog.every((item) => item.domainId === "general"));
});

test("each catalog item has stable id", () => {
  const catalog = buildDomainObjectCatalog("supply_chain");
  for (const item of catalog) {
    assert.equal(item.id, `${item.domainId}:${item.templateId}`);
  }
});

test("each menu item has iconHint colorHint and targetPanel", () => {
  const menuItems = getAddObjectMenuItemsForDomain("finance");
  assert.ok(menuItems.length >= 5);

  for (const item of menuItems) {
    assert.ok(item.iconHint);
    assert.ok(item.colorHint);
    assert.ok(item.targetPanel);
  }
});

test("no duplicate IDs in a domain catalog", () => {
  const catalog = buildDomainObjectCatalog("security");
  assertNoDuplicateIds(catalog.map((item) => item.id));
});

test("role visual mapping is deterministic", () => {
  assert.deepEqual(getSuggestedVisualForRole("risk"), {
    suggestedShape: "shield",
    suggestedColorToken: "red",
    suggestedPanel: "risk",
  });
  assert.deepEqual(getSuggestedVisualForRole("decision"), {
    suggestedShape: "diamond",
    suggestedColorToken: "purple",
    suggestedPanel: "scenario",
  });
});
