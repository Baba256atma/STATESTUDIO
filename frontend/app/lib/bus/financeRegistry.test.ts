import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveFinancePlatformFoundation,
  FINANCIAL_OBJECT_TYPES,
} from "./financeIndex.ts";
import {
  ExecutiveFinanceRegistryFoundation,
  FinanceApiRegistry,
  FinanceCategoryRegistry,
  FinanceObjectRegistry,
  findFinanceObjectByCode,
  findFinanceObjectsByCategory,
  getFinanceApiRegistry,
  getFinanceCategoryRegistry,
  getFinanceObjectRegistry,
  getFinanceRegistryManifest,
} from "./financeRegistryIndex.ts";

test("consumes BUS-28:1 through public index", () => {
  assert.equal(ExecutiveFinancePlatformFoundation.FinanceIdentity.platformId, "BUS-28");
  assert.equal(ExecutiveFinancePlatformFoundation.FinanceContracts.contractLayer, "BUS-28:1");
});

test("publishes immutable finance object registry", () => {
  const registry = getFinanceObjectRegistry();

  assert.equal(registry, FinanceObjectRegistry);
  assert.equal(registry.objects.length, 16);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.objects), true);
});

test("registers all canonical finance objects", () => {
  const objectTypes = FinanceObjectRegistry.objects.map((entry) => entry.type);

  assert.deepEqual(objectTypes, [...FINANCIAL_OBJECT_TYPES]);
  assert.equal(findFinanceObjectByCode("FIN-REVENUE")?.name, "Revenue");
  assert.equal(findFinanceObjectByCode("FIN-FINANCIALSTATEMENT")?.category, "Statement");
});

test("publishes immutable category registry", () => {
  const registry = getFinanceCategoryRegistry();

  assert.equal(registry, FinanceCategoryRegistry);
  assert.equal(registry.categories.length, 9);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.categories), true);
});

test("category lookups work deterministically", () => {
  const planningObjects = findFinanceObjectsByCategory("Planning");
  const secondPlanningObjects = findFinanceObjectsByCategory("Planning");

  assert.equal(planningObjects.length, 2);
  assert.equal(planningObjects[0].type, "Budget");
  assert.equal(planningObjects[1].type, "Forecast");
  assert.deepEqual(planningObjects, secondPlanningObjects);
  assert.equal(Object.isFrozen(planningObjects), true);
});

test("publishes immutable api registry", () => {
  const apiRegistry = getFinanceApiRegistry();

  assert.equal(apiRegistry, FinanceApiRegistry);
  assert.equal(apiRegistry.apis.length, 10);
  assert.equal(apiRegistry.apis.every((entry) => entry.runtimeBehavior === false), true);
  assert.equal(Object.isFrozen(apiRegistry), true);
});

test("manifest counts are correct", () => {
  const manifest = getFinanceRegistryManifest();

  assert.equal(manifest.phaseId, "BUS-28:2");
  assert.equal(manifest.platformCode, "EXEC_FIN");
  assert.equal(manifest.objectCount, 16);
  assert.equal(manifest.categoryCount, 9);
  assert.equal(manifest.publicApiCount, 10);
  assert.equal(manifest.boundaries.includes("metadata-only"), true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("publishes registry foundation facade", () => {
  assert.equal(typeof ExecutiveFinanceRegistryFoundation.getFinanceObjectRegistry, "function");
  assert.equal(typeof ExecutiveFinanceRegistryFoundation.getFinanceCategoryRegistry, "function");
  assert.equal(typeof ExecutiveFinanceRegistryFoundation.getFinanceApiRegistry, "function");
  assert.equal(typeof ExecutiveFinanceRegistryFoundation.getFinanceRegistryManifest, "function");
  assert.equal(typeof ExecutiveFinanceRegistryFoundation.findFinanceObjectByCode, "function");
  assert.equal(typeof ExecutiveFinanceRegistryFoundation.findFinanceObjectsByCategory, "function");
  assert.equal(Object.isFrozen(ExecutiveFinanceRegistryFoundation), true);
});
